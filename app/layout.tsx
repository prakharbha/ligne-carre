import type { Metadata } from 'next';
import Script from 'next/script';
import { roboto } from './fonts';
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
    <html lang="en" className={roboto.variable}>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-S9KG3Z02T3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-S9KG3Z02T3');
          `}
        </Script>
      </head>
      <body className="font-roboto font-light antialiased">{children}</body>
    </html>
  );
}

