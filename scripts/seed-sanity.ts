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
        description_fr: "Services d'architecture et de design résidentiel sur mesure adaptés à votre style de vie et à vos besoins. Des maisons unifamiliales aux développements multi-unités, nous créons des espaces qui combinent fonctionnalité, esthétique et durabilité.",
        order: 0,
        slug: { current: 'residential' },
      },
      {
        _type: 'service',
        title_en: 'Commercial',
        title_fr: 'Commercial',
        description_en: 'We support businesses in the design and execution of high-performance commercial buildings. Our approach combines intelligent architectural design, space optimization, and compliance with building codes and safety standards.\n\nFrom offices to retail stores and specialized facilities, we deliver commercial architecture that enhances productivity, customer experience, and brand identity.',
        description_fr: "Services de conception de bâtiments commerciaux et de gestion de projets. Nous nous spécialisons dans la création d'espaces commerciaux efficaces et modernes qui répondent aux objectifs commerciaux tout en respectant les règlements locaux et les codes du bâtiment.",
        order: 1,
        slug: { current: 'commercial' },
      },
      {
        _type: 'service',
        title_en: 'Interior Design',
        title_fr: "Design d'Intérieur",
        description_en: 'Our team provides complete interior design and space planning services, integrating materials, lighting, and ergonomics. We create environments that are harmonious, functional, and tailored to both residential and commercial spaces.\n\nEach project balances aesthetics, comfort, and usability to deliver modern, practical, and visually compelling interiors.',
        description_fr: "Solutions complètes de design d'intérieur qui transforment les espaces en environnements inspirants. Notre approche intègre l'architecture et le design d'intérieur pour créer des intérieurs cohérents, fonctionnels et esthétiquement agréables.",
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
        title_en: 'Sports Complex Dubai',
        title_fr: 'Complexe Sportif Dubaï',
        category: 'sports',
        order: 0,
      },
      {
        _type: 'portfolioItem',
        title_en: 'Medical Center Montreal',
        title_fr: 'Centre Médical Montréal',
        category: 'health',
        order: 1,
      },
      {
        _type: 'portfolioItem',
        title_en: 'University Campus Qatar',
        title_fr: 'Campus Universitaire Qatar',
        category: 'education',
        order: 2,
      },
      {
        _type: 'portfolioItem',
        title_en: 'Luxury Residence KSA',
        title_fr: 'Résidence de Luxe Arabie Saoudite',
        category: 'residential',
        order: 3,
      },
      {
        _type: 'portfolioItem',
        title_en: 'Stadium Project Vision 2030',
        title_fr: 'Projet de Stade Vision 2030',
        category: 'sports',
        order: 4,
      },
      {
        _type: 'portfolioItem',
        title_en: 'Hospital Expansion',
        title_fr: "Extension d'Hôpital",
        category: 'health',
        order: 5,
      },
      {
        _type: 'portfolioItem',
        title_en: 'School Complex',
        title_fr: 'Complexe Scolaire',
        category: 'education',
        order: 6,
      },
      {
        _type: 'portfolioItem',
        title_en: 'Modern Villa',
        title_fr: 'Villa Moderne',
        category: 'residential',
        order: 7,
      },
      {
        _type: 'portfolioItem',
        title_en: 'Athletic Center',
        title_fr: 'Centre Athlétique',
        category: 'sports',
        order: 8,
      },
    ];

    for (const item of portfolioItems) {
      await client.create(item);
    }
    console.log(`✅ Created ${portfolioItems.length} portfolio items\n`);
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

