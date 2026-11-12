import type { Metadata } from "next";
import localFont from "next/font/local";
import {
  Bricolage_Grotesque,
  Instrument_Serif,
  JetBrains_Mono,
  Tiro_Devanagari_Hindi,
} from "next/font/google";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import "./globals.css";

// Self-hosted and preloaded by Next instead of a CSS @import chain, so text
// can paint without waiting on third-party CSS. globals.css maps these
// variables onto --disp / --body / --accent / --mono / --deva.

// "Living Grotesque": one variable grotesque for headings and text; headings
// use its condensed width.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth", "opsz"],
  variable: "--font-bricolage",
  display: "swap",
});

// The one word per heading set in a soft italic serif.
const accent = Instrument_Serif({
  weight: "400",
  style: "italic",
  subsets: ["latin", "latin-ext"],
  variable: "--font-accent",
  display: "swap",
});

// Small labels: nav links, [ bracket ] eyebrows, file-name captions.
const mono = JetBrains_Mono({
  weight: "500",
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
  display: "swap",
});

// Only the two header buttons still use Clash Display.
const clash = localFont({
  src: [{ path: "./fonts/clash/ClashDisplay-700.woff2", weight: "700" }],
  variable: "--font-clash",
  display: "swap",
});

// Calligraphic Devanagari with the stroke contrast of hand-lettered scripture.
const deva = Tiro_Devanagari_Hindi({
  weight: "400",
  subsets: ["devanagari"],
  variable: "--font-deva",
  display: "swap",
});

const description =
  "A living library of Maa Adya Kali — sacred images, her many forms, and teachings. Free darshan for devotees across the world.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — A Living Library of the Mother`,
    template: `%s · ${SITE_NAME}`,
  },
  description,
  keywords: [
    "Adya Kali",
    "Maa Kali",
    "Kali Mata",
    "Dakshina Kali",
    "Mahakali",
    "Kali images",
    "Kali darshan",
    "Hindu goddess",
    "Devi",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — A Living Library of the Mother`,
    description,
    images: [{ url: "/logo.png", width: 512, height: 512, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — A Living Library of the Mother`,
    description,
    images: ["/logo.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${accent.variable} ${mono.variable} ${clash.variable} ${deva.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
