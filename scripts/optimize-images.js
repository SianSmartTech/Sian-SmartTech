const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const IMAGES_DIR = path.join(__dirname, '../public/images');
const SIZES = [
  { suffix: '-mobile', width: 480, quality: 72 },
  { suffix: '-tablet', width: 768, quality: 78 },
];
async function optimizeImages(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await optimizeImages(fullPath);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (!['.webp', '.jpg', '.jpeg', '.png'].includes(ext)) continue;
    if (entry.name.includes('-mobile') || entry.name.includes('-tablet')) continue;
    const baseName = path.basename(entry.name, ext);
    const inputPath = fullPath;
    for (const { suffix, width, quality } of SIZES) {
      const outPath = path.join(dir, `${baseName}${suffix}.webp`);
      await sharp(inputPath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality, effort: 5 })
        .toFile(outPath);
      const outSizeKB = (fs.statSync(outPath).size / 1024).toFixed(1);
    }
  }
}
(async () => {
  try {
    await optimizeImages(IMAGES_DIR);
  } catch (err) {
    console.error('❌ Error during optimization:', err.message);
    process.exit(1);
  }
})
  ();