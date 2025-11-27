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
    const services = [
      {
        _type: 'service',
        title_en: 'Residential',
        title_fr: 'Résidentiel',
        description_en: 'Custom residential architecture and design services tailored to your lifestyle and needs. From single-family homes to multi-unit developments, we create spaces that combine functionality, aesthetics, and sustainability.',
        description_fr: "Services d'architecture et de design résidentiel sur mesure adaptés à votre style de vie et à vos besoins. Des maisons unifamiliales aux développements multi-unités, nous créons des espaces qui combinent fonctionnalité, esthétique et durabilité.",
        order: 0,
        slug: { current: 'residential' },
      },
      {
        _type: 'service',
        title_en: 'Commercial',
        title_fr: 'Commercial',
        description_en: 'Commercial building design and project management services. We specialize in creating efficient, modern commercial spaces that meet business objectives while adhering to local regulations and building codes.',
        description_fr: "Services de conception de bâtiments commerciaux et de gestion de projets. Nous nous spécialisons dans la création d'espaces commerciaux efficaces et modernes qui répondent aux objectifs commerciaux tout en respectant les règlements locaux et les codes du bâtiment.",
        order: 1,
        slug: { current: 'commercial' },
      },
      {
        _type: 'service',
        title_en: 'Interior Design',
        title_fr: "Design d'Intérieur",
        description_en: 'Comprehensive interior design solutions that transform spaces into inspiring environments. Our approach integrates architecture and interior design to create cohesive, functional, and aesthetically pleasing interiors.',
        description_fr: "Solutions complètes de design d'intérieur qui transforment les espaces en environnements inspirants. Notre approche intègre l'architecture et le design d'intérieur pour créer des intérieurs cohérents, fonctionnels et esthétiquement agréables.",
        order: 2,
        slug: { current: 'interior-design' },
      },
      {
        _type: 'service',
        title_en: 'Project Management',
        title_fr: 'Gestion de Projets',
        description_en: 'Expert project management services for complex architectural projects. We ensure timely delivery, budget control, and quality assurance from initial concept through final construction, coordinating all stakeholders and managing every phase of development.',
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
        content_en: [
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
        ],
        content_fr: [
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
        ],
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
        content_en: [
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
        ],
        content_fr: [
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
        ],
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
        content_en: [
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
        ],
        content_fr: [
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
        ],
      },
    ];

    for (const article of newsArticles) {
      await client.create(article);
    }
    console.log(`✅ Created ${newsArticles.length} news articles\n`);

    // 5. Create Page Content
    console.log('📝 Creating Page Content...');
    
    // Careers Page
    const careersContent = {
      _type: 'pageContent',
      pageType: 'careers',
      title_en: 'Careers',
      title_fr: 'Carrières',
      subtitle_en: 'Join Our Team',
      subtitle_fr: 'Rejoignez Notre Équipe',
      content_en: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Join our team of talented architects and project managers. We are always looking for passionate individuals to help shape the future.',
            },
          ],
          style: 'normal',
        },
      ],
      content_fr: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: "Rejoignez notre équipe d'architectes et de gestionnaires de projets talentueux. Nous recherchons toujours des personnes passionnées pour aider à façonner l'avenir.",
            },
          ],
          style: 'normal',
        },
      ],
    };
    await client.create(careersContent);
    console.log('✅ Created Careers page content');

    // Contact Page
    const contactContent = {
      _type: 'pageContent',
      pageType: 'contact',
      title_en: 'Contact Us',
      title_fr: 'Contactez-nous',
      subtitle_en: "Let's Discuss Your Project",
      subtitle_fr: "Discutons de Votre Projet",
      content_en: [
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
      ],
      content_fr: [
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
      ],
    };
    await client.create(contactContent);
    console.log('✅ Created Contact page content');

    // Privacy Page
    const privacyContent = {
      _type: 'pageContent',
      pageType: 'privacy',
      title_en: 'Privacy Policy',
      title_fr: 'Politique de Confidentialité',
      subtitle_en: 'Last Updated: November 2024',
      subtitle_fr: 'Dernière Mise à Jour : Novembre 2024',
      content_en: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'This Privacy Policy describes how we collect, use, and protect your personal information when you use our website.',
            },
          ],
          style: 'normal',
        },
      ],
      content_fr: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: "Cette Politique de Confidentialité décrit comment nous collectons, utilisons et protégeons vos informations personnelles lorsque vous utilisez notre site web.",
            },
          ],
          style: 'normal',
        },
      ],
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

