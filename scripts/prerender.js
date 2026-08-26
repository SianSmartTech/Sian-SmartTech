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
const routesMetadata = {
  '/': {
    title: 'SiAn SmartTech | Premium Computer & Mobile Repair Services',
    description: 'Expert computer, laptop & mobile repair in Madurai. SiAn SmartTech offers certified hardware diagnostics, chip-level repairs & genuine replacement parts.',
    canonical: 'https://siansmarttech.in/'
  },
  '/hardware-services': {
    title: 'Computer & Mobile Hardware Repairs | SiAn SmartTech',
    description: 'Professional hardware repair services in Madurai. Expert chip-level repair, screen replacements, motherboard fixes & laptop servicing.',
    canonical: 'https://siansmarttech.in/hardware-services'
  },
  '/it-services': {
    title: 'IT Software & Web Development Services | SiAn SmartTech',
    description: 'Comprehensive IT software solutions, web development, custom software, and digital services in Madurai by SiAn SmartTech specialists.',
    canonical: 'https://siansmarttech.in/it-services'
  },
  '/price-list': {
    title: 'Computer & Mobile Repair Price List | SiAn SmartTech',
    description: 'Transparent pricing for computer, laptop, and mobile repair in Madurai. Check diagnostic rates and service costs at SiAn SmartTech.',
    canonical: 'https://siansmarttech.in/price-list'
  },
  '/about': {
    title: 'About Us - Tech Repair Experts in Madurai | SiAn SmartTech',
    description: "Learn about SiAn SmartTech, Madurai's trusted computer and mobile repair center providing reliable hardware and IT tech support.",
    canonical: 'https://siansmarttech.in/about'
  },
  '/book-service': {
    title: 'Book Computer & Mobile Repair Online | SiAn SmartTech',
    description: 'Book computer, laptop, or mobile repair service online with SiAn SmartTech Madurai. Fast diagnostics, doorstep pickup & quick turnaround.',
    canonical: 'https://siansmarttech.in/book-service'
  },
  '/faq': {
    title: 'Tech Repair FAQs & Troubleshooting Tips | SiAn SmartTech',
    description: 'Find answers to frequently asked questions regarding computer and mobile repair services, pricing, warranty, and IT support in Madurai.',
    canonical: 'https://siansmarttech.in/faq'
  },
  '/all-faqs': {
    title: 'Complete Tech Repair Guide & FAQs | SiAn SmartTech',
    description: 'Comprehensive tech repair guide and FAQs for computer, laptop, and mobile servicing, hardware upgrades, and solutions in Madurai.',
    canonical: 'https://siansmarttech.in/all-faqs'
  },
  '/track': {
    title: 'Track Your Tech Repair Ticket Online | SiAn SmartTech',
    description: 'Track the real-time status of your computer, laptop, or mobile repair ticket online with SiAn SmartTech Madurai quick tracking system.',
    canonical: 'https://siansmarttech.in/track'
  },
  '/admin': {
    title: 'Admin Dashboard | SiAn SmartTech',
    description: 'SiAn SmartTech Admin Dashboard for managing computer repair orders, service tickets, customer inquiries, and system operations in Madurai.',
    canonical: 'https://siansmarttech.in/admin'
  }
};
const routes = Object.keys(routesMetadata);
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
    const meta = routesMetadata[route];
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
    const doc = window.document;
    if (meta) {
      doc.title = meta.title;
      const setMeta = (attr, key, val) => {
        let el = doc.querySelector(`meta[${attr}="${key}"]`);
        if (!el) {
          el = doc.createElement('meta');
          el.setAttribute(attr, key);
          doc.head.appendChild(el);
        }
        el.setAttribute('content', val);
      };
      setMeta('name', 'title', meta.title);
      setMeta('name', 'description', meta.description);
      setMeta('property', 'og:title', meta.title);
      setMeta('property', 'og:description', meta.description);
      setMeta('property', 'og:url', meta.canonical);
      setMeta('property', 'twitter:title', meta.title);
      setMeta('property', 'twitter:description', meta.description);
      setMeta('property', 'twitter:url', meta.canonical);
      let canonical = doc.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = doc.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        doc.head.appendChild(canonical);
      }
      canonical.setAttribute('href', meta.canonical);
    }
    const html = dom.serialize();
    let outputDir = BUILD_DIR;
    let outputFile = 'index.html';
    if (route !== '/') {
      outputDir = path.join(BUILD_DIR, route.replace(/^\//, ''));
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      const flatHtmlPath = path.join(BUILD_DIR, `${route.replace(/^\//, '')}.html`);
      fs.writeFileSync(flatHtmlPath, html, 'utf8');
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