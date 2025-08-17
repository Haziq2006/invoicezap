import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
import ErrorBoundary from '@/components/ErrorBoundary'
import UserFeedback from '@/components/UserFeedback'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'InvoiceZap - Create Professional Invoices in 30 Seconds',
    template: '%s | InvoiceZap'
  },
  description: 'Simple, mobile-friendly invoice generator for freelancers. Create, send, and track invoices in under 30 seconds. Get paid faster with our professional templates and payment integration.',
  keywords: [
    'invoice generator',
    'freelancer invoice',
    'invoice template',
    'PDF invoice',
    'payment tracking',
    'invoice software',
    'online invoice',
    'professional invoice',
    'invoice maker',
    'freelance invoicing',
    'invoice app',
    'invoice creator',
    'business invoice',
    'invoice management',
    'stripe invoice',
    'paypal invoice'
  ],
  authors: [{ name: 'InvoiceZap Team' }],
  creator: 'InvoiceZap',
  publisher: 'InvoiceZap',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://invoicezap.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://invoicezap.com',
    siteName: 'InvoiceZap',
    title: 'InvoiceZap - Create Professional Invoices in 30 Seconds',
    description: 'Simple, mobile-friendly invoice generator for freelancers. Create, send, and track invoices in under 30 seconds.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'InvoiceZap - Professional Invoice Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InvoiceZap - Create Professional Invoices in 30 Seconds',
    description: 'Simple, mobile-friendly invoice generator for freelancers. Create, send, and track invoices in under 30 seconds.',
    images: ['/og-image.png'],
    creator: '@invoicezap',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'business',
  classification: 'Business Software',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'InvoiceZap',
    'application-name': 'InvoiceZap',
    'msapplication-TileColor': '#2563eb',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#2563eb',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "InvoiceZap",
              "description": "Simple, mobile-friendly invoice generator for freelancers. Create, send, and track invoices in under 30 seconds.",
              "url": "https://invoicezap.com",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free plan available"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1250"
              },
              "author": {
                "@type": "Organization",
                "name": "InvoiceZap"
              }
            })
          }}
        />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://checkout.stripe.com" />
        <link rel="preconnect" href="https://api.stripe.com" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <UserFeedback trigger="time" delay={60000} />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
