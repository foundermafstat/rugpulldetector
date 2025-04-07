import { useState, useEffect } from 'react';

export interface WalletAsset {
  name: string;
  symbol: string;
  balance: string;
  formattedBalance: string;
  value: number; // Value in USD (if available)
  decimals: number;
}

export function useWalletAssets() {
  const [assets, setAssets] = useState<WalletAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock function to get assets for UI display
  const getAssets = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data
      setAssets([
        {
          name: 'Ethereum',
          symbol: 'ETH',
          balance: '500000000000000000',
          formattedBalance: '0.5 ETH',
          value: 1250.75,
          decimals: 18
        },
        {
          name: 'Test Token',
          symbol: 'TST',
          balance: '1000000000000000000000',
          formattedBalance: '1000 TST',
          value: 500,
          decimals: 18
        }
      ]);
    } catch (err) {
      console.error('Error fetching wallet assets:', err);
      setError('Failed to load wallet assets');
    } finally {
      setIsLoading(false);
    }
  };

  // Load assets on initial render
  useEffect(() => {
    getAssets();
  }, []);

  return {
    assets,
    isLoading,
    error,
    getAssets
  };
}