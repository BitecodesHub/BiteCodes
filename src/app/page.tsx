// src/app/page.tsx (Server Component)
import { Metadata } from 'next';
import HomeClient from '../components/HomeClient';

export const metadata: Metadata = {
  title:
    'Bitecodes Academy — Free CMAT, NFSU, DAU, MSCIT Preparation | Mock Tests & Notes',
  description:
    'Bitecodes Academy offers 100% free entrance exam preparation for CMAT, NFSU, DAU, MSCIT and other competitive exams. Access free mock tests, previous year papers, syllabus, PDFs, and university-wise admission & seat information to boost your success.',
  keywords:
    'free entrance exam preparation, CMAT free mock tests, NFSU preparation, DAU entrance exam, MSCIT syllabus, previous year papers, online mock tests, free study material, Bitecodes Academy, competitive exams India',
  authors: [{ name: 'Bitecodes Team', url: 'https://www.bitecodes.com' }],
  creator: 'Bitecodes Academy',
  publisher: 'Bitecodes Academy',
  metadataBase: new URL('https://www.bitecodes.com'),
  alternates: {
    canonical: 'https://www.bitecodes.com',
  },
  openGraph: {
    title:
      'Bitecodes Academy — Free CMAT, NFSU, DAU, MSCIT Entrance Exam Prep',
    description:
      'Prepare smarter with free mock tests, PDFs, syllabus, and university-wise info for CMAT, NFSU, DAU, MSCIT and more. Trusted by students across India.',
    url: 'https://www.bitecodes.com',
    siteName: 'Bitecodes Academy',
    images: [
      {
        url: 'https://www.bitecodes.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bitecodes Academy — Free Entrance Exam Preparation Platform',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bitecodes',
    creator: '@bitecodes',
    title:
      'Bitecodes Academy — Free Entrance Exam Mock Tests & Notes',
    description:
      'Free CMAT, NFSU, DAU, MSCIT mock tests, syllabus and preparation material. Start your free exam prep with Bitecodes Academy today.',
    images: ['https://www.bitecodes.com/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function Home() {
  return <HomeClient />;
}
