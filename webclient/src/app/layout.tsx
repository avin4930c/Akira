import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { inter, jetbrainsMono } from "@/fonts/fonts";

export const metadata: Metadata = { // TODO: Add images in openGraph and twitter metadata
  title: 'Akira - AI for Riders & Mechanics',
  description: 'Advanced AI platform for motorcycle riders and mechanics. Chat with AI about maintenance, repairs, and riding tips.',
  authors: [{ name: 'Akira' }],
  openGraph: {
    title: 'Akira - AI for Riders & Mechanics',
    description: 'Advanced AI platform for motorcycle riders and mechanics. Get expert guidance on maintenance, repairs, and riding tips.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@akira_ai',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
        <body
          className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#0a0a0a] text-foreground`}
        >
          {children}
        </body>
      </html>
    </Providers>
  );
}
