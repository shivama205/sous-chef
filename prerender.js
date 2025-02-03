import Prerenderer from '@prerenderer/prerenderer';
import PuppeteerRenderer from '@prerenderer/renderer-puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const routes = [
  '/',
  '/meal-plan',
  '/meal-suggestions',
  '/recipe-finder',
  '/healthy-alternative',
  '/blog',
  '/about',
  '/privacy',
  '/terms',
  '/pricing'
];

const prerenderer = new Prerenderer({
  staticDir: path.join(__dirname, 'dist'),
  renderer: new PuppeteerRenderer({
    renderAfterTime: 5000,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage'
    ]
  })
});

async function prerender() {
  try {
    await prerenderer.initialize();
    const renderedRoutes = await prerenderer.renderRoutes(routes);

    // Write prerendered pages to disk
    renderedRoutes.forEach(route => {
      const filePath = path.join(__dirname, 'dist', route.route === '/' ? 'index.html' : `${route.route}/index.html`);
      const dir = path.dirname(filePath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(filePath, route.html);
    });

    await prerenderer.destroy();
    console.log('Prerendering complete!');
  } catch (err) {
    console.error('Error during prerendering:', err);
    process.exit(1);
  }
}

prerender(); 