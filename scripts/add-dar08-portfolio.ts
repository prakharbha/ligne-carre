/**
 * Script to add DAR08 portfolio item to Sanity (without deleting existing content)
 * Run with: npx tsx scripts/add-dar08-portfolio.ts
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

// Helper function to add _key properties to Portable Text blocks
function addKeysToPortableText(blocks: any[], prefix: string = ''): any[] {
  const timestamp = Date.now();
  return blocks.map((block, index) => ({
    ...block,
    _key: `${prefix}block-${index}-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
    children: block.children?.map((child: any, childIndex: number) => ({
      ...child,
      _key: `${prefix}span-${index}-${childIndex}-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
    })) || [],
  }));
}

async function addDAR08Portfolio() {
  console.log('🌱 Adding DAR08 portfolio item to Sanity...\n');

  try {
    // Check if DAR08 already exists
    const existingItems = await client.fetch(
      `*[_type == "portfolioItem" && (slug_en.current == "dar08-new-tepng-clinic-total-energies" || slug_fr.current == "dar08-new-tepng-clinic-total-energies")]`
    );

    if (existingItems.length > 0) {
      console.log('⚠️  DAR08 portfolio item already exists. Skipping creation.');
      console.log(`   Found: ${existingItems[0].title_en || existingItems[0].title_fr}\n`);
      return;
    }

    // Get the highest order number to place DAR08 after existing items
    const allItems = await client.fetch('*[_type == "portfolioItem"] | order(order asc)');
    const maxOrder = allItems.length > 0 ? Math.max(...allItems.map((item: any) => item.order || 0)) : -1;
    const newOrder = maxOrder + 1;

    const portfolioItem = {
      _type: 'portfolioItem',
      title_en: 'DAR08 – New TEPNG Clinic (Total Energies)',
      title_fr: 'DAR08 - Nouvelle Clinique TEPNG (TotalEnergies)',
      slug_en: { current: 'dar08-new-tepng-clinic-total-energies' },
      slug_fr: { current: 'dar08-new-tepng-clinic-total-energies' },
      location_en: 'Port Harcourt – Nigeria',
      location_fr: 'Port Harcourt – Nigeria',
      year: '2012-2014',
      projectType: 'health',
      category: 'health',
      role_en: 'Senior Architect',
      role_fr: 'Architecte senior',
      client: 'TEPNG / Total Energies',
      area: '5,600 m²',
      estimatedCost: '',
      description_en: addKeysToPortableText([
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Project Overview' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Developed as Senior Architect at Dar Al Handasah, this project involved designing a modern medical clinic located within a secured oil and gas industrial base operated by TotalEnergies in Port Harcourt. The facility was conceived to meet international healthcare standards, ensuring compliance with global requirements for safety, emergency response, medical ergonomics, infection control, and operational reliability in a demanding industrial context.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'The clinic integrates advanced medical functions while responding to site-specific constraints such as industrial security, controlled access, and logistical proximity to essential oil-sector infrastructure.' }],
        },
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Responsibilities and Expertise' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Medical Programming & Functional Planning' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Development of a complete medical functional program, including:' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Emergency department' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Inpatient and observation rooms' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Imaging and radiology' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Laboratory' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Pharmacy' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Outpatient consultation suites' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Architectural Concept Development' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Design of clear and efficient building volumes adaptable for future expansion.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Implementation of strict separation of flows (patients, staff, service, sterile circuits) to comply with healthcare best practices.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Optimization of adjacencies for emergency care, diagnostics, and clinical operations.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Site Analysis & Industrial Integration' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Integration of the facility within an existing high-security oil and gas base, considering:' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Industrial safety protocols' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Controlled access and checkpoints' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Emergency evacuation routes' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Proximity to logistics, utilities, and operational facilities' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Technical Coordination & Multidisciplinary Review' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Coordination with structural, mechanical, electrical, HVAC, and fire-safety teams.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Compliance with healthcare standards, infection-control protocols, and industrial site regulations.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Verification and alignment of all technical documents across disciplines.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Regulatory & Standards Compliance' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Adherence to international hospital codes, universal accessibility requirements, medical hygiene standards, and local regulatory frameworks.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Integration of safety, emergency, and environmental requirements specific to medical facilities within oil-industry environments.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Production of Technical Documentation' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Full set of architectural drawings, including:' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Functional plans (ground floor, technical floors, and clinical areas)' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Elevations and sections' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Detailed HVAC and air-treatment layouts, medical gas networks, and sterile circuits' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Coordination of equipment zones, clean areas, waiting zones, staff facilities, technical rooms, and restricted environments.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Interior Design & Environmental Quality' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Conceptual perspectives highlighting interior ambiance for:' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Reception' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Circulation areas' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Meeting and consultation spaces' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Focus on patient well-being, natural lighting, staff comfort, and environmental performance.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Design Review & Cross-Disciplinary Coordination' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Continuous supervision to ensure compatibility between medical requirements and proposed engineering solutions.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Alignment of architectural intent with TotalEnergies\' safety, operational, and technical standards.' }],
        },
      ], 'dar08-en-'),
      description_fr: addKeysToPortableText([
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Présentation du Projet' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Développé en tant qu\'architecte senior au sein de Dar Al Handasah, ce projet consiste en la conception d\'une clinique médicale moderne implantée au cœur d\'une base industrielle pétrolière sécurisée exploitée par TotalEnergies à Port Harcourt. Le bâtiment répond aux normes internationales de santé, en intégrant les exigences liées à la sécurité, à la gestion des urgences, à l\'ergonomie médicale, au contrôle des infections et aux contraintes opérationnelles spécifiques à un environnement industriel.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'La clinique regroupe des fonctions médicales avancées tout en s\'adaptant aux protocoles stricts de sécurité, aux circulations contrôlées et aux impératifs logistiques d\'une base pétrolière.' }],
        },
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Responsabilités et expertises' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Programmation médicale et organisation fonctionnelle' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Élaboration d\'un programme fonctionnel complet, incluant :' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Urgences' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Hospitalisation et observation' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Imagerie médicale' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Laboratoire' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Pharmacie' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Salles de consultation' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Concept architectural et organisation des flux' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Conception de volumes clairs et modulables, anticipant la croissance future.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Mise en place d\'une séparation stricte des flux (patients, personnel, circuits techniques, zones stériles) conforme aux meilleures pratiques hospitalières.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Optimisation des relations fonctionnelles entre les espaces de soins, de diagnostic et d\'hébergement.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Analyse du site et intégration industrielle' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Intégration dans une base pétrolière avec contraintes élevées en matière de :' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Sécurité industrielle' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Contrôle d\'accès et checkpoints' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Routes d\'urgence et évacuation' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Proximité logistique des installations sensibles' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Coordination technique et revue pluridisciplinaire' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Coordination avec les équipes structure, MEP, CVC, sécurité incendie et réseaux médicaux.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Conformité aux normes hospitalières, et aux protocoles de contrôle des infections.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Vérification et harmonisation de l\'ensemble des documents techniques entre disciplines.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Étude réglementaire et conformité médicale' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Respect des réglementations hospitalières internationales, de l\'accessibilité universelle, des normes d\'hygiène, et des règles locales de construction.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Intégration des exigences de sécurité et de fonctionnement propres aux installations médicales en environnement pétrolier.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Production des documents techniques' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Plans fonctionnels : rez-de-chaussée, niveaux techniques, unités médicales.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Plans de façades, coupes et détails.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Détails CVC : circuits HVAC, traitement de l\'air, distribution des gaz médicaux, gestion des zones stériles.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Optimisation des zones critiques : salles de soins, vestiaires, zones techniques, espaces d\'attente, unités stériles.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Design intérieur et qualité environnementale' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Réalisation de perspectives d\'ambiance pour les zones d\'accueil, de circulation, de réunion et de consultation.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Valorisation du confort patient, de la lumière naturelle, des flux intuitifs et de la qualité environnementale intérieure.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Révisions et coordination globale' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Supervision continue assurant la compatibilité entre les exigences médicales et les solutions techniques proposées.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Alignement des intentions architecturales avec les standards opérationnels et sécuritaires de TotalEnergies.' }],
        },
      ], 'dar08-fr-'),
      order: newOrder,
    };

    const created = await client.create(portfolioItem);
    console.log(`✅ Created DAR08 portfolio item: ${created.title_en}\n`);
    console.log(`   Order: ${newOrder}`);
    console.log(`   ID: ${created._id}\n`);
    console.log('📝 Next step: Run "npx tsx scripts/upload-dar08-images.ts" to upload images\n');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.body, null, 2));
    }
    process.exit(1);
  }
}

addDAR08Portfolio();

