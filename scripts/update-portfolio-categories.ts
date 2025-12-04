/**
 * Script to update portfolio item categories based on the project table
 * Run with: npx tsx scripts/update-portfolio-categories.ts
 * 
 * This script ONLY updates categories for existing portfolio items.
 * It does NOT seed or modify any other content.
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

// Mapping of project slugs to categories based on the table
const categoryMapping: Record<string, string> = {
  // Residential projects
  'fmc01-residential-commercial-solidere-lot-671': 'residential',
  'fmc01-residentiel-commercial-solidere-lot-671': 'residential',
  'fmc02-residential-project-solidere-lot-995': 'residential',
  'fmc02-projet-residentiel-solidere-lot-995': 'residential',
  'fmc03-heritage-private-residence-lot-669': 'residential',
  'fmc03-residence-privee-patrimoniale-lot-669': 'residential',
  
  // Commercial projects
  'dar02-ek-engineering-line-maintenance-hangars': 'commercial',
  
  // Institutional projects
  'dar08-new-tepng-clinic-total-energies': 'institutional',
  
  // Cultural and Sports projects
  'dar01-dubai-arena-coca-cola-arena': 'cultural-sports',
  'dar04-saudi-entertainment-ventures-seven-yanbu': 'cultural-sports',
};

async function updatePortfolioCategories() {
  console.log('🔧 Updating portfolio item categories...\n');

  try {
    // Fetch all portfolio items
    const portfolioItems = await client.fetch('*[_type == "portfolioItem"]');

    if (portfolioItems.length === 0) {
      console.log('⚠️  No portfolio items found.');
      return;
    }

    console.log(`📋 Found ${portfolioItems.length} portfolio item(s)\n`);

    let updatedCount = 0;

    for (const item of portfolioItems) {
      const slugEn = item.slug_en?.current;
      const slugFr = item.slug_fr?.current;
      
      // Find the category from the mapping
      const newCategory = categoryMapping[slugEn || ''] || categoryMapping[slugFr || ''];
      
      if (!newCategory) {
        console.log(`⚠️  No category mapping found for: ${item.title_en || item.title_fr || item._id}`);
        console.log(`   Slugs: ${slugEn || 'N/A'} / ${slugFr || 'N/A'}\n`);
        continue;
      }

      // Check if category needs updating
      if (item.category === newCategory) {
        console.log(`✅ ${item.title_en || item.title_fr || item._id}: Already has correct category (${newCategory})`);
        continue;
      }

      // Update the category
      await client
        .patch(item._id)
        .set({ category: newCategory })
        .commit();

      console.log(`✅ Updated: ${item.title_en || item.title_fr || item._id}`);
      console.log(`   Category: ${item.category || 'none'} → ${newCategory}\n`);
      updatedCount++;
    }

    console.log(`\n🎉 Updated ${updatedCount} portfolio item(s) with new categories!`);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

updatePortfolioCategories();

