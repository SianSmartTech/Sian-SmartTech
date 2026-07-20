const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 9000;
const BUILD_DIR = path.join(__dirname, '../build');
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
const server = http.createServer((req, res) => {
  const decodedUrl = decodeURIComponent(req.url.split('?')[0]);
  let filePath = path.join(BUILD_DIR, decodedUrl);
  if (!path.extname(filePath)) {
    filePath = path.join(BUILD_DIR, 'index.html');
  }
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    } else {
      let contentType = 'text/html';
      const ext = path.extname(filePath).toLowerCase();
      if (ext === '.css') contentType = 'text/css';
      else if (ext === '.js') contentType = 'text/javascript';
      else if (ext === '.json') contentType = 'application/json';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.svg') contentType = 'image/svg+xml';
      else if (ext === '.ico') contentType = 'image/x-icon';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});
server.listen(PORT, async () => {
  console.log(`Prerender server running at http://localhost:${PORT}`);
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    for (const route of routes) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });
      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });
      try {
        await page.waitForSelector('.route-loading-fallback', { hidden: true, timeout: 5000 });
      } catch (e) {
      }
      await new Promise(r => setTimeout(r, 1000));
      const html = await page.content();
      const routeDir = path.join(BUILD_DIR, route);
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      fs.writeFileSync(path.join(routeDir, 'index.html'), html);
      await page.close();
    }
    await browser.close();
  } catch (err) {
    console.error('Error during pre-rendering:', err);
  } finally {
    server.close(() => {
      process.exit(0);
    });
  }
});