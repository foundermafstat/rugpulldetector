import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { contractInputSchema } from "@shared/schema";
import { analyzeContract } from "./analyzer";
import { fromZodError } from "zod-validation-error";
import WebSocket from "ws";

// Keep track of analysis jobs
interface AnalysisJob {
  id: string;
  progress: number;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  startTime: number;
  result?: any;
  error?: string;
}

const analysisJobs = new Map<string, AnalysisJob>();

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Endpoint to analyze smart contract (streaming version with progress updates)
  app.post("/api/analyze", async (req, res) => {
    try {
      const input = contractInputSchema.parse(req.body);
      
      // Create a unique job ID
      const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      
      // Initialize the job
      analysisJobs.set(jobId, {
        id: jobId,
        progress: 0,
        status: 'pending',
        startTime: Date.now()
      });
      
      // Return the job ID immediately
      res.json({ success: true, jobId });
      
      // Process the contract analysis asynchronously using a proper promise chain
      // to ensure that all async operations are properly awaited
      (async () => {
        try {
          // Update status to analyzing
          analysisJobs.set(jobId, {
            ...analysisJobs.get(jobId)!,
            status: 'analyzing',
            progress: 10
          });
          
          // Simulate gradual progress updates in a controlled way
          const updateProgress = (progress: number) => {
            const job = analysisJobs.get(jobId);
            if (job && job.status === 'analyzing') {
              analysisJobs.set(jobId, {
                ...job,
                progress
              });
            }
          };
          
          // Set up progress updates with proper awaits
          const progressUpdates = [25, 40, 60, 75, 90];
          for (let i = 0; i < progressUpdates.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 800));
            updateProgress(progressUpdates[i]);
          }
          
          // Now perform the actual contract analysis
          const startTime = Date.now();
          const result = await analyzeContract(input);
          const duration = Date.now() - startTime;
          
          // Store the analysis result
          const analysisResult = await storage.saveAnalysisResult({
            ...result,
            scanTime: new Date(),
            scanDuration: duration
          });
          
          // Update job with completed status and result
          analysisJobs.set(jobId, {
            ...analysisJobs.get(jobId)!,
            status: 'completed',
            progress: 100,
            result: analysisResult
          });
          
          console.log(`Analysis job ${jobId} completed successfully`);
        } catch (error) {
          console.error(`Error analyzing contract (job ${jobId}):`, error);
          
          // Make sure to handle the error by updating the job status
          const job = analysisJobs.get(jobId);
          if (job) {
            analysisJobs.set(jobId, {
              ...job,
              status: 'failed',
              progress: 0,
              error: error instanceof Error ? error.message : "Unknown error occurred"
            });
          }
        }
      })().catch(err => {
        console.error(`Unhandled error in analysis job ${jobId}:`, err);
      });
      
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          success: false, 
          error: fromZodError(error).message 
        });
      }
      
      console.error("Error starting contract analysis:", error);
      return res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      });
    }
  });
  
  // Endpoint to check analysis progress
  app.get("/api/analyze/status/:jobId", (req, res) => {
    const { jobId } = req.params;
    const job = analysisJobs.get(jobId);
    
    if (!job) {
      return res.status(404).json({ success: false, error: "Analysis job not found" });
    }
    
    if (job.status === 'completed') {
      return res.json({ success: true, status: job.status, progress: 100, result: job.result });
    }
    
    if (job.status === 'failed') {
      return res.json({ success: false, status: job.status, error: job.error || "Analysis failed" });
    }
    
    // For pending or analyzing status, return the current progress
    return res.json({ 
      success: true, 
      status: job.status, 
      progress: job.progress,
      jobId: job.id
    });
  });
  
  // Endpoint to get analysis result by ID
  app.get("/api/analysis/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
      const analysisResult = await storage.getAnalysisResult(parseInt(id));
      
      if (!analysisResult) {
        return res.status(404).json({ success: false, error: "Analysis result not found" });
      }
      
      return res.json({ success: true, result: analysisResult });
    } catch (error) {
      console.error("Error getting analysis result:", error);
      return res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      });
    }
  });
  
  // Endpoint to get example contract code
  app.get("/api/examples/contract", (_req, res) => {
    const exampleContract = `pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RiskyToken is ERC20, Ownable {
    mapping(address => bool) private _blacklisted;
    bool public tradingEnabled = false;
    uint256 public maxTransactionAmount;
    address private _hiddenOwner;
    
    constructor() ERC20("Risky Token", "RISKY") {
        _mint(msg.sender, 1000000 * 10**decimals());
        maxTransactionAmount = totalSupply();
        _hiddenOwner = msg.sender;
    }
    
    function blacklist(address account) external onlyOwner {
        _blacklisted[account] = true;
    }
    
    function setMaxTransactionAmount(uint256 amount) external onlyOwner {
        maxTransactionAmount = amount;
    }
    
    function enableTrading() external onlyOwner {
        tradingEnabled = true;
    }
    
    function executeMint(address to, uint256 amount) external {
        require(msg.sender == _hiddenOwner, "Not hidden owner");
        _mint(to, amount);
    }
    
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        override
    {
        require(!_blacklisted[from] && !_blacklisted[to], "Blacklisted");
        if (from != owner() && to != owner()) {
            require(tradingEnabled, "Trading not enabled");
            require(amount <= maxTransactionAmount, "Amount exceeds max");
        }
        super._beforeTokenTransfer(from, to, amount);
    }
}`;
    
    return res.json({ success: true, contractCode: exampleContract });
  });

  const httpServer = createServer(app);

  return httpServer;
}
