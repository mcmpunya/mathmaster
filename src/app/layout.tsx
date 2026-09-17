import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SPM Math Master — Interactive Mathematics for Form 4 & 5",
  description:
    "Bilingual (BM + English) SPM Mathematics app for Malaysian students. Covers Matematik and Matematik Tambahan with interactive solver, graph plotter, formula sheet, and past-year SPM questions.",
  keywords: [
    "SPM",
    "Mathematics",
    "Matematik",
    "Matematik Tambahan",
    "Additional Mathematics",
    "Form 4",
    "Form 5",
    "Malaysia",
    "KSSM",
  ],
  manifest: "/manifest.json",
  icons: { icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SPM Math",
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
        <Toaster />
        <Sonner />
      </body>
    </html>
  );
}
