import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(durationMs: number): string {
  if (durationMs < 1000) {
    return `${durationMs}ms`;
  }
  return `${(durationMs / 1000).toFixed(1)} seconds`;
}

export function getSeverityColorClasses(severity: string) {
  switch (severity.toLowerCase()) {
    case 'critical':
      return {
        border: 'border-secondary',
        bg: 'bg-red-100',
        text: 'text-secondary',
        icon: 'text-secondary'
      };
    case 'high':
      return {
        border: 'border-warning',
        bg: 'bg-orange-100',
        text: 'text-warning',
        icon: 'text-warning'
      };
    case 'medium':
      return {
        border: 'border-yellow-500',
        bg: 'bg-yellow-100',
        text: 'text-yellow-600',
        icon: 'text-yellow-500'
      };
    case 'low':
      return {
        border: 'border-gray-500',
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        icon: 'text-gray-500'
      };
    default:
      return {
        border: 'border-gray-300',
        bg: 'bg-gray-50',
        text: 'text-gray-600',
        icon: 'text-gray-400'
      };
  }
}

// Returns appropriate icon for vulnerability type
export function getVulnerabilityTypeIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'backdoor':
      return 'CircleAlert';
    case 'privileged':
      return 'AlertTriangle';
    case 'tokenomics':
      return 'BarChart';
    default:
      return 'AlertCircle';
  }
}

// Returns color based on overall risk level
export function getRiskLevelColor(riskLevel: string) {
  switch (riskLevel.toLowerCase()) {
    case 'critical':
      return 'text-white bg-red-500';
    case 'high':
      return 'text-white bg-orange-500';
    case 'medium':
      return 'text-yellow-800 bg-yellow-200';
    case 'low':
      return 'text-green-800 bg-green-100';
    case 'safe':
      return 'text-blue-800 bg-blue-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

// Highlight the specific lines in code
export function highlightLines(code: string, start: number, end: number): string {
  const lines = code.split('\n');
  const highlightedLines = lines.map((line, index) => {
    const lineNumber = index + 1;
    if (lineNumber >= start && lineNumber <= end) {
      return `<span class="highlight-line">${line}</span>`;
    }
    return line;
  });
  
  return highlightedLines.join('\n');
}
