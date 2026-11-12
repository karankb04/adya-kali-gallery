import localFont from "next/font/local";
import { Inter_Tight, Instrument_Serif, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";

// Candidate type systems for /components3 only. Declared here, not in the
// root layout, so no other page downloads them.

export const interTight = Inter_Tight({ subsets: ["latin"], variable: "--f3-inter-tight", display: "swap" });

export const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--f3-instrument",
  display: "swap",
});

export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["wdth", "opsz"],
  variable: "--f3-bricolage",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--f3-mono",
  display: "swap",
});

// Fontshare (ITF Free Font Licence), self-hosted.
export const boska = localFont({
  src: [
    { path: "./fonts/Boska-Variable.woff2", weight: "200 900", style: "normal" },
    { path: "./fonts/Boska-VariableItalic.woff2", weight: "200 900", style: "italic" },
  ],
  variable: "--f3-boska",
  display: "swap",
});

export const switzer = localFont({
  src: [{ path: "./fonts/Switzer-Variable.woff2", weight: "100 900", style: "normal" }],
  variable: "--f3-switzer",
  display: "swap",
});

export const satoshi = localFont({
  src: [{ path: "./fonts/Satoshi-Variable.woff2", weight: "300 900", style: "normal" }],
  variable: "--f3-satoshi",
  display: "swap",
});

export const FONT_VARS = [interTight, instrumentSerif, bricolage, jetbrainsMono, boska, switzer, satoshi]
  .map((f) => f.variable)
  .join(" ");
