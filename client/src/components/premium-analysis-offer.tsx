import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Shield, Zap } from "lucide-react";
import { useAccount, useBalance, useWriteContract } from "wagmi";
import { holesky } from "./wallet/web3-provider";
import { useToast } from "@/hooks/use-toast";
import { parseEther } from "viem";

// Contract address for the premium service payment
// In a real application, this would be your actual deployed contract
const PAYMENT_ADDRESS = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
const PREMIUM_ANALYSIS_PRICE = "0.01"; // 0.01 ETH

export function PremiumAnalysisOffer() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { address, isConnected, chainId } = useAccount();
  const { data: balance } = useBalance({ 
    address,
    chainId: holesky.id,
  });
  const { writeContractAsync } = useWriteContract();
  const { toast } = useToast();

  const hasSufficientBalance = balance?.value && 
    balance.value >= parseEther(PREMIUM_ANALYSIS_PRICE);
  
  const isCorrectChain = chainId === holesky.id;

  const handlePurchase = async () => {
    if (!address || !isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to continue",
        variant: "destructive"
      });
      return;
    }

    if (!isCorrectChain) {
      toast({
        title: "Wrong network",
        description: "Please switch to Holesky testnet to continue",
        variant: "destructive"
      });
      return;
    }

    if (!hasSufficientBalance) {
      toast({
        title: "Insufficient balance",
        description: `You need at least ${PREMIUM_ANALYSIS_PRICE} ETH on Holesky testnet`,
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // In a real app, you would call your own smart contract here
      // For demo purposes, we'll just simulate a transaction
      setTimeout(() => {
        toast({
          title: "Premium analysis purchased!",
          description: "Your in-depth analysis will begin shortly",
          variant: "default"
        });
        setIsSubmitting(false);
      }, 2000);

      // Actual transaction code would look like this:
      // await writeContractAsync({
      //   address: PAYMENT_ADDRESS,
      //   abi: [...],  // your contract ABI
      //   functionName: 'purchasePremiumAnalysis',
      //   value: parseEther(PREMIUM_ANALYSIS_PRICE),
      // });
    } catch (error) {
      console.error('Transaction error:', error);
      toast({
        title: "Transaction failed",
        description: error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full mt-6 border border-blue-200 shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
        <CardTitle className="flex items-center text-xl text-blue-700">
          <Shield className="mr-2 h-5 w-5" />
          Premium Smart Contract Analysis
        </CardTitle>
        <CardDescription>
          Your contract passed our basic vulnerability scan! For additional security,
          upgrade to our premium in-depth analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium">Advanced Vulnerability Detection</h4>
              <p className="text-sm text-gray-500">
                Uses AI to detect complex vulnerability patterns and edge cases that basic scans miss
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium">Gas Optimization Analysis</h4>
              <p className="text-sm text-gray-500">
                Identifies inefficient code patterns and suggests optimizations to reduce gas costs
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium">Comprehensive Security Report</h4>
              <p className="text-sm text-gray-500">
                Receive a detailed PDF report with all findings and recommended improvements
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-blue-800">Premium Analysis</p>
              <p className="text-xs text-blue-600">One-time payment</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-800">{PREMIUM_ANALYSIS_PRICE} ETH</p>
              <p className="text-xs text-blue-600">Holesky Testnet</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-4 bg-gray-50 rounded-b-lg">
        <Button
          variant="outline"
          onClick={handlePurchase}
          disabled={isSubmitting || !isConnected}
          className="border-blue-300"
        >
          Learn more
        </Button>
        <Button
          onClick={handlePurchase}
          disabled={isSubmitting || !isConnected || !isCorrectChain || !hasSufficientBalance}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? (
            <>
              <Zap className="mr-2 h-4 w-4 animate-pulse" />
              Processing...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Purchase Premium Analysis
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}