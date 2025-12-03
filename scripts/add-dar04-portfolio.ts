/**
 * Script to add DAR04 portfolio item to Sanity (without deleting existing content)
 * Run with: npx tsx scripts/add-dar04-portfolio.ts
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

async function addDAR04Portfolio() {
  console.log('🌱 Adding DAR04 portfolio item to Sanity...\n');

  try {
    // Check if DAR04 already exists
    const existingItems = await client.fetch(
      `*[_type == "portfolioItem" && (slug_en.current == "dar04-saudi-entertainment-ventures-seven-yanbu" || slug_fr.current == "dar04-saudi-entertainment-ventures-seven-yanbu")]`
    );

    if (existingItems.length > 0) {
      console.log('⚠️  DAR04 portfolio item already exists. Skipping creation.');
      console.log(`   Found: ${existingItems[0].title_en || existingItems[0].title_fr}\n`);
      return;
    }

    // Get the highest order number to place DAR04 after existing items
    const allItems = await client.fetch('*[_type == "portfolioItem"] | order(order asc)');
    const maxOrder = allItems.length > 0 ? Math.max(...allItems.map((item: any) => item.order || 0)) : -1;
    const newOrder = maxOrder + 1;

    const portfolioItem = {
      _type: 'portfolioItem',
      title_en: 'DAR04 – Saudi Entertainment Ventures (SEVEN) Yanbu – Kingdom of Saudi Arabia',
      title_fr: 'DAR04 - Saudi Entertainment Ventures (SEVEN) Yanbu – Royaume d\'Arabie Saoudite',
      slug_en: { current: 'dar04-saudi-entertainment-ventures-seven-yanbu' },
      slug_fr: { current: 'dar04-saudi-entertainment-ventures-seven-yanbu' },
      location_en: 'Yanbu – Kingdom of Saudi Arabia',
      location_fr: 'Yanbu – Royaume d\'Arabie Saoudite',
      year: '2021',
      projectType: 'commercial',
      category: 'commercial',
      role_en: 'Senior Architect-Coordinator',
      role_fr: 'Architecte Senior-coordonnateur',
      client: 'SEVEN',
      area: '12,250 m²',
      estimatedCost: 'Approximately USD 38 million',
      description_en: addKeysToPortableText([
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Project Overview' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Developed under the national Saudi Entertainment Ventures (SEVEN) program, this waterfront destination represents a key milestone in Saudi Arabia\'s Vision 2030 strategy to expand cultural, recreational, and family-oriented entertainment offerings. Located on an artificial island in Yanbu, the project was designed in my capacity as Senior Architect-Coordinator at Dar Al-Handasah, bringing together a rich program of leisure, sports, cinema, and immersive attractions.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'The project delivers an engaging and modern entertainment experience, combining multiple activities within a cohesive architectural and urban framework tailored for families and visitors of all ages.' }],
        },
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Responsibilities and Expertise' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Programming and Site Analysis' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Comprehensive study of the coastal context, including visibility, orientation, and exposure to sea views.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Assessment of access, parking distribution, emergency service routes, and pedestrian circulation networks.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Master Planning and Site Organization' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Development of a strategic site plan structured around a vibrant central spine.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Definition of pedestrian zones, service and fire-access routes, VIP drop-off areas, and operational logistics.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Architectural Concept Development' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Design of a dynamic spatial sequence centered around a main atrium (Black Box Flex) serving as the project\'s organizing hub.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Creation of an immersive and fluid experience linking all activity zones.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Project Typology and Massing Strategy' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Adoption of a pavilion-style architectural approach, assigning each entertainment function its own dedicated building volume.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Harmonized massing composition, controlled building heights, and strong architectural frontage facing the sea.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Functional Program Included' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Family Entertainment Center (FEC)' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'AMC Cinema' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Black Box Flex multifunctional event hall' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Bowling complex' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Indoor mini-golf' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Clip & Climb interactive climbing wall' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Interior Design and User Experience' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Emphasis on natural light, framed views, and circulation fluidity.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Creation of immersive atmospheres tailored to each activity zone, reinforcing the identity and user experience of the entire complex.' }],
        },
      ], 'dar04-en-'),
      description_fr: addKeysToPortableText([
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Présentation du Projet' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Ce projet s\'inscrit dans l\'initiative SEVEN (Saudi Entertainment Ventures), un programme stratégique soutenant la Vision 2030 visant à développer des complexes de loisirs modernes, accessibles et adaptés aux familles. Situé sur une île artificielle à Yanbu, ce centre de divertissement en front de mer a été développé dans le rôle d\'architecte senior-coordinateur au sein de Dar Al Handasah.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Le projet propose un parcours immersif combinant loisirs, sport, cinéma, jeux interactifs et espaces polyvalents, créant une nouvelle destination culturelle et récréative sur la côte saoudienne.' }],
        },
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Responsabilités et expertises' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Analyse programmatique et étude du site' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Analyse du contexte côtier, contraintes de visibilité et orientation face à la mer.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Évaluation des accès, du stationnement, des réseaux d\'urgence et des circulations publiques.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Planification du site et organisation des flux' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Élaboration d\'un plan directeur structuré autour d\'une artère centrale animée.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Zonation piétonne, accès service/sécurité, zones VIP et points de dépose dédiés.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Concept architectural' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Conception d\'un parcours spatial dynamique organisé autour d\'un atrium central (Black Box Flex) distribuant l\'ensemble des fonctions.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Architecture pensée pour offrir une expérience fluide, immersive et adaptée aux différents publics.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Typologie architecturale et composition volumétrique' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Développement d\'une architecture pavillonnaire, où chaque activité possède son propre volume dédié.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Composition harmonieuse des masses bâties, articulation des hauteurs et orientation optimisée face au littoral.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Programme fonctionnel' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Développement complet des espaces suivants :' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Family Entertainment Center (FEC)' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Cinéma AMC' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Salle polyvalente – Black Box Flex' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Bowling' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Mini-golf intérieur' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Clip & Climb (mur d\'escalade interactif)' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Design intérieur et ambiance' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Mise en valeur des vues et de la lumière naturelle.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Création d\'ambiances immersives différenciées selon les activités.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Importance accordée à la fluidité des circulations et à l\'expérience utilisateur.' }],
        },
      ], 'dar04-fr-'),
      order: newOrder,
    };

    const created = await client.create(portfolioItem);
    console.log(`✅ Created DAR04 portfolio item: ${created.title_en}\n`);
    console.log(`   Order: ${newOrder}`);
    console.log(`   ID: ${created._id}\n`);
    console.log('📝 Next step: Run "npx tsx scripts/upload-dar04-images.ts" to upload images\n');
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

addDAR04Portfolio();
