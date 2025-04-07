import { AnalysisResult } from "@shared/schema";
import { formatDuration, getRiskLevelColor } from "@/lib/utils";
import { RiskMeter } from "./risk-meter";
import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultsSummaryProps {
  result: AnalysisResult;
}

export default function ResultsSummary({ result }: ResultsSummaryProps) {
  const [showDetailedMetrics, setShowDetailedMetrics] = useState(false);
  
  return (
    <div>
      {/* Top card with title and basic info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">Analysis Summary</h3>
            <p className="text-sm text-gray-600">{result.contractName}</p>
          </div>
          <div className="flex items-center">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(result.overallRisk)}`}>
              {result.overallRisk === "critical"
                ? "Critical Risk"
                : result.overallRisk === "high" 
                  ? "High Risk" 
                  : result.overallRisk === "medium" 
                    ? "Medium Risk" 
                    : "Low Risk"}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-600">
            Scan completed in {formatDuration(result.scanDuration)}
          </span>
          <Button variant="outline" size="sm" className="text-primary flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>
      
      {/* Risk meter card */}
      <RiskMeter
        overallRisk={result.overallRisk}
        criticalCount={result.criticalCount}
        highCount={result.highCount}
        mediumCount={result.mediumCount}
        lowCount={result.lowCount}
        animate={true}
      />
      
      {/* Toggle detailed metrics button */}
      <div className="mt-4 flex justify-center">
        <Button 
          variant="ghost" 
          onClick={() => setShowDetailedMetrics(!showDetailedMetrics)}
          className="text-sm text-gray-500"
        >
          {showDetailedMetrics ? "Hide Detailed Metrics" : "Show Detailed Metrics"}
        </Button>
      </div>
      
      {/* Detailed vulnerability metrics */}
      {showDetailedMetrics && (
        <div className="mt-4 bg-white rounded-lg shadow-md p-6">
          <h4 className="font-medium mb-3">Detailed Vulnerability Metrics</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Backdoor Mechanisms</span>
              <div className="w-2/3 bg-gray-100 rounded-full h-2.5">
                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Privileged Functions</span>
              <div className="w-2/3 bg-gray-100 rounded-full h-2.5">
                <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Tokenomics Manipulation</span>
              <div className="w-2/3 bg-gray-100 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Access Controls</span>
              <div className="w-2/3 bg-gray-100 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
