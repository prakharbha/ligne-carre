/**
 * Script to upload images to Sanity
 * Run with: npx tsx scripts/upload-images.ts
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

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

async function uploadImage(filePath: string, filename: string) {
  const buffer = readFileSync(filePath);
  const asset = await client.assets.upload('image', buffer, {
    filename: filename,
  });
  return asset;
}

async function uploadBannerImages() {
  console.log('🌱 Starting image upload to Sanity...\n');

  try {
    // Banner images
    const bannerImages = [
      {
        file: 'public/images/ligne-carre-banner-1.webp',
        order: 0,
        altText_en: 'Ligne Carré Architecture Banner 1',
        altText_fr: 'Bannière Architecture Ligne Carré 1',
      },
      {
        file: 'public/images/ligne-carre-banner-2.webp',
        order: 1,
        altText_en: 'Ligne Carré Architecture Banner 2',
        altText_fr: 'Bannière Architecture Ligne Carré 2',
      },
      {
        file: 'public/images/ligne-carre-banner-3.webp',
        order: 2,
        altText_en: 'Ligne Carré Architecture Banner 3',
        altText_fr: 'Bannière Architecture Ligne Carré 3',
      },
      {
        file: 'public/images/ligne-carre-banner-4.webp',
        order: 3,
        altText_en: 'Ligne Carré Architecture Banner 4',
        altText_fr: 'Bannière Architecture Ligne Carré 4',
      },
      {
        file: 'public/images/ligne-carre-banner-5.webp',
        order: 4,
        altText_en: 'Ligne Carré Architecture Banner 5',
        altText_fr: 'Bannière Architecture Ligne Carré 5',
      },
    ];

    console.log('📸 Uploading banner images...\n');

    // First, delete existing banner images to avoid duplicates
    const existingBanners = await client.fetch('*[_type == "bannerImage"]');
    if (existingBanners.length > 0) {
      console.log(`🗑️  Deleting ${existingBanners.length} existing banner images...`);
      for (const banner of existingBanners) {
        await client.delete(banner._id);
      }
      console.log('✅ Existing banners deleted\n');
    }

    // Upload and create banner image documents
    for (const banner of bannerImages) {
      console.log(`📤 Uploading ${banner.file}...`);
      const asset = await uploadImage(banner.file, `banner-${banner.order + 1}.webp`);
      
      console.log(`📝 Creating banner image document (order: ${banner.order})...`);
      await client.create({
        _type: 'bannerImage',
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        },
        order: banner.order,
        altText_en: banner.altText_en,
        altText_fr: banner.altText_fr,
      });
      console.log(`✅ Created banner ${banner.order + 1}\n`);
    }

    console.log('🎉 All banner images uploaded successfully!\n');

    // Upload images for portfolio items
    console.log('📸 Uploading portfolio item images...\n');
    
    const portfolioItems = await client.fetch('*[_type == "portfolioItem"] | order(order asc)');
    
    if (portfolioItems.length === 0) {
      console.log('⚠️  No portfolio items found. Run seed:sanity first.\n');
    } else {
      // Check which items are missing images
      const itemsWithoutImages = portfolioItems.filter((item: any) => !item.image || !item.image.asset);
      
      if (itemsWithoutImages.length > 0) {
        console.log(`📤 Found ${itemsWithoutImages.length} portfolio items without images. Uploading placeholder...`);
        const portfolioImageAsset = await uploadImage('public/images/home-banner.jpg', 'portfolio-placeholder.jpg');
        
        for (const item of itemsWithoutImages) {
          console.log(`📝 Updating portfolio item: ${item.title_en || item._id}...`);
          try {
            await client
              .patch(item._id)
              .set({
                image: {
                  _type: 'image',
                  asset: {
                    _type: 'reference',
                    _ref: portfolioImageAsset._id,
                  },
                },
              })
              .commit();
            console.log(`✅ Updated portfolio item: ${item.title_en || item._id}\n`);
          } catch (error: any) {
            console.error(`❌ Error updating ${item.title_en || item._id}:`, error.message);
          }
        }
        
        console.log(`✅ Updated ${itemsWithoutImages.length} portfolio items with images\n`);
      } else {
        console.log('✅ All portfolio items already have images\n');
      }
    }

    console.log('🎉 All images uploaded successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Go to /studio to view and customize the uploaded images');
    console.log('2. Replace portfolio placeholder images with actual project images');
    console.log('3. Add featured images to news articles if needed\n');

  } catch (error: any) {
    console.error('❌ Error uploading images:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.body, null, 2));
    }
    process.exit(1);
  }
}

uploadBannerImages();

