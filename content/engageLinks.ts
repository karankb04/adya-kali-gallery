export interface EngageLink {
  id: string;
  label: string;
  description: string;
  href: string;
  /** Heading the link sits under in "Walk with her". */
  group: "Watch and listen" | "Read and practise" | "Join";
}

/**
 * TODO: swap every "#" for the real destination before launch — YouTube
 * channel, YouTube Music, Spotify, and the specific kaliputra.com pages
 * and Google Form the user wants linked here.
 */
export const ENGAGE_LINKS: EngageLink[] = [
  {
    id: "youtube",
    group: "Watch and listen",
    label: "YouTube",
    description: "Watch katha, kirtans & darshan videos",
    href: "#",
  },
  {
    id: "youtube-music",
    group: "Watch and listen",
    label: "YouTube Music",
    description: "Listen to mantras & bhajans",
    href: "#",
  },
  {
    id: "spotify",
    group: "Watch and listen",
    label: "Spotify",
    description: "Stream the chants, anywhere",
    href: "#",
  },
  {
    id: "library",
    group: "Read and practise",
    label: "The Library",
    description: "The full teaching library at KaliPutra Mission",
    href: "#",
  },
  {
    id: "sahasranama",
    group: "Read and practise",
    label: "Sahasranama",
    description: "Her thousand names, one by one",
    href: "#",
  },
  {
    id: "rituals",
    group: "Read and practise",
    label: "Rituals",
    description: "Practices and rituals of the mission",
    href: "#",
  },
  {
    id: "sadhana",
    group: "Read and practise",
    label: "Sadhana",
    description: "Guided sadhana for devotees",
    href: "#",
  },
  {
    id: "adyasena",
    group: "Join",
    label: "Join Adyasena",
    description: "Become part of the sangha",
    href: "#",
  },
  {
    id: "instagram",
    group: "Join",
    label: "Instagram",
    description: "Daily darshan & updates",
    href: "https://www.instagram.com/kaliputramission/",
  },
];
