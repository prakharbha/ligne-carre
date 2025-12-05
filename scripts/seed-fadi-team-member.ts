/**
 * Script to seed Fadi's team member data to Sanity
 * Run with: npx tsx scripts/seed-fadi-team-member.ts
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

async function seedFadiTeamMember() {
  console.log('🌱 Seeding Fadi team member...');

  try {
    // Upload Fadi's image
    const imagePath = path.join(process.cwd(), 'public', 'images', 'fadi-abou-sader.webp');
    let imageAssetId: string | null = null;
    
    if (fs.existsSync(imagePath)) {
      console.log('📸 Uploading Fadi\'s image...');
      imageAssetId = await uploadImage(imagePath);
      console.log('✅ Image uploaded:', imageAssetId);
    } else {
      console.log('⚠️  Image not found at:', imagePath);
      console.log('   You will need to upload the image manually in Sanity Studio');
    }

    // Check if Fadi already exists
    const existing = await client.fetch(
      `*[_type == "teamMember" && name_en == "Fadi Abou-Sader"][0]`
    );

    if (existing) {
      console.log('ℹ️  Fadi team member already exists, updating...');
      
      const updateData: any = {
        name_en: 'Fadi Abou-Sader',
        name_fr: 'Fadi Abou-Sader',
        title_en: 'Architect OAQ – Project Manager | MGPA',
        title_fr: 'Architecte OAQ – Gestionnaire de Projets | MGPA',
        bio_en: 'Fadi Abou-Sader is an architect, member of the Ordre des Architectes du Québec (OAQ) and the Order of Architects of Beirut, with over 28 years of experience in Lebanon, Quebec, and the MENA region. A graduate of the Lebanese Academy of Fine Arts and holder of a master\'s degree in project setup and management from the University of Montreal, he has led residential, institutional, and sports projects, combining innovative architecture and rigorous management. As the founder of Ligne Carré Inc., he accompanies his clients from the first sketch to final delivery, with a human, accessible approach focused on precision—because every line counts.',
        bio_fr: 'Fadi Abou-Sader est architecte, membre de l\'Ordre des Architectes du Québec (OAQ) et de l\'Ordre des Architectes de Beyrouth, cumulant plus de 28 ans d\'expérience au Liban, au Québec et dans la région MENA. Diplômé de l\'Académie Libanaise des Beaux-Arts et titulaire d\'une maîtrise en montage et gestion de projet de l\'Université de Montréal, il a dirigé des projets résidentiels, institutionnels et sportifs, alliant architecture innovante et gestion rigoureuse. Fondateur de Ligne Carré Inc., il accompagne ses clients du premier croquis à la livraison finale, avec une approche humaine, accessible, et orientée vers la précision — parce que chaque ligne compte.',
        linkedinUrl: 'https://linkedin.com/in/fadi-abousader-104a03110',
        order: 0,
      };

      if (imageAssetId) {
        updateData.image = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAssetId,
          },
        };
      }

      await client
        .patch(existing._id)
        .set(updateData)
        .commit();
      
      console.log('✅ Fadi team member updated successfully!');
    } else {
      console.log('➕ Creating new Fadi team member...');
      
      const teamMember = {
        _type: 'teamMember',
        name_en: 'Fadi Abou-Sader',
        name_fr: 'Fadi Abou-Sader',
        title_en: 'Architect OAQ – Project Manager | MGPA',
        title_fr: 'Architecte OAQ – Gestionnaire de Projets | MGPA',
        bio_en: 'Fadi Abou-Sader is an architect, member of the Ordre des Architectes du Québec (OAQ) and the Order of Architects of Beirut, with over 28 years of experience in Lebanon, Quebec, and the MENA region. A graduate of the Lebanese Academy of Fine Arts and holder of a master\'s degree in project setup and management from the University of Montreal, he has led residential, institutional, and sports projects, combining innovative architecture and rigorous management. As the founder of Ligne Carré Inc., he accompanies his clients from the first sketch to final delivery, with a human, accessible approach focused on precision—because every line counts.',
        bio_fr: 'Fadi Abou-Sader est architecte, membre de l\'Ordre des Architectes du Québec (OAQ) et de l\'Ordre des Architectes de Beyrouth, cumulant plus de 28 ans d\'expérience au Liban, au Québec et dans la région MENA. Diplômé de l\'Académie Libanaise des Beaux-Arts et titulaire d\'une maîtrise en montage et gestion de projet de l\'Université de Montréal, il a dirigé des projets résidentiels, institutionnels et sportifs, alliant architecture innovante et gestion rigoureuse. Fondateur de Ligne Carré Inc., il accompagne ses clients du premier croquis à la livraison finale, avec une approche humaine, accessible, et orientée vers la précision — parce que chaque ligne compte.',
        linkedinUrl: 'https://linkedin.com/in/fadi-abousader-104a03110',
        order: 0,
      };

      if (imageAssetId) {
        teamMember.image = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAssetId,
          },
        };
      }

      await client.create(teamMember);
      console.log('✅ Fadi team member created successfully!');
    }

    console.log('✨ Seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding Fadi team member:', error);
    process.exit(1);
  }
}

seedFadiTeamMember();

