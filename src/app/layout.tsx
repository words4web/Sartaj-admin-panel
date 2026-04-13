import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "@/providers/AppProviders";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  userScalable: true,
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Dashboard | Sartaj Admin",
  description: "Admin management panel for Sartaj Foods",
  icons: {
    icon: [
      {
        url: "/favicons_sartaj/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicons_sartaj/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: "/favicons_sartaj/apple-touch-icon.png",
  },
  manifest: "/favicons_sartaj/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Providers>{children}</Providers>
        <Toaster duration={2000} position="top-right" richColors />
        <Analytics />
      </body>
    </html>
  );
}
