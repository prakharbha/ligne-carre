const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');
const images = [
  'Enscape_2025-06-25-21-36-05.jpg',
  '018_17A.jpg',
  '01-General-View-1.jpg',
  '03-General-3D-View.jpg',
];

async function optimizeImages() {
  console.log('Starting image optimization...\n');

  for (let i = 0; i < images.length; i++) {
    const inputPath = path.join(imagesDir, images[i]);
    const outputPath = path.join(imagesDir, `ligne-carre-banner-${i + 1}.webp`);
    const serialNumber = i + 1;

    try {
      // Check if input file exists
      if (!fs.existsSync(inputPath)) {
        console.log(`⚠️  Skipping ${images[i]} - file not found`);
        continue;
      }

      console.log(`Processing ${images[i]}...`);

      // Get image metadata
      const metadata = await sharp(inputPath).metadata();
      console.log(`  Original size: ${metadata.width}x${metadata.height}`);

      // Optimize and convert to WebP
      // For smaller images, use higher quality; for larger images, resize and use standard quality
      const shouldResize = metadata.width > 1920 || metadata.height > 1080;
      const quality = metadata.width < 1000 ? 90 : 85; // Higher quality for smaller images
      
      let pipeline = sharp(inputPath);
      
      if (shouldResize) {
        pipeline = pipeline.resize(1920, 1080, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }
      
      await pipeline
        .webp({
          quality: quality,
          effort: 6, // Higher effort = better compression (0-6)
        })
        .toFile(outputPath);

      // Get file sizes
      const originalStats = fs.statSync(inputPath);
      const optimizedStats = fs.statSync(outputPath);
      const originalSizeKB = (originalStats.size / 1024).toFixed(2);
      const optimizedSizeKB = (optimizedStats.size / 1024).toFixed(2);
      const savings = ((1 - optimizedStats.size / originalStats.size) * 100).toFixed(1);

      console.log(`  ✅ Created: ligne-carre-banner-${serialNumber}.webp`);
      console.log(`  Original: ${originalSizeKB} KB → Optimized: ${optimizedSizeKB} KB (${savings}% smaller)\n`);
    } catch (error) {
      console.error(`  ❌ Error processing ${images[i]}:`, error.message);
    }
  }

  console.log('✅ Image optimization complete!');
}

optimizeImages().catch(console.error);

