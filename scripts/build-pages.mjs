import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const playgroundDir = path.join(rootDir, 'examples/playground');
const widgetDistDir = path.join(rootDir, 'packages/widget/dist');
const distPagesDir = path.join(rootDir, 'dist-pages');

console.log('--- Building ChaiKit GitHub Pages Artifact ---');

// 1. Verify widget IIFE bundle exists
const widgetIife = path.join(widgetDistDir, 'chaikit.iife.js');
if (!fs.existsSync(widgetIife)) {
  console.error('Error: packages/widget/dist/chaikit.iife.js not found. Please run npm run build first.');
  process.exit(1);
}

// 2. Prepare dist-pages directory
if (fs.existsSync(distPagesDir)) {
  fs.rmSync(distPagesDir, { recursive: true, force: true });
}
fs.mkdirSync(distPagesDir, { recursive: true });

// 3. Copy widget IIFE bundle to examples/playground for local dev
fs.copyFileSync(widgetIife, path.join(playgroundDir, 'chaikit.iife.js'));
console.log('✓ Copied chaikit.iife.js to examples/playground/chaikit.iife.js');

// 4. Copy files to dist-pages
fs.copyFileSync(path.join(playgroundDir, 'index.html'), path.join(distPagesDir, 'index.html'));
fs.copyFileSync(path.join(playgroundDir, 'style.css'), path.join(distPagesDir, 'style.css'));
fs.copyFileSync(path.join(playgroundDir, 'app.js'), path.join(distPagesDir, 'app.js'));
fs.copyFileSync(widgetIife, path.join(distPagesDir, 'chaikit.iife.js'));
console.log('✓ Copied HTML, CSS, app.js, and chaikit.iife.js to dist-pages/');

// 5. Copy screenshots if they exist
const screenshotsSrc = path.join(playgroundDir, 'screenshots');
const screenshotsDest = path.join(distPagesDir, 'screenshots');
if (fs.existsSync(screenshotsSrc)) {
  fs.cpSync(screenshotsSrc, screenshotsDest, { recursive: true });
  console.log('✓ Copied showcase screenshots to dist-pages/screenshots/');
}

// 6. Create .nojekyll so GitHub Pages doesn't ignore underscored files or run Jekyll
fs.writeFileSync(path.join(distPagesDir, '.nojekyll'), '');
console.log('✓ Created .nojekyll in dist-pages/');

console.log('ChaiKit GitHub Pages artifact successfully prepared in dist-pages/');
