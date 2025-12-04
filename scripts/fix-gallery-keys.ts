/**
 * Script to fix missing _key properties in portfolio item galleries
 * Run with: npx tsx scripts/fix-gallery-keys.ts
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { resolve } from 'path';

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

async function fixGalleryKeys() {
  console.log('🔧 Fixing missing _key properties in portfolio item galleries...\n');

  try {
    // Fetch all portfolio items
    const portfolioItems = await client.fetch('*[_type == "portfolioItem"]');

    if (portfolioItems.length === 0) {
      console.log('⚠️  No portfolio items found.');
      return;
    }

    console.log(`📋 Found ${portfolioItems.length} portfolio item(s)\n`);

    let fixedCount = 0;

    for (const item of portfolioItems) {
      if (!item.gallery || !Array.isArray(item.gallery)) {
        continue;
      }

      // Check if any gallery items are missing _key
      const needsFix = item.gallery.some((img: any) => !img._key);

      if (!needsFix) {
        console.log(`✅ ${item.title_en || item.title_fr || item._id}: Gallery keys already present`);
        continue;
      }

      // Fix gallery items by adding _key to those missing it
      const fixedGallery = item.gallery.map((img: any, index: number) => {
        if (img._key) {
          return img; // Keep existing _key
        }
        return {
          ...img,
          _key: `gallery-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
      });

      // Update the portfolio item
      await client
        .patch(item._id)
        .set({ gallery: fixedGallery })
        .commit();

      console.log(`✅ Fixed: ${item.title_en || item.title_fr || item._id}`);
      fixedCount++;
    }

    console.log(`\n🎉 Fixed ${fixedCount} portfolio item(s) with missing gallery keys!`);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

fixGalleryKeys();

