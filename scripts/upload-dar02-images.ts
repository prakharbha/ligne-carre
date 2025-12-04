/**
 * Script to optimize and upload DAR02 portfolio images to Sanity
 * Run with: npx tsx scripts/upload-dar02-images.ts
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync, existsSync } from 'fs';
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

async function optimizeImage(inputPath: string): Promise<Buffer> {
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
  
  return optimized;
}

async function uploadImage(buffer: Buffer, filename: string) {
  const asset = await client.assets.upload('image', buffer, {
    filename: filename,
  });
  return asset;
}

async function uploadDAR02Images() {
  console.log('🌱 Starting DAR02 portfolio image upload to Sanity...\n');

  try {
    // Find the DAR02 portfolio item
    const portfolioItems = await client.fetch(
      `*[_type == "portfolioItem" && slug_en.current == "dar02-ek-engineering-line-maintenance-hangars"]`
    );

    if (portfolioItems.length === 0) {
      console.error('❌ DAR02 portfolio item not found. Please run the seed script first.');
      process.exit(1);
    }

    const portfolioItem = portfolioItems[0];
    console.log(`✅ Found portfolio item: ${portfolioItem.title_en}\n`);

    // Image files in root directory
    const imageFiles = ['Pers1.jpg', 'Pers2.jpg', 'pers3.jpg'];
    
    // Check if files exist
    const existingFiles = imageFiles.filter(file => existsSync(file));
    if (existingFiles.length === 0) {
      console.error(`❌ No images found in root directory`);
      process.exit(1);
    }

    console.log(`📸 Found ${existingFiles.length} images to upload\n`);

    // Use first image as main, rest as gallery
    const mainImageFile = existingFiles[0];
    const galleryImageFiles = existingFiles.slice(1);

    // Upload main image
    console.log(`📸 Optimizing and uploading main image: ${mainImageFile}...`);
    const mainOptimized = await optimizeImage(mainImageFile);
    const mainAsset = await uploadImage(mainOptimized, `dar02-main-${mainImageFile.replace(/\.(jpg|jpeg|JPG|JPEG|png|PNG|tif|tiff|TIF|TIFF)$/i, '.webp')}`);
    console.log(`✅ Uploaded main image: ${mainAsset._id}\n`);

    // Upload gallery images
    const galleryAssets = [];
    for (const galleryFile of galleryImageFiles) {
      console.log(`📸 Optimizing and uploading gallery image: ${galleryFile}...`);
      const galleryOptimized = await optimizeImage(galleryFile);
      const galleryAsset = await uploadImage(galleryOptimized, `dar02-gallery-${galleryFile.replace(/\.(jpg|jpeg|JPG|JPEG|png|PNG|tif|tiff|TIF|TIFF)$/i, '.webp')}`);
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
    console.log(`🎉 All ${existingFiles.length} images uploaded and linked to DAR02 portfolio item!`);
    console.log(`   - Main image: 1`);
    console.log(`   - Gallery images: ${galleryImageFiles.length}`);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

uploadDAR02Images();

