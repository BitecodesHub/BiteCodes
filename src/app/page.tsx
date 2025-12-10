// src/app/page.tsx (Server Component)
import { Metadata } from 'next';
import HomeClient from '../components/HomeClient';

export const metadata: Metadata = {
  title: 'Bitecodes Academy | Entrance Exams, Universities, Preparation Guides & Mock Tests',
  description:
    'Bitecodes Academy is your ultimate platform for entrance exam preparation. Access top university details, expert preparation guides, previous year papers, and AI-powered free mock tests. Unlock your academic success today!',
  keywords:
    'Bitecodes Academy, entrance exams, DAU, NFSU, NIRMA, university info, mock tests, preparation guides, previous year papers, online tests, NFSU, DAIICT, competitive exams, career preparation',
  authors: [{ name: 'Bitecodes Team', url: 'https://bitecodes.com' }],
  creator: 'Bitecodes Academy',
  metadataBase: new URL('https://bitecodes.com'),
  openGraph: {
    title: 'Bitecodes Academy | Free Mock Tests & Entrance Exam Preparation',
    description:
      'Join thousands of students using Bitecodes Academy to prepare for DAU, NIRMA, NFSU and more. Get university-wise info, expert-curated materials, and full-length mock tests.',
    url: 'https://bitecodes.com',
    siteName: 'Bitecodes Academy',
    images: [
      {
        url: 'https://bitecodes.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bitecodes Academy - Your Gateway to Success',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bitecodes',
    creator: '@bitecodes',
    title: 'Bitecodes Academy | Entrance Exam Hub',
    description:
      'Free mock tests, university data, and preparation material for exams like DAU, NIRMA, NFSU. Start your journey to success today with Bitecodes Academy!',
    images: ['https://bitecodes.com/og-image.jpg'],
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