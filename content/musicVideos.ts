export interface MusicVideo {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
}

/**
 * Pulled from the ADYAKALI MUSIC YouTube channel
 * (youtube.com/@ADYAKALIMUSIC_KPM) — the 7 landscape videos, Shorts
 * excluded. Titles are cleaned of trailing hashtag spam; re-check against
 * the channel occasionally in case new videos are published.
 */
export const MUSIC_VIDEOS: MusicVideo[] = [
  {
    id: "shatnama-stotram",
    youtubeId: "ix9dbRnJi2Q",
    title: "Sri Adyakali Shatnama Stotram",
    description: "108 names of Ādyakāli, chanted in full.",
  },
  {
    id: "kandene-kaali",
    youtubeId: "yGW_-xK8fAI",
    title: "Kandene Kaali",
    description: "The divine vision of Maa Kali — a Tamil devotional music video.",
  },
  {
    id: "svayambhu-stuti",
    youtubeId: "2xKBgTOBWh8",
    title: "Svayambhu Kali Stuti",
    description: "From the Adyakali Sahasranama.",
  },
  {
    id: "sleep-meditation",
    youtubeId: "luqHIdpSP6E",
    title: "Powerful Meditation / Sleep Music",
    description: "Jai Maa Ādyakāli — long-form meditation music.",
  },
  {
    id: "batuka-bhairava",
    youtubeId: "occBkQrfLSQ",
    title: "Ādyakāli Putra Batuka Bhairavā",
    description: "In Ananda Bhairavi rāga.",
  },
  {
    id: "smaran-bhairava",
    youtubeId: "ckz1IsultNE",
    title: "Smaran Bhairavā",
    description: "A devotional remembrance of Bhairava, for Adyakali.",
  },
  {
    id: "bhairavakalike",
    youtubeId: "mNhfNKDukrc",
    title: "Bhairavakālike Namostute",
    description: "A devotional anthem in praise of the Mother.",
  },
];
