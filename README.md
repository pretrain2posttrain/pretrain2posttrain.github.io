# Transitioning from Pre-Training to Post-Training — Workshop Website

Static, multi-page site for the NeurIPS 2026 workshop (Sydney, Australia · December 12, 2026).
Plain HTML/CSS/JS, no build step required to host — ready for GitHub Pages.

## Pages

```
index.html          # Home — hero, overview, why-now, central questions
call.html           # Call for Papers — topics, submission details, important dates
accepted.html       # Accepted papers — poster specs and oral presentation format
schedule.html       # Tentative schedule
speakers.html       # Invited speakers + organizers (photos link to homepages) + contact
assets/style.css    # styling (clean academic theme; colors are CSS variables up top)
assets/script.js    # mobile nav, active-link, auto-strike past dates
assets/img/         # speaker & organizer headshots (400×400)
```

## Editing content

Edit the `.html` files directly. Note the top nav and footer are duplicated in each page; if you
change either, change all five.

## Deploy on GitHub Pages

1. Put these files in a repo (`index.html` at the root).
2. Repo → **Settings → Pages** → Source: *Deploy from a branch* → `main` / `/ (root)`.
3. Live at `https://<user-or-org>.github.io/<repo>/`.
   For a clean root URL, name the repo `<name>.github.io`.

Local preview: `python3 -m http.server` in this folder → http://localhost:8000.

## Placeholders to fill (search for `TBD`)

- **OpenReview** submission link (call.html)
- **Important dates:** portal opens, submission deadline, notification, camera-ready (call.html).
  When you add a real date, also set `data-date="YYYY-MM-DD"` on that `<li>` — the script
  auto-dims + strikes it through once it passes.
- **Page limits** for short/long papers (call.html)
- **Venue page link** — the NeurIPS 2026 workshop page (index.html hero)

## Photos

All speaker/organizer headshots are their own homepage photos, normalized to 400×400.
A card with no photo falls back to an initials avatar: replace the `<img class="avatar">` with
`<span class="avatar" data-initials="XY" aria-hidden="true"></span>`.

To swap any photo, replace the file in `assets/img/` (keep it square) or point the `src` at a new
filename.

## Notes

- No JS libraries; fonts from Google Fonts (Newsreader / Inter / JetBrains Mono).
- Responsive; respects `prefers-reduced-motion`. Accent color = `--accent` (maroon) in style.css.
