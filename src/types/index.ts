export interface Asset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume: number;
  marketCap: number;
  type: 'token' | 'stock' | 'option';
  image?: string;
}

export interface StakingPool {
  id: string;
  assetId: string;
  asset: Asset;
  apy: number;
  totalStaked: number;
  minStake: number;
  lockPeriod: number; // in days
  totalRewards: number;
  isActive: boolean;
}

export interface Stake {
  id: string;
  poolId: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  reward: number;
  status: 'active' | 'completed' | 'unlocked';
}

export interface OptionContract {
  id: string;
  assetId: string;
  asset: Asset;
  strikePrice: number;
  expiryDate: Date;
  type: 'call' | 'put';
  premium: number;
  openInterest: number;
  volume: number;
}

export interface Portfolio {
  totalValue: number;
  totalChange: number;
  totalChangePercent: number;
  assets: PortfolioAsset[];
  stakedAssets: Stake[];
}

export interface PortfolioAsset {
  assetId: string;
  asset: Asset;
  quantity: number;
  averagePrice: number;
  currentValue: number;
  profit: number;
  profitPercent: number;
}

export interface MarketData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  market: 'nigerian' | 'african' | 'global';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'staking' | 'trading' | 'market';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  relatedAssetId?: string;
}