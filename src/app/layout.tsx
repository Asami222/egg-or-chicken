
import "./globals.css";
import Header from "components/header";
import Footer from "components/footer";
import { Roboto, IBM_Plex_Sans_JP } from 'next/font/google';
import { ReactQueryClientProvider } from "components/ReactQueryClientProvider";
import { Suspense } from 'react';
import type { Metadata } from "next";

export const roboto = Roboto({
  weight: ['300','400','500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
  preload: false
});

export const ibm_plex_sans = IBM_Plex_Sans_JP({
  weight: ['400','500','700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
  preload: false
})

export const metadata: Metadata = {
  title: "Egg or Chicken",
  description: "アプリに定期的にアクセスして様々な色の卵を集めましょう！当日の天気の状態によって獲得できるアイテムが変わります。"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html lang="ja">
      <ReactQueryClientProvider>
      <body className="flex flex-col min-h-screen justify-center">
        <Header />
          <main className="flex justify-center bg-[#EBF3FF] flex-grow pb-10" role="main" id="main-content">
            <div className="w-[86%] max-w-sm">
              <Suspense fallback={<p>読み込み中...</p>}>
              {children}
              </Suspense>
            </div>
          </main>
        <Footer />
      </body>
      </ReactQueryClientProvider>
    </html>
  );
}
