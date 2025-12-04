/**
 * Script to re-upload all portfolio images from backup directory to Sanity
 * This is useful after running seed script which deletes and recreates portfolio items
 * Run with: npx tsx scripts/re-upload-all-images.ts
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync, existsSync, readdirSync } from 'fs';
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

async function uploadImage(buffer: Buffer, filename: string) {
  const asset = await client.assets.upload('image', buffer, {
    filename: filename,
  });
  return asset;
}

async function reUploadProjectImages(projectSlug: string, projectName: string, backupDir: string) {
  console.log(`\n📦 Processing ${projectName}...`);
  
  if (!existsSync(backupDir)) {
    console.log(`   ⚠️  Backup directory not found: ${backupDir}`);
    return;
  }

  // Find the portfolio item
  const portfolioItems = await client.fetch(
    `*[_type == "portfolioItem" && (slug_en.current == $slug || slug_fr.current == $slug)][0]`,
    { slug: projectSlug }
  );

  if (!portfolioItems) {
    console.log(`   ⚠️  Portfolio item not found for slug: ${projectSlug}`);
    return;
  }

  console.log(`   ✅ Found portfolio item: ${portfolioItems.title_en || portfolioItems.title_fr}`);

  // Get all WebP files from backup directory
  const imageFiles = readdirSync(backupDir)
    .filter(file => file.endsWith('.webp'))
    .sort();

  if (imageFiles.length === 0) {
    console.log(`   ⚠️  No images found in backup directory`);
    return;
  }

  console.log(`   📸 Found ${imageFiles.length} images in backup`);

  // First image is main, rest are gallery
  const mainImageFile = imageFiles[0];
  const galleryImageFiles = imageFiles.slice(1);

  // Upload main image
  console.log(`   📤 Uploading main image: ${mainImageFile}...`);
  const mainBuffer = readFileSync(`${backupDir}/${mainImageFile}`);
  const mainAsset = await uploadImage(mainBuffer, `${projectName}-main-${mainImageFile}`);
  console.log(`   ✅ Uploaded main image: ${mainAsset._id}`);

  // Upload gallery images
  const galleryAssets = [];
  for (const galleryFile of galleryImageFiles) {
    console.log(`   📤 Uploading gallery image: ${galleryFile}...`);
    const galleryBuffer = readFileSync(`${backupDir}/${galleryFile}`);
    const galleryAsset = await uploadImage(galleryBuffer, `${projectName}-gallery-${galleryFile}`);
    galleryAssets.push(galleryAsset);
    console.log(`   ✅ Uploaded gallery image: ${galleryAsset._id}`);
  }

  // Update portfolio item
  console.log(`   📝 Updating portfolio item with images...`);
  await client
    .patch(portfolioItems._id)
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

  console.log(`   ✅ ${projectName} images updated successfully!`);
}

async function reUploadAllImages() {
  console.log('🌱 Starting re-upload of all portfolio images from backups...\n');

  try {
    // Define projects with their slugs and backup directories
    const projects = [
      {
        slug: 'fmc01-residential-commercial-solidere-lot-671',
        name: 'FMC01',
        backupDir: 'backups/optimized-images/fmc01',
      },
      {
        slug: 'fmc02-residential-project-solidere-lot-995',
        name: 'FMC02',
        backupDir: 'backups/optimized-images/fmc02',
      },
      {
        slug: 'fmc03-heritage-private-residence-lot-669',
        name: 'FMC03',
        backupDir: 'backups/optimized-images/fmc03',
      },
      {
        slug: 'dar02-ek-engineering-line-maintenance-hangars',
        name: 'DAR02',
        backupDir: 'backups/optimized-images/dar02',
      },
    ];

    for (const project of projects) {
      await reUploadProjectImages(project.slug, project.name, project.backupDir);
    }

    console.log('\n🎉 All portfolio images re-uploaded successfully!');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

reUploadAllImages();

