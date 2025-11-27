import { getMessages } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  
  // Get SEO data from messages
  const homeSeo = (messages as any).home?.seo;
  const title = homeSeo?.title || 'Ligne Carré - Architecture and Project Management';
  const description = homeSeo?.description || 'Ligne Carré: where precision begins with every line.';
  
  // Get the base URL (you may want to set this as an environment variable)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ligne-carre.vercel.app';
  const currentUrl = `${baseUrl}/${locale}`;
  
  const ogLocale = locale === 'fr' ? 'fr_CA' : 'en_CA';
  
  return {
    title,
    description,
    keywords: locale === 'fr' 
      ? 'architecte Montréal, architecture Montréal, gestion de projet, design intérieur, projets résidentiels, projets commerciaux, projets institutionnels, projets sportifs'
      : 'architect Montreal, architecture Montreal, project management, interior design, residential projects, commercial projects, institutional projects, sports projects',
    authors: [{ name: 'Ligne Carré Inc.' }],
    creator: 'Ligne Carré Inc.',
    publisher: 'Ligne Carré Inc.',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: currentUrl,
      languages: {
        'en': `${baseUrl}/en`,
        'fr': `${baseUrl}/fr`,
        'x-default': `${baseUrl}/en`,
      },
    },
    openGraph: {
      title,
      description,
      url: currentUrl,
      siteName: 'Ligne Carré Inc.',
      locale: ogLocale,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/images/logo_ligne.png`,
          width: 1200,
          height: 630,
          alt: 'Ligne Carré Inc. - Architecture and Project Management',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/images/logo_ligne.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

