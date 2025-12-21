// app/layout.tsx
'use client';

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProtectedRoutes from '../components/ProtectedRoute';
import Script from 'next/script';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bitecodes Academy — Free CMAT, NFSU, DAU, MSCIT Prep | Mock Tests & Notes',
  description:
    'Bitecodes Academy — Free, high-quality preparation materials, mock tests, syllabus, and university-wise seat info for CMAT, NFSU, DAU, MSCIT and other entrance exams. Start free practice tests, download notes & PDFs, and improve with curated resources.',
  keywords:
    'free prep, CMAT preparation, NFSU mock tests, DAU entrance exam, MSCIT study material, entrance exam notes, mock tests, university seat info, Bitecodes Academy',
  authors: [{ name: 'Bitecodes Team' }],
  creator: 'Bitecodes',
  metadataBase: new URL('https://www.bitecodes.com'),
  openGraph: {
    title: 'Bitecodes Academy — Free CMAT, NFSU, DAU, MSCIT Prep',
    description:
      'Free mock tests, PDF notes, syllabus and university-wise seat information for CMAT, NFSU, DAU, MSCIT and more.',
    url: 'https://www.bitecodes.com',
    siteName: 'Bitecodes Academy',
    images: [
      {
        url: '/globe.svg',
        width: 1200,
        height: 630,
        alt: 'Bitecodes Academy — Free Exam Prep',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitecodes Academy — Free Entrance Exam Prep',
    description:
      'Practice CMAT, NFSU, DAU, MSCIT mock tests for free. Download notes and PDFs.',
    site: '@bitecodes',
    creator: '@bitecodes',
    images: ['/globe.svg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  alternates: {
    canonical: 'https://www.bitecodes.com',
  },
};

// Dynamically import the chatbot (don't SSR) so it won't hurt initial LCP
const AIChatbot = dynamic(() => import('../components/Chatbot'), { ssr: false });

// Small accessible "skip to content" component
function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-white focus:p-2 focus:rounded shadow"
      aria-label="Skip to main content"
    >
      Skip to content
    </a>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  // Use the auth hook to decide whether to load ads
  let isPremium = false;
  try {
    // If useAuth is not exported, this will still fail silently at runtime in a safe way
    // (we wrap in try/catch to avoid build/runtime crashes in case of missing export)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isPremiumUser } = useAuth();
    isPremium = typeof isPremiumUser === 'function' ? isPremiumUser() : false;
  } catch (e) {
    // fallback: assume non-premium to still show value
    isPremium = false;
  }

  return (
    <>
      <SkipToContent />

      {/* Preconnect & preloads for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preload" as="image" href="/globe.svg" />
      <link rel="canonical" href="https://www.bitecodes.com" />
      <link rel="alternate" hrefLang="en" href="https://www.bitecodes.com" />
      <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />

      {/* Load AdSense only for non-premium users */}
      {!isPremium && (
        <Script
          id="adsense"
          strategy="afterInteractive"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9833740511867029"
          crossOrigin="anonymous"
        />
      )}

      {/* Razorpay — lightweight and deferred */}
      <Script id="razorpay" strategy="afterInteractive" src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* JSON-LD structured data to help search engines understand the site */}
      <Script
        id="ld-json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EducationOrganization',
            name: 'Bitecodes Academy',
            url: 'https://www.bitecodes.com',
            logo: 'https://www.bitecodes.com/globe.svg',
            sameAs: ['https://twitter.com/bitecodes', 'https://www.linkedin.com/company/bitecodes'],
            contactPoint: [
              {
                '@type': 'ContactPoint',
                telephone: '+91-XXXXXXXXXX',
                contactType: 'customer service',
                areaServed: 'IN',
                availableLanguage: ['English'],
              },
            ],
            description:
              'Free preparation materials, mock tests, and PDF downloads for CMAT, NFSU, DAU, MSCIT and more. University-wise seat info, dynamic syllabus and practice tests.',
          }),
        }}
      />

      {/* Main site layout — semantic & accessible */}
      <Header />

      {/* Chatbot loaded client-side only */}
      <AIChatbot />

      <ProtectedRoutes>
        <main id="main-content" role="main" aria-label="Bitecodes Academy main content">
          {children}
        </main>
      </ProtectedRoutes>

      <Footer />

      {/* Helpful analytics/meta scripts placed after interactive to avoid blocking LCP
          (Add your analytics script id or only enable for production) */}
      {/* Example: Google Analytics placeholder (uncomment & replace ID in production) */}
      {false && (
        <Script
          id="ga"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"
        />
      )}

      {/* Robots / crawl-rate control for certain bots could be added here if needed */}
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white text-slate-900`}> 
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
