import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import SessionProviderWrapper from "@/components/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false
});

export const metadata: Metadata = {
  title: "ProStudio | Studio Foto Profesional",
  description:
    "ProStudio adalah platform terdepan untuk studio foto profesional. Abadikan momen terbaik Anda dengan layanan fotografi dan editing foto yang canggih.",
  openGraph: {
    title: "ProStudio | Studio Foto Profesional",
    description:
      "Abadikan momen terbaik Anda dengan layanan fotografi dan editing foto profesional di ProStudio.",
    url: "https://prostudio.com",
    siteName: "ProStudio",
    images: [
      {
        url: "https://prostudio.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ProStudio"
      }
    ],
    locale: "id_ID",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "ProStudio | Studio Foto Profesional",
    description:
      "ProStudio adalah platform terdepan untuk studio foto profesional. Abadikan momen terbaik Anda dengan layanan fotografi dan editing foto yang canggih.",
    images: ["https://prostudio.com/og-image.jpg"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProviderWrapper>
      <html lang="en" suppressHydrationWarning={true}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          data-new-gr-c-s-check-loaded="14.1215.0"
          data-gr-ext-installed=""
          suppressHydrationWarning={true}
        >
          <Providers>{children}</Providers>
          <Toaster />
        </body>
      </html>
    </SessionProviderWrapper>
  );
}
