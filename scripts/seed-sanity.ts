/**
 * Script to seed initial data to Sanity
 * Run with: npx tsx scripts/seed-sanity.ts
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

async function seedData() {
  console.log('🌱 Starting Sanity data seeding...');
  console.log(`📦 Project ID: ${projectId}`);
  console.log(`📦 Dataset: ${dataset}\n`);

  try {
    // Test connection first with a simple query
    console.log('🔍 Testing connection...');
    try {
      await client.fetch('*[0]');
      console.log('✅ Connection successful\n');
    } catch (testError: any) {
      if (testError.message.includes('Dataset not found')) {
        console.error('\n❌ Dataset not found!');
        console.error(`\n💡 Please create the dataset "${dataset}" first:`);
        console.error('1. Go to https://sanity.io/manage');
        console.error(`2. Select project: ${projectId}`);
        console.error(`3. Click "Add dataset" and create "${dataset}"`);
        console.error('4. Run this script again\n');
        process.exit(1);
      }
      throw testError;
    }
    // 1. Create Site Settings
    console.log('📝 Creating Site Settings...');
    const siteSettings = await client.createOrReplace({
      _id: 'siteSettings',
      _type: 'siteSettings',
      footerContact: {
        address_en: 'Montreal, Quebec, Canada',
        address_fr: 'Montréal, Québec, Canada',
        email: 'info@lignecarre.com',
        phone: '+1 (514) 000-0000',
      },
      homepageCopy: {
        aboutDescription_en: 'Licensed Architect (OAQ) with 25+ years of experience in Montreal and the MENA area. Specializing in Sports, Health, Education, and Residential projects.',
        aboutDescription_fr: "Architecte agréé (OAQ) avec plus de 25 ans d'expérience à Montréal et dans la région MENA. Spécialisé dans les projets sportifs, de santé, d'éducation et résidentiels.",
        careersDescription_en: "Join our team of talented architects and project managers. We're always looking for passionate individuals to help shape the future.",
        careersDescription_fr: "Rejoignez notre équipe d'architectes et de gestionnaires de projets talentueux. Nous recherchons toujours des personnes passionnées pour aider à façonner l'avenir.",
      },
    });
    console.log('✅ Site Settings created\n');

    // 2. Create Services
    console.log('📝 Creating Services...');
    const existingServices = await client.fetch('*[_type == "service"]');
    if (existingServices && existingServices.length > 0) {
      console.log(`🗑️  Deleting ${existingServices.length} existing service(s)...`);
      for (const service of existingServices) {
        await client.delete(service._id);
      }
      console.log('✅ Existing services deleted\n');
    }
    
    const services = [
      {
        _type: 'service',
        title_en: 'Residential',
        title_fr: 'Résidentiel',
        description_en: "As an architect in Montreal, we design functional, aesthetic, and durable living spaces tailored to each client's personality and lifestyle. Our services include architectural plans, interior layout design, home renovation, and construction permits.\n\nWhether it's new construction, renovations, or home extensions, every residential project is executed with precision, technical expertise, and compliance with Quebec building codes.",
        description_fr: "En tant qu'architecte à Montréal, nous concevons des maisons et logements sur mesure, alliant esthétique, fonctionnalité et durabilité. Nous réalisons des plans architecturaux complets, incluant design, aménagement intérieur, optimisation de l'espace et préparation des permis de construction.\n\nQu'il s'agisse d'une construction neuve, d'une rénovation ou d'un agrandissement, chaque projet est développé avec rigueur pour refléter votre style de vie et respecter les normes du Québec.",
        order: 0,
        slug: { current: 'residential' },
      },
      {
        _type: 'service',
        title_en: 'Commercial',
        title_fr: 'Commercial',
        description_en: 'We support businesses in the design and execution of high-performance commercial buildings. Our approach combines intelligent architectural design, space optimization, and compliance with building codes and safety standards.\n\nFrom offices to retail stores and specialized facilities, we deliver commercial architecture that enhances productivity, customer experience, and brand identity.',
        description_fr: "Notre firme d'architecture accompagne les entreprises dans la création de bâtiments commerciaux performants et adaptés à leurs activités. Nous concevons des espaces optimisés pour la productivité, la visibilité et l'expérience client, allant des bureaux aux commerces en passant par les installations spécialisées.\n\nNous assurons une conception conforme aux codes du bâtiment et normes de sécurité, tout en renforçant l'identité de votre marque.",
        order: 1,
        slug: { current: 'commercial' },
      },
      {
        _type: 'service',
        title_en: 'Interior Design',
        title_fr: "Design d'Intérieur",
        description_en: 'Our team provides complete interior design and space planning services, integrating materials, lighting, and ergonomics. We create environments that are harmonious, functional, and tailored to both residential and commercial spaces.\n\nEach project balances aesthetics, comfort, and usability to deliver modern, practical, and visually compelling interiors.',
        description_fr: "Nous offrons des services complets de design d'intérieur et d'aménagement intérieur, intégrant matériaux, éclairage, ergonomie et circulation. Notre équipe crée des environnements élégants, confortables et cohérents, adaptés autant aux espaces résidentiels qu'aux projets commerciaux.\n\nNous travaillons à transformer chaque pièce en un espace fonctionnel, moderne et harmonieux.",
        order: 2,
        slug: { current: 'interior-design' },
      },
      {
        _type: 'service',
        title_en: 'Project Management',
        title_fr: 'Gestion de Projets',
        description_en: 'We provide comprehensive professional project management services to ensure every project succeeds from concept to delivery. Our approach includes project coordination, construction management, project director oversight, budget control, cost management, scheduling, supervision, and quality assurance.\n\nWhether your project is residential, commercial, or institutional, we guarantee a structured, transparent, and effective management process, giving clients full confidence throughout the project lifecycle.',
        description_fr: "Services experts de gestion de projets pour des projets architecturaux complexes. Nous assurons la livraison dans les délais, le contrôle des budgets et l'assurance qualité depuis le concept initial jusqu'à la construction finale, en coordonnant tous les intervenants et en gérant chaque phase de développement.",
        order: 3,
        slug: { current: 'project-management' },
      },
    ];

    for (const service of services) {
      await client.create(service);
    }
    console.log(`✅ Created ${services.length} services\n`);

    // 3. Create Portfolio Items
    console.log('📝 Creating Portfolio Items...');
    const existingPortfolioItems = await client.fetch('*[_type == "portfolioItem"]');
    if (existingPortfolioItems && existingPortfolioItems.length > 0) {
      console.log(`🗑️  Deleting ${existingPortfolioItems.length} existing portfolio item(s)...`);
      for (const item of existingPortfolioItems) {
        await client.delete(item._id);
      }
      console.log('✅ Existing portfolio items deleted\n');
    }
    
    const portfolioItems = [
      {
        _type: 'portfolioItem',
        title_en: 'FMC01 - Residential and Commercial Project in SOLIDERE – Lot 671 Downtown Beirut – Lebanon (SOLIDERE)',
        title_fr: 'FMC01 - Projet résidentiel et commercial à SOLIDERE– Lot 671 Centre-ville de Beyrouth – Liban (SOLIDERE)',
        slug_en: { current: 'fmc01-residential-commercial-solidere-lot-671' },
        slug_fr: { current: 'fmc01-residentiel-commercial-solidere-lot-671' },
        location_en: 'Downtown Beirut – Lebanon (SOLIDERE)',
        location_fr: 'Centre-ville de Beyrouth – Liban (SOLIDERE)',
        year: '1998–2001',
        projectType: 'mixed-use',
        category: 'residential',
        role_en: 'Senior Architect at F.M. Consultants',
        role_fr: 'Architecte Senior chez F.M. Consultants',
        client: 'SOLIDERE',
        area: '3,000 m²',
        estimatedCost: '6,000,000 USD',
        description_en: addKeysToPortableText([
          {
            _type: 'block',
            style: 'h2',
            children: [{ _type: 'span', text: 'Project Overview' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'This mixed-use residential and commercial building was developed within the strategic redevelopment framework of SOLIDERE, the company overseeing the reconstruction of downtown Beirut. As Senior Architect at F.M. Consultants, I led the complete architectural development of Lot 671, ensuring full compliance with SOLIDERE\'s master planning guidelines, urban constraints, and regulatory requirements.' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'The project encompasses 3,000 m² of built-up area and integrates high-performance materials, optimized massing, and contextual architectural language suitable for a dense, historic urban environment.' }],
          },
          {
            _type: 'block',
            style: 'h2',
            children: [{ _type: 'span', text: 'Key Responsibilities' }],
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: 'Architectural Programming & Planning Compliance' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Interpretation and application of SOLIDERE\'s urban guidelines, zoning restrictions, height controls, and authorized building envelope.' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Detailed analysis of land-use ratios and functions to define optimal residential and commercial allocations.' }],
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: 'Urban & Site Analysis' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Study of urban grids, pedestrian circulation patterns, and visual corridors.' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Integration of the project into the architectural character of Beirut\'s traditional city blocks.' }],
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: 'Concept to Detailed Design' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Development of volumetric massing and façade concepts.' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Optimization of commercial frontage, residential access points, and service distribution.' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Production of detailed architectural plans, sections, elevations, and technical details for execution.' }],
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: 'Detailed Design & Construction Documents' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Production of complete architectural drawings: plans, sections, elevations, technical sheets, and execution details.' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Material selection including natural stone, wood finishes, laminated glazing, and insulated façade assemblies.' }],
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: 'Regulatory & Technical Coordination' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Compliance with Lebanese building codes related to structural integrity, fire safety, accessibility, HVAC distribution, and environmental performance.' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Coordination with structural, MEP, acoustic, and civil engineers to align architectural decisions with technical requirements.' }],
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: 'Envelope & Performance Integration' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Thermal insulation strategies suitable for Beirut\'s climate.' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Sunlight management, shading studies, and façade depth optimization.' }],
          },
        ], 'fmc01-en-'),
        description_fr: addKeysToPortableText([
          {
            _type: 'block',
            style: 'h2',
            children: [{ _type: 'span', text: 'Aperçu du projet' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Ce bâtiment résidentiel et commercial à usages mixtes s\'inscrit dans le cadre stratégique de la reconstruction du centre-ville de Beyrouth menée par SOLIDERE. En tant qu\'architecte senior chez F.M. Consultants, j\'ai dirigé l\'ensemble du développement architectural du Lot 671, en assurant une conformité totale aux directives du plan directeur, aux contraintes urbaines et aux exigences réglementaires propres au secteur SOLIDERE.' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Le projet couvre une superficie construite de 3 000 m² et intègre des matériaux performants, une volumétrie optimisée et un langage architectural contextualisé adapté à un tissu urbain dense et patrimonial.' }],
          },
          {
            _type: 'block',
            style: 'h2',
            children: [{ _type: 'span', text: 'Responsabilités clés' }],
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: 'Programmation architecturale et conformité au plan d\'urbanisme' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Interprétation et application des directives urbaines de SOLIDERE, incluant zonage, gabarits, hauteurs permises et enveloppe bâtie autorisée.' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Analyse détaillée des ratios d\'occupation et des fonctions afin d\'optimiser la répartition résidentielle et commerciale.' }],
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: 'Analyse urbaine et étude de site' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Étude des trames urbaines, des parcours piétonniers et des corridors visuels.' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Intégration du projet au caractère architectural des îlots traditionnels du centre-ville de Beyrouth.' }],
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: 'Du concept aux détails techniques' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Développement de la volumétrie, des façades et des principes d\'implantation.' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Optimisation des vitrines commerciales, des accès résidentiels et des zones de services.' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Élaboration de plans architecturaux détaillés : plans, coupes, élévations et détails techniques pour l\'exécution.' }],
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: 'Documents d\'exécution et choix des matériaux' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Production complète des dessins d\'exécution et des dossiers techniques.' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Sélection de matériaux adaptés : pierre naturelle, bois, vitrages feuilletés et enveloppe isolée.' }],
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: 'Coordination technique et réglementaire' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Conformité aux normes libanaises concernant la structure, la sécurité incendie, l\'accessibilité, la ventilation et la performance environnementale.' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Coordination étroite avec les équipes structure, CVAC, MEP, acoustique et génie civil pour assurer la cohérence entre décisions architecturales et exigences techniques.' }],
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: 'Enveloppe et performance du bâtiment' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Stratégies d\'isolation thermique adaptées au climat de Beyrouth.' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Études d\'ensoleillement, gestion de l\'ombre et optimisation de la profondeur des façades.' }],
          },
        ], 'fmc01-fr-'),
        order: 0,
      },
      {
        _type: 'portfolioItem',
        title_en: 'FMC03 - Heritage Private Residence – Lot 669 Beirut – Lebanon',
        title_fr: 'FMC03 - Résidence privée patrimoniale – Lot 669 Beyrouth – Liban',
        slug_en: { current: 'fmc03-heritage-private-residence-lot-669' },
        slug_fr: { current: 'fmc03-residence-privee-patrimoniale-lot-669' },
        location_en: 'Beirut – Lebanon',
        location_fr: 'Beyrouth – Liban',
        year: '2000–2002',
        projectType: 'residential',
        category: 'residential',
        role_en: 'Senior Architect - F.M. Consultants',
        role_fr: 'Architecte senior - F.M. Consultants',
        client: 'Private',
        area: '1,265 m²',
        estimatedCost: '8,000,000 USD',
        description_en: addKeysToPortableText([
          {
            _type: 'block',
            style: 'h2',
            children: [{ _type: 'span', text: 'Project Overview' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Between 2000–2002, F.M. Consultants led the restoration and modernization of a private heritage residence in Beirut, a landmark project blending Lebanese traditional architecture with discreet contemporary upgrades. The residence, spanning 1,265 m² with an estimated cost of 8 million USD, stands as a benchmark in heritage architecture, historic building restoration, and luxury residential renovation.' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'The mission was to preserve authentic Lebanese identity—stone masonry, vaults, arcades—while integrating modern standards of comfort, safety, and energy performance. The result: a refined balance of architectural authenticity and modern living.' }],
          },
          {
            _type: 'block',
            style: 'h2',
            children: [{ _type: 'span', text: 'Responsibilities & Expertise' }],
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: 'Architectural Survey & Diagnostics' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Complete architectural survey and structural condition assessment' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Documentation of heritage elements for preservation, restoration, or reconstruction' }],
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: 'Concept Design & Rehabilitation Strategy' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Development of a heritage-sensitive rehabilitation concept' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Detailed architectural drawings: plans, elevations, sections, joinery, and stonework interfaces' }],
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: 'Building Envelope & Materials' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Restoration of original stone masonry with selective replacement' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Integration of high-performance glazing without altering character' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Use of local natural materials: solid wood, wrought iron, Lebanese marble' }],
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: 'Technical Coordination (MEP & Structural Upgrades)' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Seamless integration of mechanical, electrical, and plumbing systems within historic fabric' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Structural reinforcement meeting seismic safety standards' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Discreet indirect lighting and modern HVAC systems' }],
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: 'Project Management & Site Supervision' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Coordination with engineers, conservation specialists, and artisans' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Management of heritage craftsmen: stone carvers, ironworkers, wood restoration experts' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Quality control, schedule monitoring, and compliance with heritage preservation regulations' }],
          },
        ], 'fmc03-en-'),
        description_fr: addKeysToPortableText([
          {
            _type: 'block',
            style: 'h2',
            children: [{ _type: 'span', text: 'Présentation du projet' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Entre 2000 et 2002, F.M. Consultants a dirigé la restauration et la modernisation d\'une résidence patrimoniale privée à Beyrouth, un projet de référence alliant architecture traditionnelle libanaise et intégration discrète de solutions contemporaines.' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Avec une superficie de 1 265 m² et un budget estimé à 8 millions USD, cette réalisation constitue un jalon majeur en matière de rénovation de villas de luxe, conservation du patrimoine architectural et réhabilitation de bâtiments historiques.' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'L\'objectif était de préserver l\'identité libanaise authentique, maçonnerie en pierre, voûtes, arcades, tout en répondant aux standards modernes de confort, de sécurité et de performance énergétique. Le résultat offre un équilibre raffiné entre authenticité architecturale et vie contemporaine.' }],
          },
          {
            _type: 'block',
            style: 'h2',
            children: [{ _type: 'span', text: 'Responsabilités & Expertise' }],
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: 'Relevé architectural & diagnostic' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Relevé complet et évaluation de l\'état structurel' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Documentation des éléments patrimoniaux à conserver, restaurer ou reconstruire' }],
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: 'Conception & stratégie de réhabilitation' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Élaboration d\'un concept de réhabilitation respectueux du patrimoine' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Production de dessins détaillés : plans, élévations, coupes, menuiseries, interfaces de pierre' }],
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: 'Enveloppe & matériaux' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Restauration de la maçonnerie en pierre d\'origine avec remplacement sélectif' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Intégration de vitrages haute performance sans altérer le caractère architectural' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Sélection de matériaux locaux : bois massif, fer forgé, marbre libanais' }],
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: 'Coordination technique (MEP & renforcement structurel)' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Intégration discrète des systèmes CVC, électriques et hydrauliques dans la structure historique' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Renforcement structurel conforme aux normes antisismiques' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Mise en place d\'un éclairage indirect et de systèmes de climatisation modernes' }],
          },
          {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: 'Gestion de projet & suivi de chantier' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Coordination avec ingénieurs, spécialistes en conservation et artisans' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Supervision des maîtres artisans : tailleurs de pierre, ferronniers, restaurateurs de bois' }],
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: 'Contrôle qualité, suivi des délais et conformité aux réglementations de préservation du patrimoine.' }],
          },
        ], 'fmc03-fr-'),
        order: 1,
      },
    ];

    for (const item of portfolioItems) {
      await client.create(item);
    }
    console.log(`✅ Created ${portfolioItems.length} portfolio item(s)\n`);
    console.log('⚠️  Note: Portfolio items need images to be uploaded manually in Sanity Studio\n');

    // 4. Create News Articles
    console.log('📝 Creating News Articles...');
    const existingNewsArticles = await client.fetch('*[_type == "newsArticle"]');
    if (existingNewsArticles && existingNewsArticles.length > 0) {
      console.log(`🗑️  Deleting ${existingNewsArticles.length} existing news article(s)...`);
      for (const article of existingNewsArticles) {
        await client.delete(article._id);
      }
      console.log('✅ Existing news articles deleted\n');
    }
    
    const newsArticles = [
      {
        _type: 'newsArticle',
        title_en: 'New Sports Complex Project Announced',
        title_fr: 'Nouveau Projet de Complexe Sportif Annoncé',
        slug_en: { current: 'new-sports-complex-project-announced' },
        slug_fr: { current: 'nouveau-projet-complexe-sportif-annonce' },
        date: '2024-11-15',
        excerpt_en: 'We are excited to announce our latest sports complex project in the region.',
        excerpt_fr: "Nous sommes ravis d'annoncer notre dernier projet de complexe sportif dans la région.",
        content_en: addKeysToPortableText([
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'We are excited to announce our latest sports complex project in the region. This state-of-the-art facility will serve the community for years to come.',
              },
            ],
            style: 'normal',
          },
        ], 'news1-en-'),
        content_fr: addKeysToPortableText([
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: "Nous sommes ravis d'annoncer notre dernier projet de complexe sportif dans la région. Cette installation de pointe servira la communauté pendant de nombreuses années.",
              },
            ],
            style: 'normal',
          },
        ], 'news1-fr-'),
      },
      {
        _type: 'newsArticle',
        title_en: 'Award-Winning Architecture Recognition',
        title_fr: 'Reconnaissance Architecturale Primée',
        slug_en: { current: 'award-winning-architecture-recognition' },
        slug_fr: { current: 'reconnaissance-architecturale-primee' },
        date: '2024-10-20',
        excerpt_en: 'Our team has been recognized for excellence in architectural design.',
        excerpt_fr: 'Notre équipe a été reconnue pour son excellence en design architectural.',
        content_en: addKeysToPortableText([
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'Our team has been recognized for excellence in architectural design. This award reflects our commitment to creating innovative and sustainable spaces.',
              },
            ],
            style: 'normal',
          },
        ], 'news2-en-'),
        content_fr: addKeysToPortableText([
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: "Notre équipe a été reconnue pour son excellence en design architectural. Ce prix reflète notre engagement à créer des espaces innovants et durables.",
              },
            ],
            style: 'normal',
          },
        ], 'news2-fr-'),
      },
      {
        _type: 'newsArticle',
        title_en: 'Sustainable Building Practices Update',
        title_fr: 'Mise à Jour sur les Pratiques de Construction Durables',
        slug_en: { current: 'sustainable-building-practices-update' },
        slug_fr: { current: 'mise-a-jour-pratiques-construction-durables' },
        date: '2024-09-10',
        excerpt_en: 'We continue to lead in sustainable and eco-friendly building practices.',
        excerpt_fr: 'Nous continuons de mener dans les pratiques de construction durables et écologiques.',
        content_en: addKeysToPortableText([
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'We continue to lead in sustainable and eco-friendly building practices. Our commitment to environmental responsibility is at the core of every project.',
              },
            ],
            style: 'normal',
          },
        ], 'news3-en-'),
        content_fr: addKeysToPortableText([
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'Nous continuons de mener dans les pratiques de construction durables et écologiques. Notre engagement envers la responsabilité environnementale est au cœur de chaque projet.',
              },
            ],
            style: 'normal',
          },
        ], 'news3-fr-'),
      },
    ];

    for (const article of newsArticles) {
      await client.create(article);
    }
    console.log(`✅ Created ${newsArticles.length} news articles\n`);

    // 5. Create Page Content
    console.log('📝 Creating Page Content...');
    
    // About Page - Delete all existing about documents
    const existingAboutDocs = await client.fetch('*[_type == "pageContent" && pageType == "about"]');
    if (existingAboutDocs && existingAboutDocs.length > 0) {
      console.log(`🗑️  Deleting ${existingAboutDocs.length} existing About document(s)...`);
      for (const doc of existingAboutDocs) {
        await client.delete(doc._id);
      }
      console.log('✅ Existing About documents deleted\n');
    }
    
    const aboutContent = {
      _type: 'pageContent',
      pageType: 'about',
      title_en: 'ABOUT',
      title_fr: 'À PROPOS',
      subtitle_en: 'Our Story, Philosophy & Team',
      subtitle_fr: 'Notre Histoire, Philosophie & Équipe',
      content_en: addKeysToPortableText([
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Our History',
            },
          ],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Ligne Carré Inc. is an architecture and project management firm offering innovative, customized, and high-quality architectural services for residential, commercial, and institutional projects. With extensive international experience in architectural design and multidisciplinary project coordination, our firm delivers solutions that combine creativity, technical precision, and full compliance with building codes and standards.',
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: "Based in Montreal, Ligne Carré Inc. supports clients through every stage of the process, from concept design and architectural drawings to project delivery, with a strong focus on cost optimization, schedule control, and tailored responses to each project's unique needs.",
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Committed to sustainable development and urban quality, we strive to create architectural projects that enhance the living environment and contribute to long-term community value.',
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Our Philosophy',
            },
          ],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'At Ligne Carré Inc., we position ourselves as your trusted partner for architecture, interior design, and project management in Montreal. Whether your needs involve residential architecture, commercial spaces, sports or institutional facilities, we offer complete, personalized services designed to transform ideas into successful, buildable solutions.',
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Our approach is based on three pillars:',
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Creativity – thoughtful design that improves functionality, aesthetics, and user experience.',
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Technical Expertise – precise drawings, efficient coordination, and rigorous quality control.',
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Professionalism, commitment to deadlines, budget management, and transparent communication.',
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'We invite you to explore our portfolio and discover how Ligne Carré Inc. brings projects to life through innovation, precision, and a human-centered approach.',
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Team',
            },
          ],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [
            {
              _type: 'span',
              text: 'Fadi Abou-Sader.',
            },
          ],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Architect OAQ – Project Manager | MGPA',
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Fadi Abou-Sader is a licensed architect and a member of both the Ordre des Architectes du Québec (OAQ) and the Order of Architects of Beirut, with more than 28 years of experience in Quebec, Lebanon, and the MENA region.',
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: "A graduate of the Lebanese Academy of Fine Arts and holder of a master's degree in Project Planning and Management from the University of Montreal, Fadi has directed numerous residential, institutional, sports, and commercial projects, combining architectural innovation, technical expertise, and rigorous project management.",
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'As the founder of Ligne Carré Inc., he guides clients from the initial idea to final delivery with a human, accessible, and precise approach, where every line matters.',
            },
          ],
          style: 'normal',
        },
      ], 'about-en-'),
      content_fr: addKeysToPortableText([
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Notre Histoire',
            },
          ],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: "Ligne Carré Inc. est une firme spécialisée en architecture et en gestion de projet, offrant des solutions innovantes, fonctionnelles et personnalisées pour les projets résidentiels, institutionnels, sportifs et commerciaux. Forte d'une expertise internationale, notre entreprise met de l'avant une approche qui allie créativité, précision technique, et respect rigoureux des normes en vigueur.",
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: "Basée à Montréal, Ligne Carré Inc. accompagne ses clients à chaque étape : de la conception architecturale à la réalisation, tout en assurant l'optimisation des coûts, le respect des échéanciers et l'adaptation aux besoins spécifiques de chaque projet. Nous avons à cœur de contribuer à un développement urbain durable et à l'amélioration de la qualité du cadre bâti.",
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Notre Philosophie',
            },
          ],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: "Ligne Carré Inc. se positionne comme votre partenaire de confiance en architecture et en gestion de projet au Québec. Nous offrons des services complets, flexibles et sur mesure pour transformer vos idées en projets concrets — qu'il s'agisse de bâtiments résidentiels, commerciaux ou institutionnels.",
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: "Notre démarche repose sur une combinaison d'innovation, d'expertise technique, et d'une approche humaine et accessible. Nous mettons tout en œuvre pour garantir le succès de chaque étape : conception, coordination, suivi de chantier et livraison. À Ligne Carré Inc., nous nous engageons à respecter les délais, maîtriser les budgets, et dépasser vos attentes. Découvrez notre portfolio et voyez comment nous donnons vie à des projets qui se distinguent par leur qualité, leur précision et leur impact.",
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Équipe',
            },
          ],
        },
        {
          _type: 'block',
          style: 'h3',
          children: [
            {
              _type: 'span',
              text: 'Fadi Abou-Sader.',
            },
          ],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Architecte OAQ – Gestionnaire de Projets | MGPA',
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: "Fadi Abou-Sader est architecte, membre de l'Ordre des Architectes du Québec (OAQ) et de l'Ordre des Architectes de Beyrouth, cumulant plus de 28 ans d'expérience au Liban, au Québec et dans la région MENA.",
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: "Diplômé de l'Académie Libanaise des Beaux-Arts et titulaire d'une maîtrise en montage et gestion de projet de l'Université de Montréal, il a dirigé des projets résidentiels, institutionnels et sportifs, alliant architecture innovante et gestion rigoureuse. Fondateur de Ligne Carré Inc., il accompagne ses clients du premier croquis à la livraison finale, avec une approche humaine, accessible, et orientée vers la précision — parce que chaque ligne compte.",
            },
          ],
          style: 'normal',
        },
      ], 'about-fr-'),
    };
    await client.create(aboutContent);
    console.log('✅ Created About page content');
    
    // Careers Page - Delete all existing careers documents
    const existingCareersDocs = await client.fetch('*[_type == "pageContent" && pageType == "careers"]');
    if (existingCareersDocs && existingCareersDocs.length > 0) {
      console.log(`🗑️  Deleting ${existingCareersDocs.length} existing Careers document(s)...`);
      for (const doc of existingCareersDocs) {
        await client.delete(doc._id);
      }
      console.log('✅ Existing Careers documents deleted\n');
    }
    
    const careersContent = {
      _type: 'pageContent',
      pageType: 'careers',
      title_en: 'Careers',
      title_fr: 'Carrières',
      subtitle_en: 'Join Our Team',
      subtitle_fr: 'Rejoignez Notre Équipe',
      content_en: addKeysToPortableText([
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Why Join Us',
            },
          ],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Join our team of talented architects and project managers. We are always looking for passionate individuals to help shape the future of architecture and design.',
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Open Positions',
            },
          ],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'We are currently looking for experienced architects, project managers, and design professionals to join our growing team. If you are passionate about architecture and want to work on exciting projects, we would love to hear from you.',
            },
          ],
          style: 'normal',
        },
      ], 'careers-en-'),
      content_fr: addKeysToPortableText([
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Pourquoi Nous Rejoindre',
            },
          ],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: "Rejoignez notre équipe d'architectes et de gestionnaires de projets talentueux. Nous recherchons toujours des personnes passionnées pour aider à façonner l'avenir de l'architecture et du design.",
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Postes Ouverts',
            },
          ],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: "Nous recherchons actuellement des architectes expérimentés, des gestionnaires de projets et des professionnels du design pour rejoindre notre équipe en croissance. Si vous êtes passionné par l'architecture et souhaitez travailler sur des projets passionnants, nous serions ravis d'avoir de vos nouvelles.",
            },
          ],
          style: 'normal',
        },
      ], 'careers-fr-'),
    };
    await client.create(careersContent);
    console.log('✅ Created Careers page content');

    // Contact Page - Delete all existing contact documents
    const existingContactDocs = await client.fetch('*[_type == "pageContent" && pageType == "contact"]');
    if (existingContactDocs && existingContactDocs.length > 0) {
      console.log(`🗑️  Deleting ${existingContactDocs.length} existing Contact document(s)...`);
      for (const doc of existingContactDocs) {
        await client.delete(doc._id);
      }
      console.log('✅ Existing Contact documents deleted\n');
    }
    
    const contactContent = {
      _type: 'pageContent',
      pageType: 'contact',
      title_en: 'Contact Us',
      title_fr: 'Contactez-nous',
      subtitle_en: "Let's Discuss Your Project",
      subtitle_fr: "Discutons de Votre Projet",
      content_en: addKeysToPortableText([
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Get in Touch',
            },
          ],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'We would love to hear from you. Whether you have a project in mind or questions about our services, please do not hesitate to reach out.',
            },
          ],
          style: 'normal',
        },
      ], 'contact-en-'),
      content_fr: addKeysToPortableText([
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Entrer en Contact',
            },
          ],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: "Nous serions ravis d'avoir de vos nouvelles. Que vous ayez un projet en tête ou des questions sur nos services, n'hésitez pas à nous contacter.",
            },
          ],
          style: 'normal',
        },
      ], 'contact-fr-'),
    };
    await client.create(contactContent);
    console.log('✅ Created Contact page content');

    // Privacy Page - Delete all existing privacy documents first
    const existingPrivacyDocs = await client.fetch('*[_type == "pageContent" && pageType == "privacy"]');
    if (existingPrivacyDocs && existingPrivacyDocs.length > 0) {
      console.log(`🗑️  Deleting ${existingPrivacyDocs.length} existing Privacy Policy document(s)...`);
      for (const doc of existingPrivacyDocs) {
        await client.delete(doc._id);
      }
      console.log('✅ Existing Privacy Policy documents deleted\n');
    }
    
    const privacyContent = {
      _type: 'pageContent',
      pageType: 'privacy',
      title_en: 'Privacy Policy',
      title_fr: 'Politique de Confidentialité',
      subtitle_en: 'Last Updated: November 2024',
      subtitle_fr: 'Dernière Mise à Jour : Novembre 2024',
      content_en: addKeysToPortableText([
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Introduction',
            },
          ],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'This Privacy Policy describes how Ligne Carré Inc. ("we", "our", or "us") collects, uses, and protects your personal information when you use our website. By using our website, you agree to the collection and use of information in accordance with this policy.',
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Information We Collect',
            },
          ],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'We may collect personal information that you voluntarily provide to us when you contact us through our website, including your name, email address, phone number, and any other information you choose to provide.',
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'How We Use Your Information',
            },
          ],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'We use the information we collect to respond to your inquiries, provide our services, improve our website, and communicate with you about our services and projects.',
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Data Security',
            },
          ],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the Internet is 100% secure.',
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Contact Us',
            },
          ],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'If you have any questions about this Privacy Policy, please contact us at info@lignecarre.com.',
            },
          ],
          style: 'normal',
        },
      ], 'privacy-en-'),
      content_fr: addKeysToPortableText([
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Introduction',
            },
          ],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: "Cette Politique de Confidentialité décrit comment Ligne Carré Inc. (« nous », « notre » ou « nos ») collecte, utilise et protège vos informations personnelles lorsque vous utilisez notre site web. En utilisant notre site web, vous acceptez la collecte et l'utilisation d'informations conformément à cette politique.",
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Informations que Nous Collectons',
            },
          ],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: "Nous pouvons collecter des informations personnelles que vous nous fournissez volontairement lorsque vous nous contactez via notre site web, y compris votre nom, votre adresse e-mail, votre numéro de téléphone et toute autre information que vous choisissez de fournir.",
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: "Comment Nous Utilisons Vos Informations",
            },
          ],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: "Nous utilisons les informations que nous collectons pour répondre à vos demandes, fournir nos services, améliorer notre site web et communiquer avec vous concernant nos services et projets.",
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Sécurité des Données',
            },
          ],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: "Nous prenons des mesures raisonnables pour protéger vos informations personnelles contre l'accès non autorisé, l'utilisation ou la divulgation. Cependant, aucune méthode de transmission sur Internet n'est sécurisée à 100%.",
            },
          ],
          style: 'normal',
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Contactez-Nous',
            },
          ],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: "Si vous avez des questions concernant cette Politique de Confidentialité, veuillez nous contacter à info@lignecarre.com.",
            },
          ],
          style: 'normal',
        },
      ], 'privacy-fr-'),
    };
    await client.create(privacyContent);
    console.log('✅ Created Privacy page content\n');

    console.log('🎉 Data seeding completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Go to /studio to access Sanity Studio');
    console.log('2. Upload banner images in the Banner Image documents');
    console.log('3. Upload portfolio item images in Portfolio Item documents');
    console.log('4. Add featured images to news articles if needed');
    console.log('5. Customize the content as needed\n');

  } catch (error: any) {
    console.error('❌ Error seeding data:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.body, null, 2));
    }
    
    if (error.message.includes('Dataset not found') || error.statusCode === 404) {
      console.error('\n💡 The dataset does not exist. Please:');
      console.error('1. Go to https://sanity.io/manage');
      console.error(`2. Select project: ${projectId}`);
      console.error(`3. Click "Add dataset" and create "${dataset}"`);
      console.error('4. Run this script again\n');
    } else if (error.message.includes('Unauthorized') || error.statusCode === 401) {
      console.error('\n💡 Authentication error. Please check:');
      console.error('1. The SANITY_API_WRITE_TOKEN is correct');
      console.error(`2. The token has write permissions for project: ${projectId}`);
      console.error('3. The dataset exists in your Sanity project');
      console.error('4. Go to https://sanity.io/manage to verify your project settings\n');
    }
    process.exit(1);
  }
}

seedData();

