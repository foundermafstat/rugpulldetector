import { useState, useEffect } from "react";
import { useAccount, useChainId, useWriteContract, useReadContract, useSwitchChain } from "wagmi";
import { parseEther } from "viem";
import { holesky } from "@/components/wallet/web3-provider";
import { Wallet, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

// Contract ABI (Application Binary Interface)
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "analysisId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "requester",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "contractHash",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "deepScan",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "AnalysisRequested",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newStandardPrice",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newDeepScanPrice",
        "type": "uint256"
      }
    ],
    "name": "PriceUpdated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getPrices",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "contractHash",
        "type": "string"
      }
    ],
    "name": "requestDeepAnalysis",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "contractHash",
        "type": "string"
      }
    ],
    "name": "requestStandardAnalysis",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

// Smart contract address on Holesky testnet (this is a placeholder, you would replace this with your actual deployed contract address)
const contractAddress = "0x0000000000000000000000000000000000000000";

export function PaymentContract({ contractCode }: { contractCode: string }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStandardLoading, setIsStandardLoading] = useState(false);
  const [isDeepLoading, setIsDeepLoading] = useState(false);
  const [isStandardSuccess, setIsStandardSuccess] = useState(false);
  const [isDeepSuccess, setIsDeepSuccess] = useState(false);

  // Generate a hash of the contract code to store in the smart contract
  const contractHash = contractCode ? btoa(contractCode).slice(0, 100) : ""; // Simple base64 encoding for demo purposes
  
  // Default prices
  const standardPrice = parseEther('0.01');
  const deepScanPrice = parseEther('0.025');

  // Contract write hook for both standard and deep analysis
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  // Check if we're on the Holesky network
  const isHoleskyNetwork = chainId === holesky.id;

  // Reset success states when contract code changes
  useEffect(() => {
    setIsStandardSuccess(false);
    setIsDeepSuccess(false);
  }, [contractCode]);

  // Handle standard analysis payment
  const handleStandardAnalysis = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to continue",
        variant: "destructive",
      });
      return;
    }

    if (!isHoleskyNetwork) {
      toast({
        title: "Wrong network",
        description: "Please switch to the Holesky testnet to continue",
        variant: "destructive",
      });
      
      // Attempt to switch network if available
      if (switchChain) {
        switchChain({ chainId: holesky.id });
      }
      return;
    }

    if (!contractCode) {
      toast({
        title: "No contract code",
        description: "Please enter or upload a contract to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setIsStandardLoading(true);
    
    try {
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'requestStandardAnalysis',
        args: [contractHash],
        value: standardPrice,
      });
      
      setIsStandardSuccess(true);
    } catch (error) {
      console.error('Transaction error:', error);
      toast({
        title: "Transaction failed",
        description: error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive"
      });
    } finally {
      setIsStandardLoading(false);
    }
  };

  // Handle deep analysis payment
  const handleDeepAnalysis = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to continue",
        variant: "destructive",
      });
      return;
    }

    if (!isHoleskyNetwork) {
      toast({
        title: "Wrong network",
        description: "Please switch to the Holesky testnet to continue",
        variant: "destructive",
      });
      
      // Attempt to switch network if available
      if (switchChain) {
        switchChain({ chainId: holesky.id });
      }
      return;
    }

    if (!contractCode) {
      toast({
        title: "No contract code",
        description: "Please enter or upload a contract to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setIsDeepLoading(true);
    
    try {
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'requestDeepAnalysis',
        args: [contractHash],
        value: deepScanPrice,
      });
      
      setIsDeepSuccess(true);
    } catch (error) {
      console.error('Transaction error:', error);
      toast({
        title: "Transaction failed",
        description: error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive"
      });
    } finally {
      setIsDeepLoading(false);
    }
  };

  // Reset processing state when transaction completes
  useEffect(() => {
    if (isSuccess && isProcessing) {
      setIsProcessing(false);
      
      toast({
        title: "Transaction successful",
        description: "Your payment has been processed. We'll analyze your contract and provide results shortly.",
        variant: "default",
      });
    }
  }, [isSuccess, isProcessing, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Premium Vulnerability Analysis</CardTitle>
        <CardDescription>
          Get advanced security analysis for your smart contract
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!isConnected ? (
            <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">Connect your wallet to access premium features</span>
            </div>
          ) : !isHoleskyNetwork ? (
            <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">
                Please switch to the Holesky testnet
                <Button 
                  variant="link" 
                  className="h-auto p-0 ml-1 text-amber-900 underline"
                  onClick={() => switchChain?.({ chainId: holesky.id })}
                >
                  Switch Network
                </Button>
              </span>
            </div>
          ) : (
            <>
              <div className="rounded-md border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Standard Analysis</h4>
                    <p className="text-xs text-muted-foreground">
                      Standard vulnerability detection for common rugpull patterns
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    0.01 ETH
                  </div>
                </div>
                <Button 
                  className="w-full"
                  onClick={handleStandardAnalysis}
                  disabled={isStandardLoading || isDeepLoading || isProcessing || isPending}
                >
                  {isStandardLoading || (isPending && !isDeepLoading) ? "Processing..." : "Pay & Analyze"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <Separator className="my-2" />

              <div className="rounded-md border p-4 space-y-3 border-primary/50 bg-primary/5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium flex items-center">
                      Deep Analysis
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground">
                        Recommended
                      </span>
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Comprehensive in-depth analysis with advanced vulnerability detection
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    0.025 ETH
                  </div>
                </div>
                <Button 
                  variant="default"
                  className="w-full"
                  onClick={handleDeepAnalysis}
                  disabled={isDeepLoading || isStandardLoading || isProcessing || isPending}
                >
                  {isDeepLoading || (isPending && !isStandardLoading) ? "Processing..." : "Pay & Analyze"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
          
          {(isStandardSuccess || isDeepSuccess) && (
            <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm">
                Payment successful! Your contract is being analyzed.
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start border-t pt-4">
        <div className="flex items-center text-xs text-muted-foreground gap-1">
          <Wallet className="h-3 w-3" />
          <span>Payments are processed on the Holesky Testnet</span>
        </div>
      </CardFooter>
    </Card>
  );
}