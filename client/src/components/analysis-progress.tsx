import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"

interface AnalysisProgressProps {
  isAnalyzing: boolean
  onComplete?: () => void
}

export function AnalysisProgress({ isAnalyzing, onComplete }: AnalysisProgressProps) {
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState("")

  useEffect(() => {
    if (!isAnalyzing) {
      setProgress(0)
      setStage("")
      return
    }

    const stages = [
      "Parsing contract code...",
      "Analyzing contract structure...",
      "Detecting vulnerability patterns...",
      "Checking for backdoor mechanisms...",
      "Analyzing privileged functions...",
      "Evaluating tokenomics security...",
      "Generating vulnerability reports...",
      "Finalizing analysis..."
    ]

    let currentStage = 0
    setStage(stages[currentStage])

    // Reset progress when analysis starts
    setProgress(0)

    // Create a realistic progress simulation
    const timer = setInterval(() => {
      setProgress(oldProgress => {
        // Calculate new progress
        const increment = Math.random() * 15
        const newProgress = Math.min(oldProgress + increment, 100)
        
        // Update stage based on progress thresholds
        const stageIndex = Math.min(
          Math.floor(newProgress / (100 / stages.length)),
          stages.length - 1
        )
        
        if (stageIndex !== currentStage) {
          currentStage = stageIndex
          setStage(stages[currentStage])
        }
        
        // Check if complete
        if (newProgress >= 100) {
          clearInterval(timer)
          
          // Call onComplete after a small delay
          setTimeout(() => {
            onComplete?.()
          }, 500)
        }
        
        return newProgress
      })
    }, 300)

    return () => {
      clearInterval(timer)
    }
  }, [isAnalyzing, onComplete])

  if (!isAnalyzing) {
    return null
  }

  return (
    <div className="w-full space-y-2 mt-4">
      <div className="flex justify-between text-sm mb-1">
        <span>{stage}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="progress-bar w-full">
        <div 
          className="progress-value"
          style={{ width: `${progress}%` }}
        />
      </Progress>
    </div>
  )
}