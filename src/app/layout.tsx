// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProtectedRoutes from '../components/ProtectedRoute';
import AIChatbot from '../components/Chatbot';
import 'leaflet/dist/leaflet.css';
import Script from 'next/script';
import { AuthProvider } from './contexts/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // better CLS & SEO
});

export const metadata: Metadata = {
  title:
    'Bitecodes Academy — Free CMAT, NFSU, DAU, MSCIT Entrance Exam Preparation',
  description:
    'Bitecodes Academy provides 100% free entrance exam preparation for CMAT, NFSU, DAU, MSCIT and other competitive exams. Access free mock tests, syllabus, PDFs, previous year papers, and university-wise admission information.',
  keywords: [
    'free entrance exam preparation',
    'CMAT mock tests',
    'NFSU entrance exam',
    'DAU exam preparation',
    'MSCIT syllabus',
    'previous year papers',
    'free online mock tests',
    'Bitecodes Academy',
  ],
  authors: [{ name: 'Bitecodes Team' }],
  creator: 'Bitecodes Academy',
  publisher: 'Bitecodes Academy',
  metadataBase: new URL('https://www.bitecodes.com'),
  alternates: {
    canonical: 'https://www.bitecodes.com',
  },
  openGraph: {
    title:
      'Bitecodes Academy — Free CMAT, NFSU, DAU, MSCIT Exam Prep',
    description:
      'Prepare smarter with free mock tests, syllabus, PDFs, and university-wise information for CMAT, NFSU, DAU, MSCIT and more.',
    url: 'https://www.bitecodes.com',
    siteName: 'Bitecodes Academy',
    locale: 'en_IN',
    images: [
      {
        url: '/globe.svg',
        width: 1200,
        height: 630,
        alt: 'Bitecodes Academy — Free Entrance Exam Preparation',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Bitecodes Academy — Free Entrance Exam Preparation',
    description:
      'Free CMAT, NFSU, DAU, MSCIT mock tests, syllabus, PDFs and preparation material.',
    site: '@bitecodes',
    creator: '@bitecodes',
    images: ['/globe.svg'],
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
    apple: '/apple-touch-icon.png',
  },
};

// Inner layout (no hooks, safe for SSR & prerender)
function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* AdSense (global, lightweight) */}
      <Script
        async
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9833740511867029"
        crossOrigin="anonymous"
      />

      {/* Razorpay */}
      <Script
        strategy="afterInteractive"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      {/* Structured Data for SEO */}
      <Script
        id="structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EducationOrganization',
            name: 'Bitecodes Academy',
            url: 'https://www.bitecodes.com',
            logo: 'https://www.bitecodes.com/globe.svg',
            description:
              'Free entrance exam preparation platform for CMAT, NFSU, DAU, MSCIT with mock tests and study material.',
            areaServed: 'IN',
          }),
        }}
      />

      {/* Layout */}
      <Header />
      <AIChatbot />

      <ProtectedRoutes>
        <main role="main">{children}</main>
      </ProtectedRoutes>

      <Footer />
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
