import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useChainId } from 'wagmi';
import { holesky } from '@/components/wallet/web3-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Contract ABI (simplified for transaction history)
const contractABI = [
  // Include only the necessary functions for reading transaction history
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserAnalyses",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "analysisId",
        "type": "uint256"
      }
    ],
    "name": "getAnalysisDetails",
    "outputs": [
      {
        "internalType": "address",
        "name": "requester",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "contractHash",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "deepScan",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Smart contract address (same as in payment-contract.tsx)
const contractAddress = "0x0000000000000000000000000000000000000000";

interface Transaction {
  id: number;
  timestamp: number;
  deepScan: boolean;
  amount: string;
  contractHash: string;
}

export function TransactionHistory() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Read user's analysis IDs from the contract using wagmi v2 API
  const { data: userAnalysisIds, isPending: isLoadingIds } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getUserAnalyses',
    args: address ? [address] : undefined,
    chainId: holesky.id,
  });

  // Fetch transaction details when userAnalysisIds changes
  useEffect(() => {
    if (!userAnalysisIds || !Array.isArray(userAnalysisIds) || userAnalysisIds.length === 0) {
      setTransactions([]);
      return;
    }

    const fetchTransactionDetails = async () => {
      setIsLoading(true);
      
      try {
        const txDetails = await Promise.all(
          userAnalysisIds.map(async (id) => {
            // This is a mock implementation since we can't actually call the contract
            // In a real implementation, we would use useContractRead for each ID
            // or a multicall to batch the requests
            
            // Simulating a contract call
            const details = {
              id: Number(id),
              timestamp: Math.floor(Date.now() / 1000) - (Math.random() * 100000), // Random timestamp in the past
              deepScan: Math.random() > 0.5, // Random boolean
              amount: Math.random() > 0.5 ? '0.01' : '0.025', // Random amount
              contractHash: `contract_${id}_hash`, // Fake hash
            };
            
            return details;
          })
        );
        
        // Sort transactions by timestamp (newest first)
        const sortedTxs = txDetails.sort((a, b) => b.timestamp - a.timestamp);
        setTransactions(sortedTxs);
      } catch (error) {
        console.error('Error fetching transaction details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [userAnalysisIds]);

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transaction History</CardTitle>
          <CardDescription>
            Your premium analysis payment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Connect your wallet to view your transaction history
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Transaction History</CardTitle>
        <CardDescription>
          Your premium analysis payment history
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading || isLoadingIds ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No transactions found. Purchase a premium analysis to see your history.
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div 
                key={tx.id} 
                className="flex items-center justify-between p-3 border rounded-md hover:bg-muted transition-colors"
              >
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="text-sm font-medium">
                      {tx.deepScan ? 'Deep Analysis' : 'Standard Analysis'}
                    </span>
                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                      {tx.amount} ETH
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDistanceToNow(new Date(tx.timestamp * 1000), { addSuffix: true })}
                  </div>
                </div>
                <a 
                  href={`https://holesky.etherscan.io/tx/0x${tx.id.toString(16).padStart(64, '0')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}