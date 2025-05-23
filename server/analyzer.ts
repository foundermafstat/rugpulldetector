import { 
  ContractInput, 
  InsertAnalysisResult, 
  Vulnerability 
} from "@shared/schema";
import { vulnerabilityPatterns } from "./vulnerability-patterns";

interface AnalysisOptions {
  detectBackdoors: boolean;
  detectPrivileged: boolean;
  detectTokenomics: boolean;
  detectPhishing: boolean;
  detectApprovals: boolean;
  detect2FA: boolean;
  detectMEV: boolean;
  detectMultisig: boolean;
  deepScan: boolean;
}

export async function analyzeContract(
  input: ContractInput
): Promise<Omit<InsertAnalysisResult, "scanTime" | "scanDuration">> {
  const { contractCode, contractName = extractContractName(contractCode) } = input;
  
  // Define default options
  const defaultOptions: AnalysisOptions = {
    detectBackdoors: true,
    detectPrivileged: true,
    detectTokenomics: true,
    detectPhishing: true,
    detectApprovals: true,
    detect2FA: true,
    detectMEV: true,
    detectMultisig: true,
    deepScan: false
  };
  
  // Merge with user provided options if available
  const options: AnalysisOptions = input.options 
    ? {
        ...defaultOptions,
        ...input.options,
        // Handle missing new properties that might not be in input.options
        detectPhishing: input.options.detectPhishing ?? defaultOptions.detectPhishing,
        detectApprovals: input.options.detectApprovals ?? defaultOptions.detectApprovals,
        detect2FA: input.options.detect2FA ?? defaultOptions.detect2FA,
        detectMEV: input.options.detectMEV ?? defaultOptions.detectMEV,
        detectMultisig: input.options.detectMultisig ?? defaultOptions.detectMultisig
      }
    : defaultOptions;
  
  // Split the contract into lines for analysis
  const lines = contractCode.split("\n");
  
  // Collect detected vulnerabilities
  const vulns: Vulnerability[] = [];
  
  // Apply each vulnerability pattern
  for (const pattern of vulnerabilityPatterns) {
    // Skip patterns based on options
    if (
      (pattern.type === "backdoor" && !options.detectBackdoors) ||
      (pattern.type === "privileged" && !options.detectPrivileged) ||
      (pattern.type === "tokenomics" && !options.detectTokenomics) ||
      (pattern.type === "phishing" && !options.detectPhishing) ||
      (pattern.type === "approvals" && !options.detectApprovals) ||
      (pattern.type === "2fa" && !options.detect2FA) ||
      (pattern.type === "mev" && !options.detectMEV) ||
      (pattern.type === "multisig" && !options.detectMultisig) ||
      (pattern.requiresDeepScan && !options.deepScan)
    ) {
      continue;
    }
    
    // Check for pattern match
    const matches = detectPattern(lines, pattern.regex);
    
    if (matches.length > 0) {
      for (const match of matches) {
        vulns.push({
          id: 0, // This will be set by storage
          name: pattern.name,
          description: pattern.description,
          type: pattern.type,
          severity: pattern.severity,
          lineStart: match.lineStart,
          lineEnd: match.lineEnd,
          impact: pattern.impact,
          recommendations: pattern.recommendations
        });
      }
    }
  }
  
  // Count vulnerabilities by severity
  const criticalCount = vulns.filter(v => v.severity === "critical").length;
  const highCount = vulns.filter(v => v.severity === "high").length;
  const mediumCount = vulns.filter(v => v.severity === "medium").length;
  const lowCount = vulns.filter(v => v.severity === "low").length;
  
  // Determine overall risk
  let overallRisk = "low";
  if (criticalCount > 0) {
    overallRisk = "high";
  } else if (highCount > 0) {
    overallRisk = "high";
  } else if (mediumCount > 0) {
    overallRisk = "medium";
  }
  
  return {
    contractName,
    contractCode,
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    overallRisk,
    vulnerabilities: vulns,
  };
}

interface PatternMatch {
  lineStart: number;
  lineEnd: number;
  matchedText: string;
}

/**
 * Detects patterns in code lines using regex
 */
function detectPattern(lines: string[], pattern: RegExp): PatternMatch[] {
  const matches: PatternMatch[] = [];
  const code = lines.join("\n");
  
  let match;
  while ((match = pattern.exec(code)) !== null) {
    const matchedText = match[0];
    const beforeMatch = code.substring(0, match.index);
    const lineStart = beforeMatch.split("\n").length;
    const lineEnd = lineStart + matchedText.split("\n").length - 1;
    
    matches.push({
      lineStart,
      lineEnd,
      matchedText
    });
  }
  
  return matches;
}

/**
 * Attempts to extract contract name from the code
 */
function extractContractName(code: string): string {
  const contractMatch = /contract\s+([a-zA-Z0-9_]+)/.exec(code);
  return contractMatch ? contractMatch[1] : "UnnamedContract";
}
