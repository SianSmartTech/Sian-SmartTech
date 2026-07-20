const http = require('http');
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');
const PORT = 3000;
const BUILD_DIR = path.join(__dirname, '..', 'build');
const TEMP_INDEX_PATH = path.join(BUILD_DIR, 'index.temp.html');
const ORIGINAL_INDEX_PATH = path.join(BUILD_DIR, 'index.html');
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
};
const routes = [
  '/',
  '/hardware-services',
  '/it-services',
  '/price-list',
  '/faq',
  '/about',
  '/all-faqs',
  '/book-service',
  '/track'
];
let server;
function startServer() {
  server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url).split('?')[0];
    let filePath = path.join(BUILD_DIR, urlPath);
    const ext = path.extname(filePath);
    if (!ext) {
      filePath = TEMP_INDEX_PATH;
    }
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        filePath = TEMP_INDEX_PATH;
      }
      const fileExt = path.extname(filePath);
      const contentType = MIME_TYPES[fileExt] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    });
  });
  return new Promise((resolve) => {
    server.listen(PORT, () => {
      resolve();
    });
  });
}
async function runPrerender() {
  if (!fs.existsSync(BUILD_DIR)) {
    throw new Error('Build directory does not exist. Run "npm run build" first.');
  }
  if (fs.existsSync(ORIGINAL_INDEX_PATH)) {
    fs.renameSync(ORIGINAL_INDEX_PATH, TEMP_INDEX_PATH);
  } else {
    throw new Error('index.html not found in build directory.');
  }
  await startServer();
  for (const route of routes) {
    const url = `http://localhost:${PORT}${route}`;
    const virtualConsole = new VirtualConsole();
    virtualConsole.sendTo(console, { omitJSDOMErrors: true });
    const dom = await JSDOM.fromURL(url, {
      resources: "usable",
      runScripts: "dangerously",
      pretendToBeVisual: true,
      virtualConsole
    });
    const window = dom.window;
    window.IntersectionObserver = class IntersectionObserver {
      constructor() { }
      observe() { }
      unobserve() { }
      disconnect() { }
    };
    window.matchMedia = window.matchMedia || function () {
      return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
      };
    };
    window.Element.prototype.scrollTo = function () { };
    window.scrollTo = function () { };
    await new Promise((resolve) => {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const document = window.document;
        const root = document.getElementById('root');
        const loader = document.querySelector('.page-loading-fallback');
        if ((root && root.children.length > 0 && !loader) || (Date.now() - startTime > 10000)) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
    await new Promise(resolve => setTimeout(resolve, 600));
    const html = dom.serialize();
    let outputDir = BUILD_DIR;
    let outputFile = 'index.html';
    if (route !== '/') {
      outputDir = path.join(BUILD_DIR, route.replace(/^\//, ''));
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
    }
    const outputPath = path.join(outputDir, outputFile);
    fs.writeFileSync(outputPath, html, 'utf8');
    window.close();
  }
}
async function main() {
  try {
    await runPrerender();
    console.log('[Prerender] All routes successfully pre-rendered!');
  } catch (error) {
    console.error('[Prerender] Error during pre-rendering:', error);
    process.exitCode = 1;
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    if (fs.existsSync(TEMP_INDEX_PATH)) {
      if (!fs.existsSync(ORIGINAL_INDEX_PATH)) {
        fs.renameSync(TEMP_INDEX_PATH, ORIGINAL_INDEX_PATH);
      } else {
        fs.unlinkSync(TEMP_INDEX_PATH);
      }
    }
  }
}
main();