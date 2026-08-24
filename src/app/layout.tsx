import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LayoutTransition } from '@/components/ui/PageTransition';
import { ReduceMotionProvider } from '@/components/ui/ReduceMotionProvider';
import { LoadingProvider } from '@/context/LoadingContext';
import { NavMenu } from '@/components/nav/NavMenu';
import { NavigationLoader } from '@/components/loading/NavigationLoader';
import { LoadingScreen } from '@/components/loading/LoadingScreen';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Astra Artillery - Jogo de Artilharia 2D',
  description: 'Jogo web original de artilharia em turnos. Calcule ângulo, potência e vento para derrotar seus oponentes.',
  keywords: ['jogo', 'artilharia', 'turnos', '2D', 'web', 'estratégia', 'astra', 'artillery'],
  authors: [{ name: 'Equipe Astra Artillery' }],
  creator: 'Equipe Astra Artillery',
  publisher: 'Astra Artillery',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://astra-artillery.vercel.app',
    title: 'Astra Artillery - Jogo de Artilharia 2D',
    description: 'Jogo web original de artilharia em turnos. Calcule ângulo, potência e vento para derrotar seus oponentes.',
    siteName: 'Astra Artillery',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Astra Artillery',
    description: 'Jogo web original de artilharia em turnos.',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/brand/logo-mark.svg',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4ade80" />
      </head>
      <body className="min-h-screen flex flex-col">
        <LoadingProvider>
          <NavigationLoader />
          <ReduceMotionProvider>
            <LayoutTransition>{children}</LayoutTransition>
          </ReduceMotionProvider>
          <NavMenu />
          <LoadingScreen />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js')
                      .then(registration => {
                        console.log('SW registered:', registration);
                      })
                      .catch(error => {
                        console.log('SW registration failed:', error);
                      });
                  });
                }
              `,
            }}
          />
        </LoadingProvider>
      </body>
    </html>
  );
}