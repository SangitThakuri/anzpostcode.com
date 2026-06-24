import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ANZ Postcode – Australia & New Zealand Postcode Directory",
    template: "%s | ANZ Postcode",
  },
  description:
    "Find Australian and New Zealand postcodes, suburbs, and localities. Search postcodes, explore by state or region, and discover nearby areas.",
  metadataBase: new URL("https://anzpostcode.com"),
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "ANZ Postcode",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
