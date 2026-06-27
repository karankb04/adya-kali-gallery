import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adya Kali — A Living Library of the Mother",
  description:
    "A devotional gallery of Maa Adya Kali — sacred images, forms, and teachings.",
  openGraph: {
    title: "Adya Kali — A Living Library of the Mother",
    description: "A devotional gallery of Maa Adya Kali.",
    type: "website",
  },
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
