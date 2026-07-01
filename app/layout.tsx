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
      <head>
        <meta name="google-site-verification" content="9nc8-Sc-ExxEnYyIK_PyqxcdfrbvVqDtaEvC9M3p85o" />
            <AdSlot type="header" /> {/* <--- IKLAN HEADER */}
            <AdSlot type="native" />
      </head>
      <body className={`${inter.className} bg-slate-950 text-slate-300 antialiased`}>
        {children}

        <AdSlot type="popunder" />

        {/* PASANG GOOGLE ANALYTICS DI SINI */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
      </body>
    </html>
  );
}