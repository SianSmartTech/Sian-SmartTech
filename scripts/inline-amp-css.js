const fs = require('fs');
const path = require('path');
const cssPath = path.join(__dirname, '../src/css/amp.css');
const ampTemplatePath = path.join(__dirname, '../public/amp.html');
const ampOutputPath = path.join(__dirname, '../build/amp.html');
if (!fs.existsSync(cssPath)) {
  console.error(`Error: CSS file not found at ${cssPath}`);
  process.exit(1);
}
let cssContent = fs.readFileSync(cssPath, 'utf8').trim();
cssContent = cssContent.replace(/\/\*[\s\S]*?\*\//g, '');
cssContent = cssContent
  .replace(/\s+/g, ' ')
  .replace(/\s*([{};:])\s*/g, '$1')
  .trim();
if (cssContent.includes('!important')) {
  console.error('Error: "!important" is prohibited in AMP CSS rules. Found in fallback.css!');
  process.exit(1);
}
if (!fs.existsSync(ampTemplatePath)) {
  console.error(`Error: AMP HTML template file not found at ${ampTemplatePath}`);
  process.exit(1);
}
let ampContent = fs.readFileSync(ampTemplatePath, 'utf8');
const styleAmpCustomRegex = /(<style\s+amp-custom>)([\s\S]*?)(<\/style>)/i;
if (!styleAmpCustomRegex.test(ampContent)) {
  console.error('Error: Could not find <style amp-custom> tag in amp.html template');
  process.exit(1);
}
ampContent = ampContent.replace(styleAmpCustomRegex, `$1${cssContent}$3`);
const buildDir = path.dirname(ampOutputPath);
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}
fs.writeFileSync(ampOutputPath, ampContent, 'utf8');
process.exit(0);