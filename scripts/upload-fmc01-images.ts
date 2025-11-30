/**
 * Script to optimize and upload FMC01 portfolio images to Sanity
 * Run with: npx tsx scripts/upload-fmc01-images.ts
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
  
  // Check if the input is a PNG and has an alpha channel, then flatten for WebP
  if (metadata.format === 'png' && metadata.hasAlpha) {
    sharpInstance = sharpInstance.flatten({ background: { r: 255, g: 255, b: 255 } });
  }

  // Optimize and convert to WebP
  const optimized = await sharpInstance
    .webp({ quality: 90 })
    .toBuffer();
  
  return optimized;
}

async function uploadImage(buffer: Buffer, filename: string) {
  const asset = await client.assets.upload('image', buffer, {
    filename: filename,
  });
  return asset;
}

async function uploadFMC01Images() {
  console.log('🌱 Starting FMC01 portfolio image upload to Sanity...\n');

  try {
    // Find the FMC01 portfolio item
    const portfolioItems = await client.fetch(
      `*[_type == "portfolioItem" && (slug_en.current == "fmc01-residential-commercial-solidere-lot-671" || slug_fr.current == "fmc01-residentiel-commercial-solidere-lot-671")]`
    );

    if (portfolioItems.length === 0) {
      console.error('❌ FMC01 portfolio item not found. Please run the seed script first.');
      process.exit(1);
    }

    const portfolioItem = portfolioItems[0];
    console.log(`✅ Found portfolio item: ${portfolioItem.title_en || portfolioItem.title_fr}\n`);

    // Check if images exist
    const afterImagePath = '671-After.jpg';
    const beforeImagePath = '671-Before.jpg';

    if (!existsSync(afterImagePath)) {
      console.error(`❌ Image not found: ${afterImagePath}`);
      process.exit(1);
    }

    if (!existsSync(beforeImagePath)) {
      console.error(`❌ Image not found: ${beforeImagePath}`);
      process.exit(1);
    }

    // Optimize and upload "After" image as main image (for thumbnail)
    console.log('📸 Optimizing and uploading "After" image (main image for thumbnail)...');
    const afterOptimized = await optimizeImage(afterImagePath);
    const afterAsset = await uploadImage(afterOptimized, 'fmc01-after.webp');
    console.log(`✅ Uploaded main image: ${afterAsset._id}\n`);

    // Optimize and upload "Before" image for gallery
    console.log('📸 Optimizing and uploading "Before" image (gallery)...');
    const beforeOptimized = await optimizeImage(beforeImagePath);
    const beforeAsset = await uploadImage(beforeOptimized, 'fmc01-before.webp');
    console.log(`✅ Uploaded gallery image: ${beforeAsset._id}\n`);

    // Update portfolio item with images
    console.log('📝 Updating portfolio item with images...');
    await client
      .patch(portfolioItem._id)
      .set({
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: afterAsset._id,
          },
        },
        gallery: [
          {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: beforeAsset._id,
            },
          },
        ],
      })
      .commit();

    console.log('✅ Portfolio item updated successfully!\n');
    console.log('🎉 All images uploaded and linked to FMC01 portfolio item!');
    console.log('   - Main image (thumbnail): 671-After.jpg');
    console.log('   - Gallery image: 671-Before.jpg');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

uploadFMC01Images();

