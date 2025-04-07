import { useWalletAssets } from "@/hooks/use-wallet-assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, Coins } from "lucide-react";
import { useAccount, useChainId } from 'wagmi';
import { holesky, sepolia } from "@/components/wallet/web3-provider"; 

export function WalletAssets() {
  const { assets, isLoading, error, networkName } = useWalletAssets();
  const { isConnected } = useAccount();
  const chainId = useChainId();
  
  // Check if we're on a testnet
  const isTestnet = chainId === holesky.id || chainId === sepolia.id;
  
  if (!isConnected) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center">
            <Wallet className="h-4 w-4 mr-2" />
            Wallet Assets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Connect your wallet to view your assets
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center justify-between">
          <div className="flex items-center">
            <Wallet className="h-4 w-4 mr-2" />
            Wallet Assets
          </div>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            {networkName}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-5 w-3/5" />
          </div>
        ) : error ? (
          <div className="text-sm text-destructive">{error}</div>
        ) : assets.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No assets found on this network
          </div>
        ) : (
          <div className="space-y-3">
            {assets.map((asset, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Coins className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm font-medium">{asset.name}</span>
                </div>
                <div className="text-sm">
                  {asset.formattedBalance} {asset.symbol}
                </div>
              </div>
            ))}
            
            {isTestnet && (
              <div className="text-xs text-muted-foreground mt-4 bg-muted p-2 rounded">
                <span className="font-medium">Testnet Notice:</span> These are testnet tokens with no real value.
                You can get free {networkName} ETH from a faucet.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}