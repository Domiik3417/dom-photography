import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { extname, join, basename } from 'node:path';

const root = process.cwd();
const photosDir = join(root, 'photos');
const publicDir = join(root, 'public');
const allowed = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const excluded = new Set(['portrait.png', 'square.png']);

await mkdir(publicDir, { recursive: true });
let files = [];
try {
  files = await readdir(photosDir, { withFileTypes: true });
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const images = files
  .filter((entry) => entry.isFile() && allowed.has(extname(entry.name).toLowerCase()))
  .filter((entry) => !excluded.has(entry.name.toLowerCase()))
  .map((entry) => {
    const filename = entry.name;
    return {
      src: `photos/${encodeURIComponent(filename).replaceAll('%2F', '/')}`,
      filename,
      title: basename(filename, extname(filename)).replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim(),
      alt: `Photography by Dom Photography — ${basename(filename, extname(filename)).replace(/[-_]+/g, ' ').trim()}`
    };
  })
  .sort((a, b) => a.filename.localeCompare(b.filename, undefined, { numeric: true, sensitivity: 'base' }));

await writeFile(join(publicDir, 'gallery.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), images }, null, 2)}\n`);
console.log(`Generated public/gallery.json with ${images.length} gallery image${images.length === 1 ? '' : 's'}.`);
