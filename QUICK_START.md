# Quick Start Guide

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on your preferred platform:**
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## First Time Setup

1. **Install Expo CLI (if not installed):**
   ```bash
   npm install -g expo-cli
   ```

2. **Install Expo Go on your device:**
   - iOS: Download from App Store
   - Android: Download from Play Store

3. **Start the app:**
   ```bash
   npm start
   ```

4. **Scan QR code** with Expo Go app

## Running the App

### Development Mode

```bash
# Start Expo development server
npm start

# Run on iOS Simulator (macOS only)
npm run ios

# Run on Android Emulator
npm run android

# Run on web browser
npm run web
```

### Physical Device

1. Ensure your device and computer are on the same network
2. Run `npm start`
3. Scan the QR code with Expo Go app
4. The app will load on your device

## Project Structure Overview

- **src/components/** - Reusable UI components
- **src/screens/** - Screen components
- **src/navigation/** - Navigation configuration
- **src/theme/** - Design system
- **src/services/** - API and business logic
- **src/context/** - State management
- **src/types/** - TypeScript type definitions
- **src/utils/** - Helper functions

## Key Features

### Dashboard
- Portfolio overview
- Quick actions
- Active stakes
- Top assets

### Market
- Nigerian/African stock market
- Asset filtering
- Market overview
- Real-time prices

### Staking
- Staking pools
- Stake management
- Reward tracking
- Pool details

### Trading
- Options trading
- Spot trading
- Trading positions
- Contract details

### Portfolio
- Portfolio value
- Asset breakdown
- Staking rewards
- Active stakes

## Troubleshooting

### Metro Bundler Issues
```bash
expo start -c
```

### Clear Cache
```bash
# Clear Expo cache
expo start -c

# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules
npm install
```

### iOS Build Issues
```bash
cd ios && pod install
```

### Android Build Issues
```bash
cd android && ./gradlew clean
```

## Next Steps

1. Add your app icons and splash screens to `assets/` directory
2. Configure environment variables (create `.env` file)
3. Integrate with APIs (Nigerian Stock Exchange, etc.)
4. Connect to blockchain networks
5. Implement wallet connectivity
6. Add authentication
7. Deploy to app stores

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation Documentation](https://reactnavigation.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## Support

For issues or questions, please create an issue in the repository or contact the development team.
