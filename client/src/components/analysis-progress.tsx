import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"

interface AnalysisProgressProps {
  isAnalyzing: boolean
  onComplete?: () => void
  currentProgress?: number
}

export function AnalysisProgress({ isAnalyzing, onComplete, currentProgress }: AnalysisProgressProps) {
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState("")

  // Map of stages based on progress percentage
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

  // Update progress and stage when currentProgress changes
  useEffect(() => {
    if (currentProgress !== undefined) {
      setProgress(currentProgress)
      
      // Update stage based on progress
      const stageIndex = Math.min(
        Math.floor(currentProgress / (100 / stages.length)),
        stages.length - 1
      )
      setStage(stages[stageIndex])
      
      // Call onComplete when progress reaches 100%
      if (currentProgress >= 100) {
        setTimeout(() => {
          onComplete?.()
        }, 500)
      }
    }
  }, [currentProgress, onComplete])

  // Handle progress simulation when no currentProgress is provided
  useEffect(() => {
    if (!isAnalyzing) {
      setProgress(0)
      setStage("")
      return
    }

    // If we're not getting progress updates from the server,
    // simulate progress with an animation
    if (currentProgress === undefined) {
      let currentStage = 0
      setStage(stages[currentStage])
      setProgress(0)

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
            setStage(stages[stageIndex])
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
    }
  }, [isAnalyzing, onComplete, currentProgress])

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