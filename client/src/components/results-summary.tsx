import { AnalysisResult } from "@shared/schema";
import { formatDuration, getRiskLevelColor } from "@/lib/utils";

interface ResultsSummaryProps {
  result: AnalysisResult;
}

export default function ResultsSummary({ result }: ResultsSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">Analysis Summary</h3>
          <p className="text-sm text-gray-600">{result.contractName}</p>
        </div>
        <div className="flex items-center">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(result.overallRisk)}`}>
            {result.overallRisk === "high" 
              ? "High Risk" 
              : result.overallRisk === "medium" 
                ? "Medium Risk" 
                : "Low Risk"}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="p-3 bg-gray-50 rounded-md">
          <p className="text-xs text-gray-500">Critical</p>
          <p className="text-lg font-semibold text-secondary">{result.criticalCount}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-md">
          <p className="text-xs text-gray-500">High</p>
          <p className="text-lg font-semibold text-warning">{result.highCount}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-md">
          <p className="text-xs text-gray-500">Medium</p>
          <p className="text-lg font-semibold text-yellow-500">{result.mediumCount}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-md">
          <p className="text-xs text-gray-500">Low</p>
          <p className="text-lg font-semibold text-gray-500">{result.lowCount}</p>
        </div>
      </div>
      
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">
          Scan completed in {formatDuration(result.scanDuration)}
        </span>
        <button className="text-primary hover:underline">
          Export Report
        </button>
      </div>
    </div>
  );
}
