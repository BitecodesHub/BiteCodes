// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoutes from '@/components/ProtectedRoute';
import AIChatbot from '@/components/Chatbot';
import 'leaflet/dist/leaflet.css';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bitecodes Academy - Entrance Exam Hub',
  description:
    'Explore entrance exams, universities, preparation docs, and mock tests all in one place.',
  keywords:
    'Bitecodes, entrance exams, university preparation, mock tests, NFSU, DAIICT, exam info',
  authors: [{ name: 'Bitecodes Team' }],
  creator: 'Bitecodes',
  metadataBase: new URL('https://www.bitecodes.com'),
  openGraph: {
    title: 'Bitecodes Academy - Entrance Exam Hub',
    description:
      'Explore entrance exams, universities, preparation docs, and mock tests all in one place.',
    url: 'https://www.bitecodes.com',
    siteName: 'Bitecodes',
    images: [
      {
        url: '/globe.svg',
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
    images: ['/globe.svg'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

// This inner component can use hooks
function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isPremiumUser } = useAuth();

  return (
    <>
      {/* Only load AdSense script if user is NOT premium */}
      {!isPremiumUser() && (
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9833740511867029"
          crossOrigin="anonymous"
        />
      )}

      {/* Razorpay script stays loaded for everyone */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Main site layout */}
      <Header />
      <AIChatbot />
      <ProtectedRoutes>
        <main>{children}</main>
      </ProtectedRoutes>
      <Footer />
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
