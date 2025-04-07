import { useState, useEffect } from 'react';
import { useAccount, useBalance, useChainId } from 'wagmi';
import { formatEther } from 'viem';
import { holesky, sepolia } from '@/components/wallet/web3-provider';

export interface WalletAsset {
  name: string;
  symbol: string;
  balance: string;
  formattedBalance: string;
  value: number; // Value in USD (if available)
  decimals: number;
}

export function useWalletAssets() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: ethBalance, isPending: isLoadingEth } = useBalance({
    address,
  });

  const [assets, setAssets] = useState<WalletAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get network name from chainId
  const getNetworkName = (id: number): string => {
    if (id === holesky.id) return 'Holesky Testnet';
    if (id === sepolia.id) return 'Sepolia Testnet';
    
    return 'Unknown Network';
  };

  useEffect(() => {
    if (!isConnected || !address) {
      setAssets([]);
      setIsLoading(false);
      return;
    }

    const fetchAssets = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Start with ETH balance from useBalance hook
        const assetsList: WalletAsset[] = [];
        
        if (ethBalance) {
          assetsList.push({
            name: 'Ethereum',
            symbol: ethBalance.symbol,
            balance: ethBalance.value.toString(),
            formattedBalance: ethBalance.formatted,
            value: 0, // We would need an API to get the current value
            decimals: ethBalance.decimals,
          });
        }
        
        // Here you could add logic to fetch ERC20 token balances
        // and other assets on the connected network
        
        setAssets(assetsList);
      } catch (err) {
        console.error('Error fetching wallet assets:', err);
        setError('Failed to load wallet assets');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, [address, isConnected, ethBalance, chainId]);

  return {
    assets,
    isLoading: isLoading || isLoadingEth,
    error,
    networkName: getNetworkName(chainId),
  };
}