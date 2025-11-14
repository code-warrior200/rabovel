# Assets Directory

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
   - Use `expo-asset` to generate assets
   - Use Expo's asset generator tools

## Temporary Workaround

For now, the app will work without these assets in development mode.
The app.json has been updated to not require these files during development.
