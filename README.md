# Pitch of Glory

A static-web version of the original single-file game, split into separate assets and prepared for GitHub + Vercel deployment.

## Project files

- `index.html` — document metadata and app entry point.
- `style.css` — all CSS extracted from the original HTML.
- `script.js` — original game data, logic, UI rendering, and event handling.
- `manifest.webmanifest` — installable PWA metadata.
- `sw.js` — service worker for caching the app shell for offline launches.
- `pwa.js` — registers the service worker separately from game logic.
- `icon.svg`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` — app icons for modern PWA installation and Apple touch icons.

The game's JavaScript is kept together intentionally to avoid changing behavior during the initial split. It can be further divided into ES modules later, once the baseline works.

## Run locally

Because service workers require HTTPS or localhost, use a local web server rather than opening `index.html` directly.

For example, with Python installed:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploy to GitHub and Vercel

1. Create a GitHub repository and upload the contents of this folder to the repository root.
2. In Vercel, choose **Add New → Project**, import the repository, and deploy it as a static site.
3. No build command or framework preset is required. Keep the output directory as the project root (or leave the default for a plain static site).
4. After the first deployment, open the HTTPS URL on a supported browser. The service worker will be registered and the app shell will be cached for offline use after the first successful load.

## Notes

- Progress/save data remains managed by the original game code in the browser; this static conversion does not add server-side accounts or cloud saves.
- Google Fonts are external, so those fonts may not load while offline. The app uses local system font fallbacks.
- After changing the offline-cached assets, bump `CACHE_NAME` in `sw.js` (for example, from `pitch-of-glory-v1` to `pitch-of-glory-v2`) to force clients onto the new cache version.
- PNG icons are included for PWA installation and Apple touch icons, alongside the scalable SVG icon.
