import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AnalysisResult, ContractInput } from "@shared/schema";
import CodeEditor from "./code-editor";
import AnalysisOptions from "./analysis-options";
import { Loader } from "lucide-react";

interface ContractInputPanelProps {
  onAnalysisStart: () => void;
  onAnalysisComplete: (result: AnalysisResult) => void;
  onJobIdReceived?: (jobId: string) => void;
}

export default function ContractInputPanel({ onAnalysisStart, onAnalysisComplete, onJobIdReceived }: ContractInputPanelProps) {
  const [contractCode, setContractCode] = useState<string>("");
  const [contractAddress, setContractAddress] = useState<string>("");
  const [options, setOptions] = useState({
    detectBackdoors: true,
    detectPrivileged: true,
    detectTokenomics: true,
    detectPhishing: true,
    detectApprovals: true,
    detect2FA: true,
    detectMEV: true,
    deepScan: false
  });
  const { toast } = useToast();

  // Mutation for analyzing contract
  const analyzeMutation = useMutation({
    mutationFn: async (data: ContractInput) => {
      // Step 1: Submit the job
      const res = await apiRequest("POST", "/api/analyze", data);
      const initialResponse = await res.json();
      
      if (!initialResponse.success || !initialResponse.jobId) {
        throw new Error(initialResponse.error || "Failed to start analysis");
      }
      
      // Step 2: Poll for job completion
      const jobId = initialResponse.jobId;
      
      // Notify parent component about the new job ID
      if (onJobIdReceived) {
        onJobIdReceived(jobId);
      }
      
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout
      
      while (attempts < maxAttempts) {
        attempts++;
        
        // Wait 1 second between polling attempts
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          const statusRes = await fetch(`/api/analyze/status/${jobId}`);
          const statusData = await statusRes.json();
          
          if (!statusData.success && statusData.status === 'failed') {
            throw new Error(statusData.error || "Analysis failed");
          }
          
          if (statusData.status === 'completed' && statusData.result) {
            return statusData;
          }
        } catch (err) {
          console.error("Error checking job status:", err);
          // Continue polling despite errors
        }
      }
      
      throw new Error("Analysis timed out. Please try again.");
    },
    onSuccess: (data) => {
      if (data.success && data.result) {
        onAnalysisComplete(data.result);
      } else {
        toast({
          title: "Analysis Failed",
          description: data.error || "Failed to analyze contract",
          variant: "destructive"
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  });

  // Mutation for fetching example contract
  const exampleMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("GET", "/api/examples/contract");
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success && data.contractCode) {
        setContractCode(data.contractCode);
      }
    },
    onError: (error) => {
      toast({
        title: "Failed to fetch example",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  });

  const handleAnalyze = () => {
    if (!contractCode.trim()) {
      toast({
        title: "Empty Contract",
        description: "Please enter some contract code to analyze",
        variant: "destructive"
      });
      return;
    }
    
    onAnalysisStart();
    analyzeMutation.mutate({
      contractCode,
      contractAddress: contractAddress || undefined,
      options
    });
  };

  const handleFetchExample = () => {
    exampleMutation.mutate();
  };

  const handleContractAddressFetch = () => {
    // This would typically fetch verified contract code from Etherscan or similar
    // For now, we'll just show a toast message
    toast({
      title: "Feature Not Implemented",
      description: "Fetching contracts by address will be available soon!",
      variant: "default"
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setContractCode(content || "");
    };
    reader.readAsText(file);
  };

  return (
    <div className="md:w-1/2 bg-white rounded-lg shadow-md mb-6 md:mb-0 p-4">
      <div className="pb-4 border-b border-gray-200">
        <h3 className="font-semibold text-lg mb-1">Contract Input</h3>
        <p className="text-sm text-gray-600">Enter or upload a Solidity smart contract for analysis</p>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="contractAddress" className="block text-sm font-medium text-gray-700">
            Contract Address (Optional)
          </label>
          <span className="text-xs text-gray-500">Ethereum Mainnet</span>
        </div>
        
        <div className="flex">
          <Input
            id="contractAddress"
            placeholder="0x..."
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            className="rounded-r-none"
          />
          <Button 
            onClick={handleContractAddressFetch}
            className="bg-primary text-white rounded-l-none"
          >
            Fetch
          </Button>
        </div>
      </div>

      <CodeEditor
        code={contractCode}
        onChange={setContractCode}
        onUpload={handleFileUpload}
        onLoadExample={handleFetchExample}
      />
      
      <div className="mt-4 flex justify-end">
        <Button 
          onClick={handleAnalyze} 
          variant="destructive" 
          className="bg-secondary"
          disabled={analyzeMutation.isPending}
        >
          {analyzeMutation.isPending ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Analyze Contract
            </>
          )}
        </Button>
      </div>

      <AnalysisOptions options={options} onChange={setOptions} />
    </div>
  );
}
