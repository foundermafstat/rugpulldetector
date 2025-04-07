import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { contractAddress, contractABI } from './payment-contract';

interface Transaction {
  id: number;
  timestamp: number;
  deepScan: boolean;
  amount: string;
  contractHash: string;
}

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Placeholder function that would be replaced with actual contract interaction
  const fetchTransactions = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would fetch transaction data from the blockchain
      console.log("Would fetch transactions from contract:", contractAddress);
      
      // Mock data for UI display
      setTimeout(() => {
        const mockTransactions: Transaction[] = [
          {
            id: 1,
            timestamp: Date.now() - 3600000, // 1 hour ago
            deepScan: false,
            amount: "0.01",
            contractHash: "0x1234...5678"
          },
          {
            id: 2,
            timestamp: Date.now() - 7200000, // 2 hours ago
            deepScan: true,
            amount: "0.05",
            contractHash: "0x9876...5432"
          }
        ];
        
        setTransactions(mockTransactions);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      setIsLoading(false);
    }
  };

  // Helper function to format timestamps
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Helper function to format contract hash
  const formatContractHash = (hash: string) => {
    if (hash.length <= 13) return hash;
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  // Fetch transactions when component mounts
  React.useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          Recent payments for contract analysis services
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transaction history found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Contract</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.id}</TableCell>
                  <TableCell>{formatTimestamp(tx.timestamp)}</TableCell>
                  <TableCell>
                    <Badge variant={tx.deepScan ? "default" : "outline"}>
                      {tx.deepScan ? "Deep Scan" : "Standard"}
                    </Badge>
                  </TableCell>
                  <TableCell>{tx.amount} ETH</TableCell>
                  <TableCell className="font-mono text-xs">
                    {formatContractHash(tx.contractHash)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}