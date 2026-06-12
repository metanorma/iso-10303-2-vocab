#!/usr/bin/env node
/**
 * Generate favicons from the site logo for the Vite build.
 * Reads site-config.yml, generates favicon files into public/, and
 * writes FAVICON_HTML env var to GITHUB_ENV for CI persistence.
 */
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const ROOT = process.cwd();
const configPath = path.join(ROOT, 'site-config.yml');
const publicDir = path.join(ROOT, 'public');

if (!fs.existsSync(configPath)) {
  console.log('No site-config.yml found, skipping favicon generation');
  process.exit(0);
}

const config = yaml.load(fs.readFileSync(configPath, 'utf-8'));
const branding = config?.branding || {};

fs.mkdirSync(publicDir, { recursive: true });

const faviconSrc =
  (branding.favicon && path.resolve(ROOT, branding.favicon)) ||
  (branding.logo?.localPath && path.resolve(ROOT, branding.logo.localPath));

let faviconHtml = '';
if (faviconSrc && fs.existsSync(faviconSrc)) {
  console.log(`Generating favicons from ${faviconSrc}...`);
  try {
    const favicons = (await import('favicons')).default;
    const source = fs.readFileSync(faviconSrc);
    const response = await favicons(source, {
      appName: config?.title || 'Glossarist',
      background: branding.primaryColor || '#2563eb',
      theme_color: branding.primaryColor || '#2563eb',
      icons: {
        android: false,
        appleIcon: true,
        appleStartup: false,
        favicons: true,
        windows: false,
        yandex: false,
      },
    });

    for (const img of response.images) {
      fs.writeFileSync(path.join(publicDir, img.name), img.contents);
    }
    for (const file of response.files) {
      fs.writeFileSync(path.join(publicDir, file.name), file.contents);
    }

    if (faviconSrc.endsWith('.svg')) {
      fs.copyFileSync(faviconSrc, path.join(publicDir, 'favicon.svg'));
    }

    faviconHtml = response.html.join('\n    ');
    if (faviconSrc.endsWith('.svg')) {
      faviconHtml += '\n    <link rel="icon" type="image/svg+xml" href="/favicon.svg">';
    }
    console.log(`  Generated ${response.images.length} favicon files`);
  } catch (e) {
    console.warn(`  Favicon generation failed: ${e.message}`);
  }
} else {
  console.log('No logo source found, skipping favicon generation');
}

if (faviconHtml) {
  const basePath = (process.env.BASE_PATH || '').replace(/\/+$/, '');
  if (basePath) {
    faviconHtml = faviconHtml.replace(/(href|content)="\/([^"]+)"/g, `$1="${basePath}/$2"`);
  }

  // Set for current process
  process.env.FAVICON_HTML = faviconHtml;

  // Persist for CI (GITHUB_ENV)
  const githubEnv = process.env.GITHUB_ENV;
  if (githubEnv) {
    const delimiter = 'FAVICON_HTML_DELIMITER';
    fs.appendFileSync(githubEnv, `FAVICON_HTML<<${delimiter}\n${faviconHtml}\n${delimiter}\n`);
    console.log('  Written FAVICON_HTML to GITHUB_ENV');
  }

  fs.writeFileSync(path.join(publicDir, 'favicon-links.html'), faviconHtml);
}
