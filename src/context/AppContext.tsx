import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Asset, StakingPool, Stake, Portfolio, OptionContract, MarketData, Notification } from '../types';

interface AppContextType {
  // Portfolio
  portfolio: Portfolio | null;
  updatePortfolio: (portfolio: Portfolio) => void;
  
  // Assets
  assets: Asset[];
  updateAssets: (assets: Asset[]) => void;
  
  // Staking
  stakingPools: StakingPool[];
  userStakes: Stake[];
  addStake: (stake: Stake) => void;
  updateStakingPools: (pools: StakingPool[]) => void;
  
  // Options
  options: OptionContract[];
  updateOptions: (options: OptionContract[]) => void;
  
  // Market Data
  marketData: MarketData[];
  updateMarketData: (data: MarketData[]) => void;
  
  // Wallet
  walletBalance: number;
  updateWalletBalance: (balance: number) => void;
  
  // Loading
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [stakingPools, setStakingPools] = useState<StakingPool[]>([]);
  const [userStakes, setUserStakes] = useState<Stake[]>([]);
  const [options, setOptions] = useState<OptionContract[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Initialize mock data
  useEffect(() => {
    // Mock initial data
    const mockAssets: Asset[] = [
      {
        id: '1',
        symbol: 'NGN',
        name: 'Nigerian Naira Token',
        price: 1.0,
        change24h: 0.02,
        changePercent24h: 2.0,
        volume: 1000000,
        marketCap: 50000000,
        type: 'token',
      },
      {
        id: '2',
        symbol: 'DANGOTE',
        name: 'Dangote Cement',
        price: 285.50,
        change24h: -5.20,
        changePercent24h: -1.79,
        volume: 500000,
        marketCap: 1200000000,
        type: 'stock',
      },
      {
        id: '3',
        symbol: 'GTB',
        name: 'Guaranty Trust Bank',
        price: 42.30,
        change24h: 1.15,
        changePercent24h: 2.79,
        volume: 800000,
        marketCap: 800000000,
        type: 'stock',
      },
    ];

    const mockPools: StakingPool[] = [
      {
        id: 'pool1',
        assetId: '1',
        asset: mockAssets[0],
        apy: 12.5,
        totalStaked: 1000000,
        minStake: 100,
        lockPeriod: 30,
        totalRewards: 10000,
        isActive: true,
      },
      {
        id: 'pool2',
        assetId: '2',
        asset: mockAssets[1],
        apy: 8.5,
        totalStaked: 500000,
        minStake: 1000,
        lockPeriod: 90,
        totalRewards: 5000,
        isActive: true,
      },
    ];

    const mockPortfolio: Portfolio = {
      totalValue: 150000,
      totalChange: 5000,
      totalChangePercent: 3.45,
      assets: [],
      stakedAssets: [],
    };

    // Mock options contracts
    const mockOptions: OptionContract[] = [
      {
        id: 'opt1',
        assetId: '1',
        asset: mockAssets[0],
        strikePrice: 1.05,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        type: 'call',
        premium: 0.05,
        openInterest: 1250,
        volume: 890,
      },
      {
        id: 'opt2',
        assetId: '1',
        asset: mockAssets[0],
        strikePrice: 0.95,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        type: 'put',
        premium: 0.03,
        openInterest: 980,
        volume: 650,
      },
      {
        id: 'opt3',
        assetId: '2',
        asset: mockAssets[1],
        strikePrice: 300.00,
        expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        type: 'call',
        premium: 12.50,
        openInterest: 450,
        volume: 320,
      },
      {
        id: 'opt4',
        assetId: '2',
        asset: mockAssets[1],
        strikePrice: 270.00,
        expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        type: 'put',
        premium: 8.75,
        openInterest: 380,
        volume: 240,
      },
      {
        id: 'opt5',
        assetId: '3',
        asset: mockAssets[2],
        strikePrice: 45.00,
        expiryDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        type: 'call',
        premium: 1.85,
        openInterest: 1200,
        volume: 980,
      },
      {
        id: 'opt6',
        assetId: '3',
        asset: mockAssets[2],
        strikePrice: 40.00,
        expiryDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        type: 'put',
        premium: 1.20,
        openInterest: 890,
        volume: 720,
      },
      {
        id: 'opt7',
        assetId: '2',
        asset: mockAssets[1],
        strikePrice: 290.00,
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        type: 'call',
        premium: 15.25,
        openInterest: 650,
        volume: 480,
      },
      {
        id: 'opt8',
        assetId: '3',
        asset: mockAssets[2],
        strikePrice: 44.00,
        expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        type: 'put',
        premium: 0.95,
        openInterest: 750,
        volume: 560,
      },
    ];

    setAssets(mockAssets);
    setStakingPools(mockPools);
    setPortfolio(mockPortfolio);
    setOptions(mockOptions);
    setWalletBalance(50000);

    // Initialize mock notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Staking Reward Available',
        message: 'Your staking reward of 1,250 NGN is ready to claim',
        type: 'staking',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
      },
      {
        id: '2',
        title: 'Price Alert: DANGOTE',
        message: 'DANGOTE has increased by 5.2% in the last 24 hours',
        type: 'market',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        read: false,
        relatedAssetId: '2',
      },
      {
        id: '3',
        title: 'Trade Executed',
        message: 'Your call option for NGN has been successfully executed',
        type: 'trading',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
      },
    ];
    setNotifications(mockNotifications);
  }, []);

  const updatePortfolio = (newPortfolio: Portfolio) => {
    setPortfolio(newPortfolio);
  };

  const updateAssets = (newAssets: Asset[]) => {
    setAssets(newAssets);
  };

  const updateStakingPools = (pools: StakingPool[]) => {
    setStakingPools(pools);
  };

  const addStake = (stake: Stake) => {
    setUserStakes((prev) => [...prev, stake]);
  };

  const updateOptions = (newOptions: OptionContract[]) => {
    setOptions(newOptions);
  };

  const updateMarketData = (data: MarketData[]) => {
    setMarketData(data);
  };

  const updateWalletBalance = (balance: number) => {
    setWalletBalance(balance);
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider
      value={{
        portfolio,
        updatePortfolio,
        assets,
        updateAssets,
        stakingPools,
        userStakes,
        addStake,
        updateStakingPools,
        options,
        updateOptions,
        marketData,
        updateMarketData,
        walletBalance,
        updateWalletBalance,
        isLoading,
        setLoading,
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
