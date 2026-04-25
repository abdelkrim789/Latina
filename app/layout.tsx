import type { Metadata } from 'next';
import './globals.css';

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
    <html>
      <body>{children}</body>
    </html>
  );
}
