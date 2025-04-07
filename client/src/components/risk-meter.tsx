import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, ShieldAlert, ShieldCheck, ShieldOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RiskMeterProps {
  overallRisk: string;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  animate?: boolean;
}

export function RiskMeter({
  overallRisk,
  criticalCount,
  highCount,
  mediumCount,
  lowCount,
  animate = true,
}: RiskMeterProps) {
  const [progress, setProgress] = useState(0);
  const [riskLevel, setRiskLevel] = useState<string>(overallRisk);
  
  // Calculate total issues and risk percentage
  const totalIssues = criticalCount + highCount + mediumCount + lowCount;
  
  // Calculate risk percentage based on the severity of issues
  // Critical issues have 4x weight, high 3x, medium 2x, and low 1x
  const weightedScore = 
    (criticalCount * 4) + 
    (highCount * 3) + 
    (mediumCount * 2) + 
    (lowCount * 1);
  
  // Maximum possible score would be if all issues were critical
  const maxPossibleScore = totalIssues * 4;
  
  // Calculate percentage, defaulting to 0 if there are no issues
  const riskPercentage = maxPossibleScore > 0 
    ? Math.min(100, (weightedScore / maxPossibleScore) * 100) 
    : 0;
  
  // Animation effect when component mounts
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setProgress(riskPercentage);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setProgress(riskPercentage);
    }
  }, [riskPercentage, animate]);
  
  // Determine risk meter color based on overall risk level
  const getRiskColor = () => {
    switch (riskLevel.toLowerCase()) {
      case 'critical':
        return 'rgb(239, 68, 68)'; // red-500
      case 'high':
        return 'rgb(249, 115, 22)'; // orange-500
      case 'medium':
        return 'rgb(234, 179, 8)'; // yellow-500
      case 'low':
        return 'rgb(34, 197, 94)'; // green-500
      default:
        return 'rgb(59, 130, 246)'; // blue-500
    }
  };
  
  // Get risk icon based on risk level
  const getRiskIcon = () => {
    switch (riskLevel.toLowerCase()) {
      case 'critical':
        return <ShieldAlert className="h-6 w-6 text-red-500" />;
      case 'high':
        return <ShieldOff className="h-6 w-6 text-orange-500" />;
      case 'medium':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'low':
      case 'safe':
        return <ShieldCheck className="h-6 w-6 text-green-500" />;
      default:
        return <ShieldCheck className="h-6 w-6 text-blue-500" />;
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Risk Assessment</h3>
            <div className="flex items-center">
              {getRiskIcon()}
              <span 
                className="ml-2 font-semibold" 
                style={{ color: getRiskColor() }}
              >
                {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="risk-meter-gauge border border-gray-200">
              {/* Background gradient for risk meter */}
              <div className="risk-meter-background" />
              
              {/* Mask layer that reveals the background based on progress */}
              <div 
                className="risk-meter-mask" 
                style={{ left: `${progress}%` }}
              />
              
              {/* Animated pointer/needle */}
              <motion.div
                initial={{ left: "0%" }}
                animate={{ left: `${progress}%` }}
                transition={{ 
                  duration: animate ? 1.2 : 0, 
                  ease: "easeOut",
                  delay: animate ? 0.2 : 0
                }}
                className="risk-meter-needle"
              />
            </div>
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>Safe</span>
              <span>Medium</span>
              <span>High</span>
              <span>Critical</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2 pt-2">
            <IssueCounter label="Critical" count={criticalCount} color="bg-red-500" animate={animate} />
            <IssueCounter label="High" count={highCount} color="bg-orange-500" animate={animate} />
            <IssueCounter label="Medium" count={mediumCount} color="bg-yellow-500" animate={animate} />
            <IssueCounter label="Low" count={lowCount} color="bg-green-500" animate={animate} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface IssueCounterProps {
  label: string;
  count: number;
  color: string;
  animate?: boolean;
}

function IssueCounter({ label, count, color, animate = true }: IssueCounterProps) {
  const [displayCount, setDisplayCount] = useState(0);
  
  useEffect(() => {
    if (animate && count > 0) {
      let current = 0;
      const increment = Math.max(1, Math.floor(count / 15));
      const interval = setInterval(() => {
        current = Math.min(current + increment, count);
        setDisplayCount(current);
        
        if (current >= count) {
          clearInterval(interval);
        }
      }, 50);
      
      return () => clearInterval(interval);
    } else {
      setDisplayCount(count);
    }
  }, [count, animate]);
  
  return (
    <div className="flex flex-col items-center p-2 rounded-md bg-gray-50">
      <div className={`w-3 h-3 rounded-full ${color} mb-1`} />
      <div className="text-xs font-medium">{label}</div>
      <AnimatePresence mode="wait">
        <motion.div 
          key={displayCount}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.2 }}
          className="text-lg font-bold counter-animate-in"
        >
          {displayCount}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}