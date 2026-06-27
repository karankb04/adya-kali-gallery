# Google Sheet + Apps Script — Image Metadata Backend

This makes a **Google Sheet the single source of truth** for every image's data
and SEO fields. An Apps Script Web App serves it as JSON; the site reads it every
~60 seconds, so **edits go live within a minute with no redeploy**.

```
You edit the Sheet → Apps Script Web App (JSON API) → Next.js (ISR ~60s) → Vercel
Images themselves stay in Cloudflare R2; the Sheet just references filenames (r2Key).
```

---

## 1. Create the Sheet

1. Go to <https://sheets.new> and name it **Adya Kali — Images**.
2. Rename the bottom tab to exactly **`Images`** (double-click the tab).
3. Open [`docs/images-seed.tsv`](./images-seed.tsv) from this repo, select **all**,
   copy it, click cell **A1** in the Sheet, and paste. It fills the header row +
   all 22 current images, already populated with dimensions, alt text and slugs.

### Column reference

| Column | Required | What it is |
|---|---|---|
| `id` | ✅ | Stable unique id (e.g. `kali-001`) |
| `r2Key` | ✅ | Exact filename in your R2 bucket |
| `active` | | `TRUE` to show, `FALSE` to hide (blank = shown) |
| `nameDevanagari` | ✅ | Name in Devanagari |
| `transliteration` | ✅ | Roman/IAST name |
| `form` | ✅ | Form (drives the filter pills) |
| `teachingCaption` | ✅ | Caption shown in the darshan modal |
| `isAI` | | `TRUE` if AI-generated |
| `altText` | SEO | Descriptive alt text (accessibility + image SEO) |
| `slug` | SEO | URL-friendly id (auto-fillable from the menu) |
| `description` | SEO | Longer description for structured data |
| `tags` | SEO | Comma-separated keywords |
| `creditText` / `creator` | SEO | Attribution (Google Images credit) |
| `license` | SEO | License URL/text → "Licensable" badge eligibility |
| `acquireLicensePage` | SEO | Where to get usage rights (optional) |
| `dateCreated` | SEO | ISO date |
| `order` | | Sort order (lower = earlier) |
| `width` / `height` | SEO/perf | Pixel size (prevents layout shift) |
| `dominantColor` | perf | Hex placeholder color while loading |

---

## 2. Add the Apps Script

1. In the Sheet: **Extensions → Apps Script**.
2. Delete any starter code, paste the entire contents of
   [`apps-script/Code.gs`](../apps-script/Code.gs), and **Save** (💾).
3. Reload the Sheet tab once — a new **“Adya Kali”** menu appears with helpers:
   - **Fill missing slugs**
   - **Fetch image dimensions** (reads new images and writes width/height back)
   - **Validate rows** (flags missing ids, duplicates, etc.)

---

## 3. Deploy as a Web App

1. Apps Script → **Deploy → New deployment**.
2. Gear icon → **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** **Anyone**
4. **Deploy**, authorize when prompted, and **copy the Web app URL**
   (ends in `/exec`).

> Test it: open that URL in a browser — you should see JSON with your images.

---

## 4. Connect it to the site

Add the URL as an environment variable (locally **and** in Vercel):

```bash
# .env.local  (and Vercel → Settings → Environment Variables)
IMAGES_API_URL=https://script.google.com/macros/s/XXXXXXXX/exec
NEXT_PUBLIC_SITE_URL=https://your-domain-or-vercel-url
```

- In Vercel: **Settings → Environment Variables → Add** both, then **Redeploy** once.
- After that, every Sheet edit appears on the site within ~60 seconds — no redeploy.

> If `IMAGES_API_URL` is ever unset or the API fails, the site automatically falls
> back to the bundled `data/images.json`, so it never breaks.

---

## Adding a new image later

1. Upload the image file to the R2 bucket (Cloudflare dashboard).
2. Add a row in the Sheet: fill `id`, `r2Key` (the filename), name fields, `form`,
   `teachingCaption`, `isAI`.
3. Run **Adya Kali → Fetch image dimensions**, then **Fill missing slugs**.
4. Done — it appears on the site within a minute.
