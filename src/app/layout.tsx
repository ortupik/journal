import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Lato } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import ClientWrapper from '@/components/common/ClientWrapper';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shamiri Journal',
  description: 'Personal Journal'
};

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap',
  fallback: ['system-ui', 'arial', 'sans-serif'],
  preload: true,
  variable: '--font-lato'
});

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang='en' className={`${lato.className}`} suppressHydrationWarning>
      <head>
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap'
        />
      </head>
      <body className={'overflow-hidden'}>
        <Providers session={session}>
          <ClientWrapper>
            <NuqsAdapter>
              <NextTopLoader showSpinner={false} />
              <Toaster />
              {children}
            </NuqsAdapter>
          </ClientWrapper>
        </Providers>
      </body>
    </html>
  );
}
