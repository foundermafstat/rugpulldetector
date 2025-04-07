import ContractInputPanel from "@/components/contract-input-panel";
import ResultsPanel from "@/components/results-panel";
import { useState } from "react";
import { AnalysisResult } from "@shared/schema";

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setIsAnalyzing(false);
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
          onAnalysisStart={() => setIsAnalyzing(true)}
          onAnalysisComplete={handleAnalysisComplete}
        />
        <ResultsPanel 
          analysisResult={analysisResult}
          isAnalyzing={isAnalyzing}
        />
      </div>
    </div>
  );
}
