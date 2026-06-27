import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import "./globals.css";

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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
