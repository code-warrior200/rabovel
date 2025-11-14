/**
 * Script to create placeholder assets for the Expo app
 * Run this with: node create-assets.js
 * 
 * Note: This script creates basic placeholder files.
 * For production, replace these with actual app icons and splash screens.
 */

const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');

// Create assets directory if it doesn't exist
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Create a simple SVG icon (1024x1024)
const iconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" rx="200" fill="#1E7CC7"/>
  <text x="512" y="600" font-family="Arial" font-size="400" font-weight="bold" fill="white" text-anchor="middle">R</text>
</svg>`;

// Create a simple SVG splash (1284x2778)
const splashSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1284" height="2778" viewBox="0 0 1284 2778" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1284" height="2778" fill="#0A0E27"/>
  <text x="642" y="1389" font-family="Arial" font-size="120" font-weight="bold" fill="#1E7CC7" text-anchor="middle">Rabovel</text>
  <text x="642" y="1509" font-family="Arial" font-size="60" fill="#FFFFFF" text-anchor="middle">Staking Platform</text>
</svg>`;

// Create a simple SVG adaptive icon (1024x1024)
const adaptiveIconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" rx="200" fill="#1E7CC7"/>
  <text x="512" y="600" font-family="Arial" font-size="400" font-weight="bold" fill="white" text-anchor="middle">R</text>
</svg>`;

// Create a simple SVG favicon (48x48)
const faviconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" rx="8" fill="#1E7CC7"/>
  <text x="24" y="32" font-family="Arial" font-size="24" font-weight="bold" fill="white" text-anchor="middle">R</text>
</svg>`;

console.log('Creating placeholder assets...');

// Write SVG files (Note: Expo typically expects PNG, but SVG can work for web)
// For a complete solution, you would need to convert these to PNG
// For now, we'll create a README with instructions

const readmeContent = `# Assets Directory

## Important Note

Expo requires PNG image files for icons and splash screens, not SVG files.
This directory should contain the following PNG files:

1. **icon.png** (1024x1024) - App icon
2. **splash.png** (1284x2778) - Splash screen  
3. **adaptive-icon.png** (1024x1024) - Android adaptive icon
4. **favicon.png** (48x48) - Web favicon

## Quick Solution

For development and testing, the app.json has been configured to work without these assets.
However, for production builds, you'll need to add proper PNG assets.

## Creating Assets

You can create these assets using:

1. **Online Tools:**
   - https://www.favicon-generator.org/
   - https://www.appicon.co/
   - https://makeappicon.com/

2. **Design Tools:**
   - Figma
   - Photoshop
   - Illustrator
   - Canva

3. **Expo Tools:**
   - Use \`expo-asset\` to generate assets
   - Use Expo's asset generator tools

## Temporary Workaround

For now, the app will work without these assets in development mode.
The app.json has been updated to not require these files during development.
`;

fs.writeFileSync(path.join(assetsDir, 'README.md'), readmeContent);

console.log('✓ Assets directory setup complete');
console.log('⚠ Note: For production, you\'ll need to add actual PNG assets');
console.log('  See assets/README.md for more information');
