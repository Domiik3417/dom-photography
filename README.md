# Dom Photography

A lightweight, dependency-free photography portfolio for GitHub Pages.

## Add photographs

1. Put original `.jpg`, `.jpeg`, `.png`, or `.webp` files in `photos/`.
2. Keep `portrait.png` and `square.png` reserved for the About section; they are excluded from the main gallery automatically.
3. Run `npm run build` locally, or push to the configured deployment branch. The GitHub Actions workflow scans `photos/` and regenerates `public/gallery.json` automatically.
4. Commit and push the new photos and the generated manifest if working locally; the workflow also regenerates it during deployment.

Filenames with spaces and common special characters are supported. The site uses relative paths so it works on repository-based GitHub Pages URLs.

## Local preview

Run `npm run build`, then serve this folder with any static file server. Opening `index.html` directly will show the layout, but browsers may block the gallery manifest when using `file://`.

## Deployment

Enable GitHub Pages for **GitHub Actions** in the repository settings. The included workflow builds the manifest and publishes the static site. It receives the actual Pages base URL from GitHub and injects it into `robots.txt` and `sitemap.xml` during deployment.
