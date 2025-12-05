/**
 * Script to seed page banners for all pages in Sanity
 * Run with: npx tsx scripts/seed-page-banners.ts
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

async function seedPageBanners() {
  console.log('🌱 Seeding page banners...');

  try {
    // Use home-banner.jpg as default banner image for all pages
    const defaultImagePath = path.join(process.cwd(), 'public', 'images', 'home-banner.jpg');
    
    if (!fs.existsSync(defaultImagePath)) {
      console.error('❌ Default banner image not found:', defaultImagePath);
      console.log('   Please upload banner images manually in Sanity Studio');
      return;
    }

    console.log('📸 Uploading default banner image...');
    const imageAssetId = await uploadImage(defaultImagePath);
    console.log('✅ Image uploaded:', imageAssetId);

    // Page types that need banners
    const pageTypes = [
      { type: 'about', altText_en: 'About Page Banner', altText_fr: 'Bannière de la page À propos' },
      { type: 'services', altText_en: 'Services Page Banner', altText_fr: 'Bannière de la page Services' },
      { type: 'portfolio', altText_en: 'Portfolio Page Banner', altText_fr: 'Bannière de la page Portfolio' },
      { type: 'news', altText_en: 'News Page Banner', altText_fr: 'Bannière de la page Actualités' },
      { type: 'contact', altText_en: 'Contact Page Banner', altText_fr: 'Bannière de la page Contact' },
      { type: 'careers', altText_en: 'Careers Page Banner', altText_fr: 'Bannière de la page Carrières' },
      { type: 'privacy', altText_en: 'Privacy Policy Page Banner', altText_fr: 'Bannière de la page Politique de confidentialité' },
    ];

    for (const page of pageTypes) {
      // Check if page banner already exists
      const existing = await client.fetch(
        `*[_type == "pageBanner" && pageType == $pageType][0]`,
        { pageType: page.type }
      );

      if (existing) {
        console.log(`ℹ️  Page banner for "${page.type}" already exists, skipping...`);
        continue;
      }

      console.log(`➕ Creating page banner for "${page.type}"...`);
      
      const pageBanner: any = {
        _type: 'pageBanner',
        pageType: page.type,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAssetId,
          },
        },
        altText_en: page.altText_en,
        altText_fr: page.altText_fr,
      };

      await client.create(pageBanner);
      console.log(`✅ Created page banner for "${page.type}"`);
    }

    console.log('\n✨ Seeding complete!');
    console.log('📝 Note: You can update the banner images for each page in Sanity Studio');
  } catch (error) {
    console.error('❌ Error seeding page banners:', error);
    process.exit(1);
  }
}

seedPageBanners();

