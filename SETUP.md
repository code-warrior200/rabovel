# Setup Guide

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Expo CLI (if not already installed)

```bash
npm install -g expo-cli
```

### 3. Start Development Server

```bash
npm start
```

## Running on Different Platforms

### iOS (macOS only)

```bash
npm run ios
```

Requires:
- Xcode installed
- iOS Simulator
- CocoaPods (for native dependencies)

### Android

```bash
npm run android
```

Requires:
- Android Studio installed
- Android SDK configured
- Android Emulator or physical device

### Web

```bash
npm run web
```

### Physical Device

1. Install Expo Go app on your device
2. Run `npm start`
3. Scan QR code with Expo Go

## Environment Setup

Create a `.env` file in the root directory:

```env
# API Keys (add when implementing real APIs)
NSE_API_KEY=your_nse_api_key
MARKET_DATA_API_KEY=your_market_data_api_key

# Blockchain Configuration (add when implementing)
BLOCKCHAIN_NETWORK=ethereum
CONTRACT_ADDRESS=your_contract_address

# App Configuration
APP_ENV=development
```

## Assets Setup

Place the following assets in the `assets/` directory:

- `icon.png` - App icon (1024x1024)
- `splash.png` - Splash screen (1284x2778)
- `adaptive-icon.png` - Android adaptive icon (1024x1024)
- `favicon.png` - Web favicon (48x48)

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `expo start -c`
2. **iOS build issues**: Run `cd ios && pod install`
3. **Android build issues**: Clean gradle with `cd android && ./gradlew clean`
4. **TypeScript errors**: Run `npx tsc --noEmit` to check types

### Clearing Cache

```bash
# Clear Expo cache
expo start -c

# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules
npm install
```

## Development Tips

1. Use Expo Dev Tools for debugging
2. Enable Fast Refresh for hot reloading
3. Use React Native Debugger for advanced debugging
4. Test on both iOS and Android regularly
5. Use TypeScript for type safety

## Building for Production

### iOS

```bash
expo build:ios
```

### Android

```bash
expo build:android
```

Or use EAS Build:

```bash
eas build --platform ios
eas build --platform android
```
