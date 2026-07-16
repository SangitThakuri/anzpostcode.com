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
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "ANZ Postcode – Australia & New Zealand Postcode Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ANZ Postcode",
  url: "https://anzpostcode.com",
  logo: "https://anzpostcode.com/og-image.svg",
  description: "Free Australia and New Zealand postcode directory covering 18,000+ AU postcodes and 150+ NZ postcodes.",
  contactPoint: { "@type": "ContactPoint", contactType: "customer support", url: "https://anzpostcode.com/contact" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      </body>
    </html>
  );
}
