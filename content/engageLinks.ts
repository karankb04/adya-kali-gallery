export interface EngageLink {
  id: string;
  label: string;
  description: string;
  href: string;
}

/**
 * TODO: swap every "#" for the real destination before launch — YouTube
 * channel, YouTube Music, Spotify, and the specific kaliputra.com pages
 * and Google Form the user wants linked here.
 */
export const ENGAGE_LINKS: EngageLink[] = [
  {
    id: "youtube",
    label: "YouTube",
    description: "Watch katha, kirtans & darshan videos",
    href: "#",
  },
  {
    id: "youtube-music",
    label: "YouTube Music",
    description: "Listen to mantras & bhajans",
    href: "#",
  },
  {
    id: "spotify",
    label: "Spotify",
    description: "Stream the chants, anywhere",
    href: "#",
  },
  {
    id: "library",
    label: "The Library",
    description: "The full teaching library at KaliPutra Mission",
    href: "#",
  },
  {
    id: "sahasranama",
    label: "Sahasranama",
    description: "Her thousand names, one by one",
    href: "#",
  },
  {
    id: "rituals",
    label: "Rituals",
    description: "Practices and rituals of the mission",
    href: "#",
  },
  {
    id: "sadhana",
    label: "Sadhana",
    description: "Guided sadhana for devotees",
    href: "#",
  },
  {
    id: "adyasena",
    label: "Join Adyasena",
    description: "Become part of the sangha",
    href: "#",
  },
  {
    id: "instagram",
    label: "Instagram",
    description: "Daily darshan & updates",
    href: "https://www.instagram.com/kaliputramission/",
  },
];
