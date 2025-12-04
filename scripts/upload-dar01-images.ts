/**
 * Script to optimize and upload DAR01 portfolio images to Sanity
 * Run with: npx tsx scripts/upload-dar01-images.ts
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync, existsSync, readdirSync, writeFileSync, mkdirSync } from 'fs';
import sharp from 'sharp';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0zrzz3rh';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;

if (!token) {
  console.error('❌ Error: SANITY_API_WRITE_TOKEN or SANITY_API_READ_TOKEN must be set in .env.local');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion: '2024-01-01',
  token,
});

async function optimizeImage(inputPath: string, backupPath?: string): Promise<Buffer> {
  const imageBuffer = readFileSync(inputPath);
  const metadata = await sharp(imageBuffer).metadata();
  
  let sharpInstance = sharp(imageBuffer);
  
  // Handle TIF files - convert to RGB if needed
  if (metadata.format === 'tiff' || metadata.format === 'tif') {
    sharpInstance = sharpInstance.ensureAlpha().flatten({ background: { r: 255, g: 255, b: 255 } });
  }
  
  // Check if the input is a PNG and has an alpha channel, then flatten for WebP
  if (metadata.format === 'png' && metadata.hasAlpha) {
    sharpInstance = sharpInstance.flatten({ background: { r: 255, g: 255, b: 255 } });
  }

  // Convert to WebP without resizing or cropping - maintain original dimensions
  const optimized = await sharpInstance
    .webp({ quality: 90, effort: 6 })
    .toBuffer();
  
  // Save to backup if backup path is provided
  if (backupPath) {
    const backupDir = resolve(process.cwd(), 'backups/optimized-images/dar01');
    if (!existsSync(backupDir)) {
      mkdirSync(backupDir, { recursive: true });
    }
    writeFileSync(backupPath, optimized);
    console.log(`   💾 Saved backup: ${backupPath}`);
  }
  
  return optimized;
}

async function uploadImage(buffer: Buffer, filename: string) {
  const asset = await client.assets.upload('image', buffer, {
    filename: filename,
  });
  return asset;
}

async function uploadDAR01Images() {
  console.log('🌱 Starting DAR01 portfolio image upload to Sanity...\n');

  try {
    // Find the DAR01 portfolio item
    const portfolioItems = await client.fetch(
      `*[_type == "portfolioItem" && (slug_en.current == "dar01-dubai-arena-coca-cola-arena" || slug_fr.current == "dar01-dubai-arena-coca-cola-arena")]`
    );

    if (portfolioItems.length === 0) {
      console.error('❌ DAR01 portfolio item not found. Please run "npx tsx scripts/add-dar01-portfolio.ts" first.');
      process.exit(1);
    }

    const portfolioItem = portfolioItems[0];
    console.log(`✅ Found portfolio item: ${portfolioItem.title_en || portfolioItem.title_fr}\n`);

    // Get all images from the dar-01 folder
    const imageFolder = 'dar-01';
    if (!existsSync(imageFolder)) {
      console.error(`❌ Image folder not found: ${imageFolder}`);
      process.exit(1);
    }

    const imageFiles = readdirSync(imageFolder)
      .filter(file => 
        /\.(jpg|jpeg|JPG|JPEG|png|PNG|tif|tiff|TIF|TIFF)$/i.test(file) && !file.startsWith('.')
      )
      .sort(); // Sort to ensure consistent ordering

    if (imageFiles.length === 0) {
      console.error(`❌ No images found in folder: ${imageFolder}`);
      process.exit(1);
    }

    console.log(`📸 Found ${imageFiles.length} images to upload\n`);

    // Use first "General View" image as main, rest as gallery
    // Sort to prioritize "01- General View" images first
    const sortedFiles = imageFiles.sort((a, b) => {
      // Prioritize "01- General View" files
      const aIsGeneral = a.includes('01- General View');
      const bIsGeneral = b.includes('01- General View');
      if (aIsGeneral && !bIsGeneral) return -1;
      if (!aIsGeneral && bIsGeneral) return 1;
      return a.localeCompare(b);
    });

    const mainImageFile = sortedFiles[0];
    const galleryImageFiles = sortedFiles.slice(1);

    // Upload main image
    console.log(`📸 Optimizing and uploading main image: ${mainImageFile}...`);
    const mainImagePath = resolve(imageFolder, mainImageFile);
    const mainBackupPath = resolve(process.cwd(), 'backups/optimized-images/dar01', `main-${mainImageFile.replace(/\.(jpg|jpeg|JPG|JPEG|png|PNG|tif|tiff|TIF|TIFF)$/i, '.webp')}`);
    const mainOptimized = await optimizeImage(mainImagePath, mainBackupPath);
    const mainAsset = await uploadImage(mainOptimized, `dar01-main-${mainImageFile.replace(/\.(jpg|jpeg|JPG|JPEG|png|PNG|tif|tiff|TIF|TIFF)$/i, '.webp')}`);
    console.log(`✅ Uploaded main image: ${mainAsset._id}\n`);

    // Upload gallery images
    const galleryAssets = [];
    for (let i = 0; i < galleryImageFiles.length; i++) {
      const galleryFile = galleryImageFiles[i];
      console.log(`📸 Optimizing and uploading gallery image ${i + 1}/${galleryImageFiles.length}: ${galleryFile}...`);
      const galleryImagePath = resolve(imageFolder, galleryFile);
      const galleryBackupPath = resolve(process.cwd(), 'backups/optimized-images/dar01', `gallery-${i + 1}-${galleryFile.replace(/\.(jpg|jpeg|JPG|JPEG|png|PNG|tif|tiff|TIF|TIFF)$/i, '.webp')}`);
      const galleryOptimized = await optimizeImage(galleryImagePath, galleryBackupPath);
      const galleryAsset = await uploadImage(galleryOptimized, `dar01-gallery-${i + 1}-${galleryFile.replace(/\.(jpg|jpeg|JPG|JPEG|png|PNG|tif|tiff|TIF|TIFF)$/i, '.webp')}`);
      galleryAssets.push(galleryAsset);
      console.log(`✅ Uploaded gallery image: ${galleryAsset._id}`);
    }
    console.log('');

    // Update portfolio item with images
    console.log('📝 Updating portfolio item with images...');
    await client
      .patch(portfolioItem._id)
      .set({
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: mainAsset._id,
          },
        },
        gallery: galleryAssets.map((asset, index) => ({
          _key: `gallery-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        })),
      })
      .commit();

    console.log('✅ Portfolio item updated successfully!\n');
    console.log(`🎉 All ${imageFiles.length} images uploaded and linked to DAR01 portfolio item!`);
    console.log(`   - Main image: 1`);
    console.log(`   - Gallery images: ${galleryImageFiles.length}`);
    console.log(`   - Backups saved to: backups/optimized-images/dar01/`);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

uploadDAR01Images();

