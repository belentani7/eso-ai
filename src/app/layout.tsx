import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DANI - Tu Amigo de Estudio | William AI Tutor',
  description: 'IA educativa personalizada para William: Español, Catalán, Inglés, Matemáticas, Cultura y Música',
  keywords: ['educación', 'IA', 'idiomas', 'matemáticas', 'adolescentes', 'migración'],
  authors: [{ name: 'Belentani Labs' }],
  openGraph: {
    title: 'DANI - Tu Amigo de Estudio',
    description: 'IA educativa personalizada para William',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        {children}
      </body>
    </html>
  );
}