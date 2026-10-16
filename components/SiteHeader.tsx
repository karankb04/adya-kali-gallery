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
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
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
