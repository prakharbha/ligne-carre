/**
 * Script to seed the about section image to Sanity
 * Run with: npx tsx scripts/seed-about-image.ts
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { resolve } from 'path';
import * as fs from 'fs';
import * as path from 'path';

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

async function uploadImage(imagePath: string) {
  const imageBuffer = fs.readFileSync(imagePath);
  const filename = path.basename(imagePath);
  
  const asset = await client.assets.upload('image', imageBuffer, {
    filename,
  });
  
  return asset._id;
}

async function seedAboutImage() {
  console.log('🌱 Seeding about section image...');

  try {
    // Upload the about image
    const imagePath = path.join(process.cwd(), 'public', 'images', 'about-section.webp');
    
    if (!fs.existsSync(imagePath)) {
      console.error('❌ Image not found at:', imagePath);
      process.exit(1);
    }

    console.log('📸 Uploading about section image...');
    const imageAssetId = await uploadImage(imagePath);
    console.log('✅ Image uploaded:', imageAssetId);

    // Fetch existing site settings
    const existingSettings = await client.fetch(
      `*[_type == "siteSettings"][0]`
    );

    if (!existingSettings) {
      console.error('❌ Site Settings document not found. Please create it first in Sanity Studio.');
      process.exit(1);
    }

    console.log('ℹ️  Updating site settings with about image...');
    
    // Patch only the aboutImage field, preserving all other data
    await client
      .patch(existingSettings._id)
      .set({
        'homepageCopy.aboutImage': {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAssetId,
          },
        },
      })
      .commit();
    
    console.log('✅ About section image updated successfully!');
    console.log('✨ Seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding about image:', error);
    process.exit(1);
  }
}

seedAboutImage();

