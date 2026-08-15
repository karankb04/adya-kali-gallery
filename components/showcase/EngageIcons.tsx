const ICONS: Record<string, JSX.Element> = {
  youtube: (
    <svg viewBox="0 0 24 24" fill="none" width="19">
      <rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5z" fill="currentColor" />
    </svg>
  ),
  "youtube-music": (
    <svg viewBox="0 0 24 24" fill="none" width="19">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 15.2a1.8 1.8 0 100-3.6 1.8 1.8 0 000 3.6z" fill="currentColor" />
      <path d="M11.8 13.6V8l4-1v5.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  spotify: (
    <svg viewBox="0 0 24 24" fill="none" width="19">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 10.2c3.2-.9 6.8-.7 9.6.9M7.4 13.1c2.7-.7 5.6-.5 7.9.8M7.8 15.9c2.2-.5 4.4-.4 6.2.6"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  library: (
    <svg viewBox="0 0 24 24" fill="none" width="19">
      <path d="M4 5.5c2.3-1 4.7-1 7 0v13c-2.3-1-4.7-1-7 0v-13zM20 5.5c-2.3-1-4.7-1-7 0v13c2.3-1 4.7-1 7 0v-13z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  sahasranama: (
    <svg viewBox="0 0 24 24" fill="none" width="19">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="6.8" r="1.15" fill="currentColor" />
      <circle cx="16.2" cy="9.2" r="1.15" fill="currentColor" />
      <circle cx="16.2" cy="14.2" r="1.15" fill="currentColor" />
      <circle cx="12" cy="16.6" r="1.15" fill="currentColor" />
      <circle cx="7.8" cy="14.2" r="1.15" fill="currentColor" />
      <circle cx="7.8" cy="9.2" r="1.15" fill="currentColor" />
    </svg>
  ),
  rituals: (
    <svg viewBox="0 0 24 24" fill="none" width="19">
      <path d="M12 3c1.8 2.6 2.6 4.7 2.6 6.4a2.6 2.6 0 11-5.2 0C9.4 7.7 10.2 5.6 12 3z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6 21c1.2-4 3-6 6-6s4.8 2 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  sadhana: (
    <svg viewBox="0 0 24 24" fill="none" width="19">
      <path d="M12 20c-4.5 0-7-2.4-7-5.4 1.8 1 3.7 1.1 5-.2-1.3-1-1.9-2.6-1.4-4.5 1.7.4 3 1.4 3.4 3 .4-1.6 1.7-2.6 3.4-3 .5 1.9-.1 3.5-1.4 4.5 1.3 1.3 3.2 1.2 5 .2 0 3-2.5 5.4-7 5.4z"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  adyasena: (
    <svg viewBox="0 0 24 24" fill="none" width="19">
      <rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.5 9.5h7M8.5 13h7M8.5 16.5h4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" width="19">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" />
    </svg>
  ),
};

export default function EngageIcon({ id }: { id: string }) {
  return ICONS[id] ?? null;
}
