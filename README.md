# Transitioning from Pre-Training to Post-Training — Workshop Website

Static, multi-page site for the NeurIPS 2026 workshop (Sydney, Australia · December 11, 2026).
Plain HTML/CSS/JS, no build step required to host — ready for GitHub Pages.

## Pages

```
index.html          # Home — hero, overview, why-now, central questions
call.html           # Call for Papers — topics, submission details, important dates
schedule.html       # Tentative schedule
speakers.html       # Invited speakers (photos link to homepages)
organizers.html     # Organizers (photos link to homepages) + contact
assets/style.css    # styling (clean academic theme; colors are CSS variables up top)
assets/script.js    # mobile nav, active-link, auto-strike past dates
assets/img/         # speaker & organizer headshots (400×400)
build_site.js        # OPTIONAL generator — edit content in one place, regenerate all pages
```

## Editing content

Two ways:

1. **Directly** — edit the `.html` files. Note the top nav and footer are duplicated in each
   page; if you change them, change all five (or use option 2).
2. **Via the generator (recommended for structural edits)** — edit the data arrays at the top of
   `build_site.js` (speakers, organizers, topics, schedule, dates, nav) and run `node build_site.js`
   to regenerate all pages consistently. The generator is only an authoring tool; the hosted site
   is just the plain HTML files.

## Deploy on GitHub Pages

1. Put these files in a repo (`index.html` at the root).
2. Repo → **Settings → Pages** → Source: *Deploy from a branch* → `main` / `/ (root)`.
3. Live at `https://<user-or-org>.github.io/<repo>/`.
   For a clean root URL, name the repo `<name>.github.io`.

Local preview: `python3 -m http.server` in this folder → http://localhost:8000.

## Placeholders to fill (search for `TBD`)

- **OpenReview** submission link (call.html)
- **Important dates:** portal opens, submission deadline, notification, camera-ready (call.html).
  When you add a real date, also set `data-date="YYYY-MM-DD"` on that `<li>` (or edit the `DATES`
  array in `build_site.js`) — the script auto-dims + strikes it through once it passes.
- **Page limits** for short/long papers (call.html)
- **Venue page link** — the NeurIPS 2026 workshop page (index.html hero)

## Photos

All speaker/organizer headshots are their own homepage photos, normalized to 400×400.
**Eran Malach** currently shows an "EM" initials avatar — his homepage photo sits on Google Sites,
which blocks automated download. To add it: save his headshot as `assets/img/malach.jpg` and, in
`build_site.js`, set his `img: "malach.jpg"` (and rerun the generator), or directly edit the avatar
in `organizers.html`.

To swap any photo, replace the file in `assets/img/` (keep it square) or point the `img` field to a
new filename.

## Notes

- No JS libraries; fonts from Google Fonts (Newsreader / Inter / JetBrains Mono).
- Responsive; respects `prefers-reduced-motion`. Accent color = `--accent` (maroon) in style.css.
