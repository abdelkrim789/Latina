import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Noto_Naskh_Arabic, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500']
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700']
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600']
});

const naskh = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  variable: '--font-naskh',
  weight: ['400', '500']
});

export const metadata: Metadata = {
  title: 'Latina — Premium Women\'s Shoes',
  description: 'Cinematic luxury footwear experience for Algerian women.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${cormorant.variable} ${playfair.variable} ${naskh.variable}`}>
        {children}
      </body>
    </html>
  );
}
