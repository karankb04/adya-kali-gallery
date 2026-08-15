export default function SiteHeader() {
  return (
    <header className="bar" id="bar">
      <a href="/" className="mark" style={{ textDecoration: "none" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Maa Adya Kali Gallery logo" />
        Maa Adya Kali Gallery
      </a>

      <nav className="navlinks">
        <a href="/gallery">Gallery</a>
        <a href="/about">About</a>
        <a href="/music">Music</a>
        <a href="/blog" className="nav-katha">
          Katha
        </a>
      </nav>

      <div className="nav-cta">
        <a href="/about#seva" className="btn-donate">
          <span className="btn-donate-decor" />
          <span className="btn-donate-content">
            <span className="btn-donate-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="15">
                <path
                  d="M12 21s-7.5-4.66-10-9.13C.53 8.66 2.24 5 5.9 5c2.1 0 3.5 1.2 4.1 2.28h.9C11.5 6.2 12.9 5 15 5c3.66 0 5.37 3.66 3.9 6.87C19.5 16.34 12 21 12 21z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span className="btn-donate-text">Donate</span>
          </span>
        </a>

        <a
          href="https://kaliputra.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-mission"
        >
          <span className="btn-mission-fill" />
          <span className="btn-mission-text">Visit KaliPutra Mission</span>
          <span className="btn-mission-arrow" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="13">
              <path
                d="M4 12L12 4M12 4H5.5M12 4V10.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
      </div>
    </header>
  );
}
