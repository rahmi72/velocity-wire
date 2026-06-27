import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import "./globals.css";
import AdSlot from '@/components/AdSlot'; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Velocity Wire | Global Sports, Auto, Crypto & Finance",
  description: "Adrenaline. Speed. Alpha.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-300 antialiased`}>
        <AdSlot type="header" /> {/* <--- IKLAN HEADER */}
        <AdSlot type="native" />
        {children}

        <AdSlot type="popunder" />

        {/* PASANG GOOGLE ANALYTICS DI SINI */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
      </body>
    </html>
  );
}