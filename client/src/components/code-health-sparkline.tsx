import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Info } from "lucide-react";
import { Vulnerability } from "@shared/schema";

interface CodeHealthSparklineProps {
  contractCode: string;
  vulnerabilities: Vulnerability[];
}

type LineHealth = {
  lineNumber: number;
  health: number; // 0-100 score
  issues: Vulnerability[];
};

export default function CodeHealthSparkline({ contractCode, vulnerabilities }: CodeHealthSparklineProps) {
  const [lineHealthData, setLineHealthData] = useState<LineHealth[]>([]);
  const [hoveredLine, setHoveredLine] = useState<LineHealth | null>(null);
  const [viewMode, setViewMode] = useState<"lines" | "sections">("lines");

  // Calculate health metrics for each line of code
  useEffect(() => {
    if (!contractCode || !vulnerabilities.length) {
      setLineHealthData([]);
      return;
    }

    const lines = contractCode.split("\n");
    const lineData: LineHealth[] = lines.map((_, index) => {
      const lineNumber = index + 1;
      
      // Find vulnerabilities affecting this line
      const lineIssues = vulnerabilities.filter(
        v => lineNumber >= v.lineStart && lineNumber <= v.lineEnd
      );
      
      // Calculate health score for this line
      let health = 100; // Start with perfect health
      
      // Each vulnerability reduces health based on severity
      lineIssues.forEach(issue => {
        switch (issue.severity) {
          case "critical":
            health -= 40;
            break;
          case "high":
            health -= 25;
            break;
          case "medium":
            health -= 15;
            break;
          case "low":
            health -= 5;
            break;
        }
      });
      
      // Ensure health is between 0-100
      health = Math.max(0, Math.min(100, health));
      
      return {
        lineNumber,
        health,
        issues: lineIssues
      };
    });
    
    setLineHealthData(lineData);
  }, [contractCode, vulnerabilities]);

  // Get color for health value
  const getHealthColor = (health: number): string => {
    if (health >= 80) return "bg-green-500";
    if (health >= 60) return "bg-yellow-500";
    if (health >= 40) return "bg-orange-500";
    if (health >= 20) return "bg-red-500";
    return "bg-red-700";
  };

  // Get aggregated section health data (for contracts with many lines)
  const getSectionHealthData = () => {
    if (!lineHealthData.length) return [];

    const totalLines = lineHealthData.length;
    const sectionSize = Math.max(10, Math.ceil(totalLines / 20)); // Create ~20 sections or minimum 10 lines per section
    
    const sections: { sectionStart: number; sectionEnd: number; avgHealth: number; issues: Vulnerability[] }[] = [];
    
    for (let i = 0; i < totalLines; i += sectionSize) {
      const sectionLines = lineHealthData.slice(i, Math.min(i + sectionSize, totalLines));
      const totalHealth = sectionLines.reduce((sum, line) => sum + line.health, 0);
      const avgHealth = totalHealth / sectionLines.length;
      
      // Get unique issues in this section
      const uniqueIssueIds = new Set<number>();
      const sectionIssues: Vulnerability[] = [];
      
      sectionLines.forEach(line => {
        line.issues.forEach(issue => {
          if (!uniqueIssueIds.has(issue.id)) {
            uniqueIssueIds.add(issue.id);
            sectionIssues.push(issue);
          }
        });
      });
      
      sections.push({
        sectionStart: i + 1,
        sectionEnd: Math.min(i + sectionSize, totalLines),
        avgHealth,
        issues: sectionIssues
      });
    }
    
    return sections;
  };

  const sectionHealthData = getSectionHealthData();

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Contract Health Visualization</CardTitle>
          <Tabs 
            defaultValue="lines" 
            className="w-auto"
            onValueChange={(value) => setViewMode(value as "lines" | "sections")}
          >
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="lines">Line-by-Line</TabsTrigger>
              <TabsTrigger value="sections">By Sections</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {vulnerabilities.length === 0 ? (
          <div className="flex items-center justify-center py-6 text-gray-500">
            <Info className="h-5 w-5 mr-2" />
            <span>Analyze your contract to see its health visualization</span>
          </div>
        ) : (
          <>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex space-x-1">
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Healthy</Badge>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Warning</Badge>
                <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">Poor</Badge>
                <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Critical</Badge>
              </div>
              <div className="text-xs text-gray-500">
                Hover over segments to see vulnerabilities
              </div>
            </div>
            
            <div className="relative w-full h-16 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
              <TooltipProvider>
                {viewMode === "lines" ? (
                  <div className="flex w-full h-full">
                    {lineHealthData.map((lineData, index) => (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <div
                            className={`h-full ${getHealthColor(lineData.health)} cursor-pointer transition-opacity hover:opacity-80`}
                            style={{ width: `${100 / lineHealthData.length}%` }}
                            onMouseEnter={() => setHoveredLine(lineData)}
                            onMouseLeave={() => setHoveredLine(null)}
                          />
                        </TooltipTrigger>
                        <TooltipContent align="center" className="max-w-sm">
                          <div>
                            <div className="font-bold">Line {lineData.lineNumber}</div>
                            <div className="text-sm">Health: {lineData.health}%</div>
                            {lineData.issues.length > 0 ? (
                              <div className="mt-1">
                                <div className="text-xs font-medium">Issues:</div>
                                <ul className="text-xs list-disc pl-3 mt-1">
                                  {lineData.issues.map((issue, i) => (
                                    <li key={i} className="text-xs">
                                      <span className={
                                        issue.severity === 'critical' ? 'text-red-500' :
                                        issue.severity === 'high' ? 'text-orange-500' :
                                        issue.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                                      }>
                                        {issue.severity.toUpperCase()}:
                                      </span>{' '}
                                      {issue.name}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : null}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                ) : (
                  <div className="flex w-full h-full">
                    {sectionHealthData.map((section, index) => (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <div
                            className={`h-full ${getHealthColor(section.avgHealth)} cursor-pointer transition-opacity hover:opacity-80`}
                            style={{ width: `${100 / sectionHealthData.length}%` }}
                          />
                        </TooltipTrigger>
                        <TooltipContent align="center" className="max-w-sm">
                          <div>
                            <div className="font-bold">Lines {section.sectionStart}-{section.sectionEnd}</div>
                            <div className="text-sm">Health: {Math.round(section.avgHealth)}%</div>
                            {section.issues.length > 0 ? (
                              <div className="mt-1">
                                <div className="text-xs font-medium">Issues found in this section:</div>
                                <ul className="text-xs list-disc pl-3 mt-1">
                                  {section.issues.map((issue, i) => (
                                    <li key={i} className="text-xs">
                                      <span className={
                                        issue.severity === 'critical' ? 'text-red-500' :
                                        issue.severity === 'high' ? 'text-orange-500' :
                                        issue.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                                      }>
                                        {issue.severity.toUpperCase()}:
                                      </span>{' '}
                                      {issue.name} (lines {issue.lineStart}-{issue.lineEnd})
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : null}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                )}
              </TooltipProvider>
            </div>
            
            {hoveredLine && hoveredLine.issues.length > 0 && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                  <span className="font-medium">Line {hoveredLine.lineNumber} issues:</span>
                </div>
                <ul className="mt-2 space-y-1">
                  {hoveredLine.issues.map((issue, i) => (
                    <li key={i} className="flex items-baseline">
                      <span className={`inline-block w-16 text-xs ${
                        issue.severity === 'critical' ? 'text-red-500' :
                        issue.severity === 'high' ? 'text-orange-500' :
                        issue.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                      }`}>
                        {issue.severity.toUpperCase()}
                      </span>
                      <span className="ml-2">{issue.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}