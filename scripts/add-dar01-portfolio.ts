/**
 * Script to add DAR01 portfolio item to Sanity (without deleting existing content)
 * Run with: npx tsx scripts/add-dar01-portfolio.ts
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

async function addDAR01Portfolio() {
  console.log('🌱 Adding DAR01 portfolio item to Sanity...\n');

  try {
    // Check if DAR01 already exists
    const existingItems = await client.fetch(
      `*[_type == "portfolioItem" && (slug_en.current == "dar01-dubai-arena-coca-cola-arena" || slug_fr.current == "dar01-dubai-arena-coca-cola-arena")]`
    );

    if (existingItems.length > 0) {
      console.log('⚠️  DAR01 portfolio item already exists. Skipping creation.');
      console.log(`   Found: ${existingItems[0].title_en || existingItems[0].title_fr}\n`);
      return;
    }

    // Get the highest order number to place DAR01 after existing items
    const allItems = await client.fetch('*[_type == "portfolioItem"] | order(order asc)');
    const maxOrder = allItems.length > 0 ? Math.max(...allItems.map((item: any) => item.order || 0)) : -1;
    const newOrder = maxOrder + 1;

    const portfolioItem = {
      _type: 'portfolioItem',
      title_en: 'DAR01 - Dubai Arena : Coca Cola Arena Dubai, United Arab Emirates',
      title_fr: 'DAR01 - Dubai Arena: Coca Cola Arena Dubaï, Émirats Arabes Unis',
      slug_en: { current: 'dar01-dubai-arena-coca-cola-arena' },
      slug_fr: { current: 'dar01-dubai-arena-coca-cola-arena' },
      location_en: 'Dubai, United Arab Emirates',
      location_fr: 'Dubaï, Émirats Arabes Unis',
      year: '2016–2018',
      projectType: 'sports',
      category: 'sports',
      role_en: 'Senior Architect & Project Manager',
      role_fr: 'Architecte Senior et Chef de Projet',
      client: 'Meraas',
      area: '60,000 m²',
      estimatedCost: '250 million USD',
      description_en: addKeysToPortableText([
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Project overview' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'The Dubai Arena (Coca-Cola Arena) is one of the largest and most advanced indoor multipurpose arenas in the Middle East, designed to host sports events, concerts, and international exhibitions. As Senior Architect and Project Manager at Dar Al Handasah, I led major components of the full design development process for this flagship venue located in the prestigious City Walk district.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'The project followed a Design & Build delivery model, with Populous providing the initial concept design. Our team at Dar Al Handasah was responsible for the full architectural, structural, technical, and coordination development until the project\'s completion. Today, the arena stands as a key landmark in Dubai\'s event and entertainment infrastructure.' }],
        },
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Responsibilities and Expertise' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Urban Programming & Site Integration' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Conducted an in-depth urban analysis of the City Walk masterplan, focusing on circulation, multimodal access, and integration within the expanding metropolitan context.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Assessed crowd movement strategies, vehicular flow, and event logistics.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Design Development & Technical Validation' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Reviewed and validated the Populous concept, ensuring full alignment with local requirements and client expectations.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Led the schematic design, design development, and final construction documentation phases under Dar Al Handasah\'s mandate.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Interdisciplinary Technical Coordination' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Coordinated all design disciplines: architecture, structure, MEP, HVAC, acoustics, fire safety, envelope engineering, seating layout, and operational systems.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Ensured integration of high-performance systems suitable for large-capacity arena venues.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Codes, Standards & Life-Safety Compliance' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Managed all code reviews related to Dubai Municipality, Dubai Civil Defense, NFPA, and IBC compliance.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Addressed life-safety, evacuation, fire-protection, and crowd-management strategies.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Engineering Systems Integration' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Oversaw incorporation of electrical substations, HVAC systems, telecommunications networks, broadcast systems, and security infrastructure.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Coordinated with specialized consultants for acoustics, rigging, and arena-specific technical equipment.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Cost Control & Value Engineering' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Produced detailed cost estimates at 30%, 60%, 90% and 100% stages.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Led value engineering workshops to optimize materials, systems, and structural solutions without compromising performance or aesthetics.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Building Envelope Design' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Managed the technical design of the arena\'s signature inclined conical glass façade, supported by structural steel framing.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Defined double-glazing specifications, thermal performance requirements, and envelope detailing.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Construction Administration & Site Coordination' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Provided continuous office-based support through RFIs, technical responses, shop drawing reviews, document control, and design clarifications.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Supervised critical site activities including steel erection, façade installation, roofing, and interior fit-out.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Project Management & Stakeholder Coordination' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Directed schedules, workflows, organizational charts, and reporting structures.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Led weekly meetings with contractors, the client, authorities, and specialists to ensure compliance, performance, and program alignment.' }],
        },
      ], 'dar01-en-'),
      description_fr: addKeysToPortableText([
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Présentation du Projet' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'La Dubai Arena (Coca-Cola Arena) est l\'une des plus grandes et des plus modernes arénas couvertes multiponctionnelles du Moyen-Orient, conçue pour accueillir événements sportifs internationaux, concerts, spectacles et salons commerciaux. En tant qu\'architecte senior et chef de projet au sein de Dar Al Handasah, j\'ai dirigé plusieurs volets majeurs du développement complet de la conception, dans le cadre d\'un mandat de Design & Build pour ce projet emblématique situé à City Walk, un des quartiers phares de Dubaï.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Populous a assuré la phase conceptuelle, tandis que notre équipe chez Dar Al Handasah a pris en charge l\'ensemble des études : architecture, structure, systèmes techniques, enveloppe et coordination pluridisciplinaire. L\'aréna constitue aujourd\'hui une référence régionale pour les infrastructures événementielles et les équipements de grande capacité.' }],
        },
        {
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: 'Responsabilités et expertises' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Analyse urbaine et intégration au site' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Étude approfondie du quartier City Walk, incluant la mobilité, l\'accessibilité multimodale et l\'intégration dans le tissu métropolitain.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Analyse des flux piétons, des circulations événementielles et de la logistique d\'accueil des foules.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Développement de la conception et validation technique' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Revue et validation du concept initial élaboré par Populous.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Direction des phases APS, APD, et plans d\'exécution en conformité avec les exigences du client et les réglementations locales.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Coordination pluridisciplinaire' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Coordination de l\'ensemble des disciplines : architecture, structure, mécanique, électricité, CVC, acoustique, sécurité incendie, enveloppe, ainsi que les experts spécialisés propres aux arénas.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Intégration optimisée des systèmes techniques pour une enceinte de grande capacité.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Normes, sécurité incendie et conformité réglementaire' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Vérification complète des normes de Dubai Municipality, Dubai Civil Defense, NFPA et IBC.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Développement des stratégies d\'évacuation, de protection incendie, et de gestion sécuritaire des foules.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Intégration des systèmes techniques et MEP' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Supervision de l\'implantation des postes électriques, systèmes CVC à fréquence variable, réseaux de télécommunications, systèmes de diffusion et de sécurité.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Coordination avec les consultants acoustiques et les spécialistes des équipements scéniques.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Gestion des coûts et Value Engineering' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Préparation des estimations budgétaires aux étapes 30 %, 60 %, 90 % et 100 %.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Conduite de séances de Value Engineering afin d\'optimiser les matériaux, systèmes et solutions structurelles.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Conception technique de l\'enveloppe' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Développement de l\'enveloppe architecturale emblématique : façade vitrée conique inclinée, structure métallique portante et systèmes de double vitrage.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Analyse de la performance thermique, des détails de fixation et de l\'étanchéité.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Administration du contrat et suivi de chantier' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Support continu : analyse des plans d\'atelier, réponses techniques, contrôle documentaire, traitement des modifications et clarifications de conception.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Supervision des phases critiques : montage de la charpente métallique, installation de la façade, couverture, aménagement intérieur.' }],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Gestion de projet et coordination des parties prenantes' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Élaboration des plannings, organigrammes, rapports d\'avancement et outils de suivi.' }],
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Animation des réunions hebdomadaires avec l\'entrepreneur, le client, les autorités et les consultants spécialisés.' }],
        },
      ], 'dar01-fr-'),
      order: newOrder,
    };

    const created = await client.create(portfolioItem);
    console.log(`✅ Created DAR01 portfolio item: ${created.title_en}\n`);
    console.log(`   Order: ${newOrder}`);
    console.log(`   ID: ${created._id}\n`);
    console.log('📝 Next step: Run "npx tsx scripts/upload-dar01-images.ts" to upload images\n');
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

addDAR01Portfolio();

