import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Shield } from "lucide-react";
import { PaymentContract } from "@/components/contract-interaction/payment-contract";
import { TransactionHistory } from "@/components/contract-interaction/transaction-history";
import { WalletAssets } from "@/components/wallet/wallet-assets";

export function PremiumAnalysisOffer({ contractCode = "" }: { contractCode?: string }) {
  const [activeTab, setActiveTab] = useState("premium");

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
        <div className="space-y-4 mb-6">
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="premium">Premium Analysis</TabsTrigger>
            <TabsTrigger value="wallet">Your Wallet</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="premium" className="mt-0">
            <PaymentContract contractCode={contractCode} />
          </TabsContent>
          
          <TabsContent value="wallet" className="mt-0">
            <WalletAssets />
          </TabsContent>
          
          <TabsContent value="history" className="mt-0">
            <TransactionHistory />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}