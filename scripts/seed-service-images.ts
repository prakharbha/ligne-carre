/**
 * Script to add images to existing services in Sanity
 * Run with: npx tsx scripts/seed-service-images.ts
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

async function seedServiceImages() {
  console.log('🌱 Adding images to services...');

  try {
    // Fetch all existing services
    const services = await client.fetch(`*[_type == "service"] | order(order asc)`);
    
    if (services.length === 0) {
      console.log('⚠️  No services found in Sanity');
      return;
    }

    console.log(`📋 Found ${services.length} services\n`);

    // Map service slugs to image files
    const imageMap: Record<string, string> = {
      'residential': 'service-residential.webp',
      'commercial': 'service-commercial.webp',
      'interior-design': 'service-interior-design.webp',
      'project-management': 'service-project-management.webp',
    };

    for (const service of services) {
      const slug = service.slug?.current;
      if (!slug) {
        console.log(`⚠️  Service "${service.title_en}" has no slug, skipping...`);
        continue;
      }

      const imageFileName = imageMap[slug];
      if (!imageFileName) {
        console.log(`⚠️  No image mapping found for service "${service.title_en}" with slug "${slug}", skipping...`);
        continue;
      }

      const imagePath = path.join(process.cwd(), 'public', 'images', imageFileName);
      
      if (!fs.existsSync(imagePath)) {
        console.log(`⚠️  Image file not found: ${imagePath}, skipping...`);
        continue;
      }

      // Check if service already has an image
      if (service.image?.asset?._ref) {
        console.log(`ℹ️  Service "${service.title_en}" already has an image, skipping...`);
        continue;
      }

      console.log(`📸 Uploading image for "${service.title_en}" (${imageFileName})...`);
      const imageAssetId = await uploadImage(imagePath);
      console.log(`✅ Image uploaded: ${imageAssetId}`);

      // Update service with image
      await client
        .patch(service._id)
        .set({
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imageAssetId,
            },
          },
        })
        .commit();

      console.log(`✅ Updated service "${service.title_en}" with image\n`);
    }

    console.log('✨ Seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding service images:', error);
    process.exit(1);
  }
}

seedServiceImages();

