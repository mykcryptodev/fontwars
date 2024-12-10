import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import '@coinbase/onchainkit/styles.css'; 
import { Providers } from './providers'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FontWars - The Ultimate Font Battle on Base",
  description: "Join the epic battle between Comic Sans and Helvetica on Base. Trade, swap, and influence which font rules the web. Real-time font battles, live market data, and top holder rankings.",
  keywords: ["FontWars", "Comic Sans", "Helvetica", "Base", "Web3", "Cryptocurrency", "Font Trading", "DeFi"],
  authors: [{ name: "FontWars Team" }],
  openGraph: {
    title: "FontWars - The Ultimate Font Battle on Base",
    description: "Join the epic battle between Comic Sans and Helvetica on Base. Trade, swap, and influence which font rules the web.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "FontWars",
    images: [
      {
        url: "https://fontcoins.com/helvetica.webp",
        width: 1200,
        height: 630,
        alt: "FontWars Preview"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FontWars - The Ultimate Font Battle on Base",
    description: "Join the epic battle between Comic Sans and Helvetica on Base. Trade, swap, and influence which font rules the web.",
    images: ["https://fontcoins.com/helvetica.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://fontwars.lol"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
