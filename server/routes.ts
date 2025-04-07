import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { contractInputSchema } from "@shared/schema";
import { analyzeContract } from "./analyzer";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Endpoint to analyze smart contract
  app.post("/api/analyze", async (req, res) => {
    try {
      const input = contractInputSchema.parse(req.body);
      
      const startTime = Date.now();
      const result = await analyzeContract(input);
      const duration = Date.now() - startTime;
      
      // Store the analysis result
      const analysisResult = await storage.saveAnalysisResult({
        ...result,
        scanTime: new Date(),
        scanDuration: duration
      });
      
      return res.json({ success: true, result: analysisResult });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          success: false, 
          error: fromZodError(error).message 
        });
      }
      
      console.error("Error analyzing contract:", error);
      return res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      });
    }
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
