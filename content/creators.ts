import { Creator } from "@/types/creator";

/**
 * EXAMPLE PROFILES — for reviewing the page's style only. Names, bios, and
 * facts below are placeholders (not real people), and every "work" links to
 * "#" with a stand-in thumbnail borrowed from the gallery. Once real
 * contributors are lined up, replace an entry wholesale rather than editing
 * fields in place — the shape (types/creator.ts) is what should persist.
 */
export const CREATORS: Creator[] = [
  {
    slug: "ananya-rao",
    name: "Ananya Rao",
    role: "Music Composer & Vocalist",
    category: "music",
    favoriteSeva:
      "Recording a chant late at night, when the house is quiet and it feels like she's the only one listening.",
    bio:
      "[Placeholder bio] Ananya composes and sings the stotrams and bhajans featured on the mission's music channel, blending classical raga structures with contemporary arrangement. She has been setting Adya Kali's names to melody for the past few years, working mostly from home with a harmonium and a single microphone.",
    facts: [
      { emoji: "📍", label: "Based in", value: "Chennai, India" },
      { emoji: "🎼", label: "Practicing since", value: "2021" },
      { emoji: "🎤", label: "Specialises in", value: "Stotram composition, vocal arrangement" },
      { emoji: "🗣️", label: "Languages", value: "Tamil, Sanskrit, English" },
    ],
    worksHeading: "Her voice, in song",
    works: [
      {
        title: "Chant Session — Shatnama Stotram",
        kind: "Music",
        href: "#",
        thumbnailR2Key: "64b871d7-e7e0-410d-9213-3f35f2e474a5 (1).jpeg",
        thumbnailDominantColor: "#701d0c",
      },
      {
        title: "Meditation Recording — Sleep Music",
        kind: "Music",
        href: "#",
        thumbnailR2Key: "WhatsApp Image 2026-06-24 at 05.43.04.jpeg",
        thumbnailDominantColor: "#2e2e2e",
      },
      {
        title: "Studio Session — Bhairava Chant",
        kind: "Music",
        href: "#",
        thumbnailR2Key: "WhatsApp Image 2026-06-24 at 08.51.31.jpeg",
        thumbnailDominantColor: "#89562e",
      },
    ],
  },
  {
    slug: "devika-menon",
    name: "Devika Menon",
    role: "Devotional Writer",
    category: "writer",
    favoriteSeva:
      "Sitting with an old devotee and just listening to how they first came to know her — then trying to put that feeling into words.",
    bio:
      "[Placeholder bio] Devika writes the katha published on this site — the stories behind Adya Kali's forms, her iconography, and the festivals devotees keep in her name. She trained as a journalist before turning to devotional writing full-time, and spends most of her research time in temple libraries and with oral histories from older devotees.",
    facts: [
      { emoji: "📍", label: "Based in", value: "Kolkata, India" },
      { emoji: "✍️", label: "Writing since", value: "2019" },
      { emoji: "📚", label: "Specialises in", value: "Iconography, festival history, oral tradition" },
      { emoji: "🗣️", label: "Languages", value: "Bengali, Hindi, English" },
    ],
    worksHeading: "Her words, published",
    works: [
      {
        title: "On the Symbolism of the Outstretched Tongue",
        kind: "Katha",
        href: "#",
        thumbnailR2Key: "SaveClip.App_618911727_17887876374419895_5214875700262540593_n.jpg",
        thumbnailDominantColor: "#7a6b61",
      },
      {
        title: "Reading the Garland: A Study in Symbols",
        kind: "Katha",
        href: "#",
        thumbnailR2Key: "WhatsApp Image 2026-06-22 at 13.41.11.jpeg",
        thumbnailDominantColor: "#492817",
      },
      {
        title: "A Devotee's Map of Her Many Forms",
        kind: "Katha",
        href: "#",
        thumbnailR2Key: "WhatsApp Image 2026-06-22 at 05.28.26.jpeg",
        thumbnailDominantColor: "#492817",
      },
    ],
  },
  {
    slug: "rohan-verma",
    name: "Rohan Verma",
    role: "Digital Artist",
    category: "artist",
    favoriteSeva:
      "The moment a generated sketch first resembles a face — before any of the fine detail, just the first hint that she's there.",
    bio:
      "[Placeholder bio] Rohan envisions Adya Kali's forms digitally, working iteratively with AI image tools guided by classical iconography and devotee descriptions until each piece feels true to how she's actually been seen. Every image is reviewed against traditional depictions before it's added to the library.",
    facts: [
      { emoji: "📍", label: "Based in", value: "Bengaluru, India" },
      { emoji: "🖌️", label: "Creating since", value: "2023" },
      { emoji: "🖥️", label: "Specialises in", value: "AI-assisted devotional portraiture" },
      { emoji: "🗣️", label: "Languages", value: "Hindi, English" },
    ],
    worksHeading: "Her many faces, envisioned",
    works: [
      {
        title: "Study — Adya Kali",
        kind: "Digital art",
        href: "#",
        thumbnailR2Key: "IMG_3734.PNG",
        thumbnailDominantColor: "#86645f",
      },
      {
        title: "Study — Shmashana Kali",
        kind: "Digital art",
        href: "#",
        thumbnailR2Key: "WhatsApp Image 2026-06-24 at 05.43.04.jpeg",
        thumbnailDominantColor: "#2e2e2e",
      },
      {
        title: "Study — Rakta Kali",
        kind: "Digital art",
        href: "#",
        thumbnailR2Key: "WhatsApp Image 2026-06-24 at 08.51.31.jpeg",
        thumbnailDominantColor: "#89562e",
      },
    ],
  },
];
