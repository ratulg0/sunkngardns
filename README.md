# SUNKNGARDNS — one-page band website

A mobile-first, vertically scrollable website with four sections: **Listen**, **About**, **Music**, and **Booking**. The page uses original artwork already in `assets/`; source art is never edited or deleted. The tree illustration is `assets/1000114676.jpeg`, the release covers are kept as supplied, and the logo PNG is also used for the favicon and Apple touch icon.

## Run in VS Code

Requirements: Node.js `20.19+` or `22.12+` and npm.

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal (normally `http://127.0.0.1:5173/`) and keep the terminal running.

To get the latest GitHub changes:

```bash
git pull --rebase origin main
```

Commit or stash local edits before pulling if your working tree is not clean.

## Original assets in the repository

- `1000114676.jpeg` — original ink-tree artwork
- `logo_sunkngardns.png` — band logo, favicon, and touch icon
- `coverart_rukhsar.png` and `coverart_sarhadein.jpg` — original release art
- `donkey_transparent.png` — booking illustration
- `art_spotify.jpg` and `djinn_animated.gif` — other supplied originals, preserved untouched

Lazy-loaded images now include explicit width and height attributes to prevent layout shifts.

## Production build

```bash
npm run build
npm run preview
```

Vite writes the production output to `dist/`.

## Before launch

- Replace platform search links with verified artist profiles and release URLs.
- Add the confirmed booking address to `BOOKING_EMAIL` in `script.js`; the current form opens a prefilled email draft and does not submit to a server.
- Replace the concept biography with the band's approved final copy when provided.

## Main files

- `index.html` — the four sections, release links and favicon
- `styles.css` — responsive composition and image layout
- `script.js` — drawer, active navigation and booking email draft
- `.vscode/` — browser launch/debug setup
- `assets/` — original artwork
