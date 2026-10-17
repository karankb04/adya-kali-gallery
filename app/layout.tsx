import type { Metadata } from "next";
import localFont from "next/font/local";
import { Mukta, Roboto_Slab } from "next/font/google";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import "./globals.css";

// Self-hosted and preloaded by Next instead of a CSS @import chain, so text
// can paint without waiting on third-party CSS. globals.css maps these
// variables onto --disp / --body / --deva.
const clash = localFont({
  src: [
    { path: "./fonts/clash/ClashDisplay-400.woff2", weight: "400" },
    { path: "./fonts/clash/ClashDisplay-500.woff2", weight: "500" },
    { path: "./fonts/clash/ClashDisplay-600.woff2", weight: "600" },
    { path: "./fonts/clash/ClashDisplay-700.woff2", weight: "700" },
  ],
  variable: "--font-clash",
  display: "swap",
});

const slab = Roboto_Slab({
  subsets: ["latin", "latin-ext"],
  variable: "--font-slab",
  display: "swap",
});

const mukta = Mukta({
  weight: ["400", "500", "600", "700"],
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
    <html lang="en" className={`${clash.variable} ${slab.variable} ${mukta.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
