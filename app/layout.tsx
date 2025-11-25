import type { Metadata } from 'next';
import { SeasonMix, SeasonSans } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ligne Carré - Architecture and Project Management',
  description: 'Ligne Carré: where precision begins with every line.',
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

