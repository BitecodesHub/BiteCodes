// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bitecodes Academy - Entrance Exam Hub',
  description:
    'Explore entrance exams, universities, preparation docs, and mock tests all in one place.',
  keywords:
    'Bitecodes, entrance exams, university preparation, mock tests, NFSU, DAIICT, exam info',
  authors: [{ name: 'Bitecodes Team' }],
  creator: 'Bitecodes',
  metadataBase: new URL('https://www.bitecodes.in'), // update if hosted elsewhere
  openGraph: {
    title: 'Bitecodes Academy - Entrance Exam Hub',
    description:
      'Explore entrance exams, universities, preparation docs, and mock tests all in one place.',
    url: 'https://www.bitecodes.in',
    siteName: 'Bitecodes',
    images: [
      {
        url: '/public/globe.svg',
        width: 1200,
        height: 630,
        alt: 'Bitecodes Academy',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitecodes Academy',
    description:
      'Explore entrance exams, universities, preparation docs, and mock tests all in one place.',
    site: '@bitecodes',
    creator: '@bitecodes',
    images: ['/public/globe.svg'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
