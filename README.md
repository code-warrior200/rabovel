# Rabovel Staking Platform

A cross-platform mobile application built with React Native & Expo for tokenized and asset-based staking, options trading, and African stock market integration, with a focus on the Nigerian market.

## Features

- 🎯 **Tokenized Asset Staking** - Stake tokens and assets to earn rewards with competitive APY rates
- 📊 **Options Trading OS** - Trade call and put options on tokens and stocks
- 📈 **Nigerian/African Stock Market** - Integration with Nigerian Stock Exchange (NSE) and African markets
- 💼 **Portfolio Management** - Track your investments, stakes, and trading positions
- 🔐 **Wallet Management** - Secure wallet for managing your assets
- 📱 **Modern UI/UX** - Professional design with smooth animations and intuitive interface
- 🚀 **Real-time Market Data** - Live market prices and updates
- 💰 **Rewards System** - Automated reward distribution for staking

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for iOS development on macOS) or Android Emulator
- Expo Go app on your mobile device (for testing)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd rabovel-staking-platform

# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS Simulator
npm run ios

# Run on Android Emulator
npm run android

# Run on web
npm run web
```

### Running on Physical Device

1. Install Expo Go from App Store (iOS) or Play Store (Android)
2. Start the development server with `npm start`
3. Scan the QR code with Expo Go app

## Project Structure

```
rabovel-staking-platform/
├── assets/              # App icons, splash screens, images
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── AssetCard.tsx
│   │   └── StakingPoolCard.tsx
│   ├── screens/         # Screen components
│   │   ├── DashboardScreen.tsx
│   │   ├── StakingScreen.tsx
│   │   ├── TradingScreen.tsx
│   │   ├── PortfolioScreen.tsx
│   │   ├── MarketScreen.tsx
│   │   ├── StakeDetailScreen.tsx
│   │   └── TradingDetailScreen.tsx
│   ├── navigation/      # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   └── TabNavigator.tsx
│   ├── theme/           # Design system & themes
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   ├── services/        # API & business logic
│   │   ├── marketService.ts
│   │   ├── stakingService.ts
│   │   └── tradingService.ts
│   ├── context/         # State management
│   │   └── AppContext.tsx
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   └── utils/           # Helper functions
│       └── formatters.ts
├── App.tsx              # Main app component
├── index.js             # Entry point
├── package.json         # Dependencies
├── app.json             # Expo configuration
└── tsconfig.json        # TypeScript configuration
```

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and tooling
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation library
- **React Native Reanimated** - Smooth animations
- **React Native Gesture Handler** - Gesture handling
- **Expo Linear Gradient** - Gradient components
- **Expo Vector Icons** - Icon library

## Key Features Implementation

### Staking Platform
- Multiple staking pools with different APY rates
- Lock period options (30, 60, 90 days)
- Automated reward calculation
- Staking history and tracking

### Options Trading
- Call and Put options
- Strike price selection
- Premium calculation
- Expiry date management
- Options contract management

### Market Integration
- Nigerian Stock Exchange (NSE) integration (placeholder)
- African stock market data (placeholder)
- Real-time price updates (placeholder)
- Market filters and search

### Portfolio Management
- Total portfolio value tracking
- Asset breakdown
- Staking rewards summary
- Trading positions
- Profit/loss tracking

## Design System

The app uses a professional design system with:
- **Dark Theme** - Modern dark UI with blue and gold accents
- **Typography** - Clear hierarchy with multiple font sizes
- **Spacing** - Consistent spacing system
- **Colors** - Primary (blue), Secondary (gold), Status colors
- **Components** - Reusable, consistent UI components

## Future Enhancements

- [ ] Blockchain integration for staking
- [ ] Real-time market data integration
- [ ] Nigerian Stock Exchange API integration
- [ ] Wallet connectivity (MetaMask, WalletConnect)
- [ ] Push notifications for market updates
- [ ] Advanced charting and analytics
- [ ] Social trading features
- [ ] Multi-language support
- [ ] Biometric authentication
- [ ] Advanced security features

## API Integration

The app includes placeholder services for:
- **Market Service** - Nigerian/African stock market data
- **Staking Service** - Staking pool management
- **Trading Service** - Options trading execution

These services are ready for integration with:
- Nigerian Stock Exchange (NSE) API
- Blockchain networks (Ethereum, Polygon, etc.)
- Options trading platforms
- Market data providers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@rabovel.com or create an issue in the repository.

## Acknowledgments

- Nigerian Stock Exchange (NSE)
- African financial markets
- React Native community
- Expo team
