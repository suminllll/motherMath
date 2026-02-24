import type { Metadata } from "next";
import { Noto_Sans_KR } from 'next/font/google'
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Providers from "./providers";

const notoSans = Noto_Sans_KR({
  variable: '--font-noto-sans',
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
})

export const metadata: Metadata = {
  title: "마더수학 - 맞춤형 수학 교육",
  description: "학생 개개인의 특성을 고려한 맞춤형 수학 교육으로 진정한 수학 실력 향상을 이끌어냅니다.",

    keywords: ['마더수학', '수학학원','학원','중학교수학','초등학교수학','고등학교수학','강서구학원','강서구수학'],
  metadataBase: new URL('https://mothermath.com'),
  alternates: {
    canonical: '/',
  },
  icons:{
    icon:'/favicon.ico',
    shortcut: "/favicon.png",
  },
  openGraph: {
    title: '마더수학',
    description: '맞춤형 수학 교육',
    url: 'https://mothermath.com',
    siteName: '마더수학',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 800,
        height: 400,
        alt: '마더수학 - 맞춤형 수학 교육'
      }
    ]
  },

   robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  return (
    <html lang="ko">
      <head>
        <meta name="naver-site-verification" content="155b524d12872dafac2fa07ac592e235e8d31fde" />
        <meta name="google-site-verification" content="2EkPcqyXjjwzVZ-KjsesgSCnGcmOyDas-41d6ipy5FE" />
      </head>
      <body
        className={`${notoSans.variable} font-sans antialiased m-0 p-0`}
        suppressHydrationWarning
      >
        <Header />
        <Providers>
        <main className="">
          {children}
        </main>
        </Providers>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
