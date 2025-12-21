'use client';

import dynamic from 'next/dynamic';
import Script from 'next/script';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProtectedRoutes from '../components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AIChatbot = dynamic(() => import('../components/Chatbot'), { ssr: false });

function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white p-2 rounded"
    >
      Skip to content
    </a>
  );
}

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isPremiumUser } = useAuth();
  const isPremium = isPremiumUser?.() ?? false;

  return (
    <AuthProvider>
      <SkipToContent />

      {!isPremium && (
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9833740511867029"
          crossOrigin="anonymous"
        />
      )}

      <Script
        strategy="afterInteractive"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      <Header />
      <AIChatbot />

      <ProtectedRoutes>
        <main id="main-content">{children}</main>
      </ProtectedRoutes>

      <Footer />
    </AuthProvider>
  );
}
