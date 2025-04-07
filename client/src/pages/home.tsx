import ContractInputPanel from "@/components/contract-input-panel";
import ResultsPanel from "@/components/results-panel";
import { useState } from "react";
import { AnalysisResult } from "@shared/schema";

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<string | undefined>(undefined);

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setIsAnalyzing(false);
    // Clear job ID after analysis is complete
    setCurrentJobId(undefined);
  };
  
  // This function will be called by the ContractInputPanel when a new analysis job is started
  const handleJobIdReceived = (jobId: string) => {
    setCurrentJobId(jobId);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Smart Contract Vulnerability Analysis</h2>
        <p className="text-gray-600">Detect potential rugpull vulnerabilities in Ethereum smart contracts</p>
      </div>

      {/* Main Content */}
      <div className="md:flex gap-6 mb-8">
        <ContractInputPanel 
          onAnalysisStart={handleAnalysisStart}
          onAnalysisComplete={handleAnalysisComplete}
          onJobIdReceived={handleJobIdReceived}
        />
        <ResultsPanel 
          analysisResult={analysisResult}
          isAnalyzing={isAnalyzing}
          jobId={currentJobId}
        />
      </div>
    </div>
  );
}
