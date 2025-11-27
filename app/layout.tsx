import type { Metadata } from 'next';
import { SeasonMix, SeasonSans } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ligne-carre.vercel.app'),
  title: {
    default: 'Ligne Carré - Architecture and Project Management',
    template: '%s | Ligne Carré',
  },
  description: 'Ligne Carré: where precision begins with every line.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/images/logo_ligne.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/images/logo_ligne.png', type: 'image/png', sizes: '180x180' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${SeasonMix.variable} ${SeasonSans.variable}`}>
      <body className="font-season-sans antialiased">{children}</body>
    </html>
  );
}

