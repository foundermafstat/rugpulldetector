import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWalletAssets, WalletAsset } from '@/hooks/use-wallet-assets';

export function WalletAssets() {
  const { assets, isLoading, error, getAssets } = useWalletAssets();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Wallet Assets</CardTitle>
        <CardDescription>
          Your available tokens and balances
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={getAssets}>Retry</Button>
          </div>
        ) : assets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No assets found in your wallet</p>
            <Button onClick={getAssets}>Refresh</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {assets.map((asset, index) => (
              <AssetCard key={index} asset={asset} />
            ))}
            <div className="flex justify-center mt-6">
              <Button variant="outline" onClick={getAssets} size="sm">
                Refresh
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AssetCard({ asset }: { asset: WalletAsset }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
          {asset.symbol.substring(0, 2)}
        </div>
        <div>
          <h3 className="font-medium">{asset.name}</h3>
          <p className="text-sm text-gray-500">{asset.symbol}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium">{asset.formattedBalance}</div>
        {asset.value > 0 && (
          <div className="text-sm text-gray-500">
            ${asset.value.toLocaleString(undefined, { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </div>
        )}
      </div>
    </div>
  );
}