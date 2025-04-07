import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Contract ABI (Application Binary Interface)
export const contractABI = [
  "function owner() view returns (address)",
  "function standardAnalysisPrice() view returns (uint256)",
  "function deepScanAnalysisPrice() view returns (uint256)",
  "function contractPaid(bytes32) view returns (bool)",
  "function payForStandardAnalysis(bytes32) payable",
  "function payForDeepScanAnalysis(bytes32) payable",
  "function isContractPaid(bytes32) view returns (bool)",
  "function getTransactionCount() view returns (uint256)",
  "function getTransaction(uint256) view returns (address, uint256, bytes32, bool, uint256)"
];

// Contract address (will be updated during deployment)
export const contractAddress = "0x0000000000000000000000000000000000000000";

export function PaymentContract({ contractCode }: { contractCode: string }) {
  const { toast } = useToast();
  const [showPaidMessage, setShowPaidMessage] = useState(false);
  
  // Mock values for UI rendering
  const isConnected = false;
  const isPaid = false;

  // Handle payment for standard analysis
  const handleStandardPayment = async () => {
    toast({
      title: "Smart Contract Payment",
      description: "Connect your wallet to make payments via smart contract",
    });
  };

  // Handle payment for deep scan analysis
  const handleDeepScanPayment = async () => {
    toast({
      title: "Smart Contract Payment",
      description: "Connect your wallet to make payments via smart contract",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Premium Analysis Services
          <Badge variant="outline" className="ml-2">
            Testnet
          </Badge>
        </CardTitle>
        <CardDescription>
          Enhance your contract analysis with our premium services
        </CardDescription>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="pt-6">
        {!isConnected ? (
          <div className="text-center py-4">
            <p className="mb-4">Connect your wallet to access premium services</p>
            <Button>Connect Wallet</Button>
          </div>
        ) : isPaid ? (
          <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-md mb-4">
            <h3 className="font-medium text-green-800 dark:text-green-300">Analysis Already Purchased</h3>
            <p className="text-sm text-green-700 dark:text-green-400 mt-1">
              This contract has already been analyzed with our premium service.
            </p>
          </div>
        ) : (
          <>
            {showPaidMessage && (
              <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-md mb-4">
                <h3 className="font-medium text-green-800 dark:text-green-300">Payment Successful!</h3>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  Your payment has been processed. The analysis will begin shortly.
                </p>
              </div>
            )}
            
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">Standard Analysis</h3>
                  <p className="text-muted-foreground mb-4">
                    Basic vulnerability detection with focused analysis
                  </p>
                  <div className="text-2xl font-bold mb-4">
                    0.01 ETH
                  </div>
                  <Button 
                    onClick={handleStandardPayment}
                    className="w-full"
                  >
                    Pay Now
                  </Button>
                </div>
                
                <div className="flex-1 border rounded-lg p-4 bg-muted/50">
                  <h3 className="font-medium text-lg mb-2">Deep Scan Analysis</h3>
                  <p className="text-muted-foreground mb-4">
                    Comprehensive analysis with advanced vulnerability detection
                  </p>
                  <div className="text-2xl font-bold mb-4">
                    0.05 ETH
                  </div>
                  <Button 
                    onClick={handleDeepScanPayment}
                    className="w-full"
                    variant="default"
                  >
                    Pay Now
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col items-start">
        <p className="text-xs text-muted-foreground">
          All transactions are processed on the blockchain and are non-refundable.
          Make sure you're connected to a supported testnet.
        </p>
      </CardFooter>
    </Card>
  );
}