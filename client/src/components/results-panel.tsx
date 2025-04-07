import { Monitor } from "lucide-react";
import { AnalysisResult } from "@shared/schema";
import ResultsSummary from "./results-summary";
import VulnerabilityCard from "./vulnerability-card";
import { Skeleton } from "@/components/ui/skeleton";

interface ResultsPanelProps {
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
}

export default function ResultsPanel({ analysisResult, isAnalyzing }: ResultsPanelProps) {
  // Show empty state
  if (!isAnalyzing && !analysisResult) {
    return (
      <div className="md:w-1/2">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Monitor className="h-16 w-16 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No Analysis Results</h3>
          <p className="mt-1 text-sm text-gray-500">
            Submit a contract for analysis to see vulnerability results here
          </p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isAnalyzing && !analysisResult) {
    return (
      <div className="md:w-1/2">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-16 rounded-md" />
            ))}
          </div>
          
          <Skeleton className="h-4 w-full mt-4" />
        </div>
        
        <div className="mt-6 space-y-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Show results
  if (analysisResult) {
    return (
      <div className="md:w-1/2">
        <ResultsSummary result={analysisResult} />
        
        <div className="space-y-4 mt-6">
          {analysisResult.vulnerabilities.map((vulnerability, index) => (
            <VulnerabilityCard 
              key={index}
              vulnerability={vulnerability}
              contractCode={analysisResult.contractCode}
            />
          ))}
          
          {analysisResult.vulnerabilities.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No Vulnerabilities Detected</h3>
              <p className="mt-1 text-sm text-gray-500">
                The contract appears to be free of the rugpull vulnerabilities we scan for
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return null;
}
