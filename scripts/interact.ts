import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  // Get the deployed contract address
  const contractAddress = getContractAddress();
  if (!contractAddress) {
    console.error("Contract address not found. Please deploy the contract first.");
    return;
  }
  
  console.log(`Interacting with contract at address: ${contractAddress}`);
  
  // Get the contract factory and attach to the deployed contract
  const VulnerabilityAnalysisPayment = await ethers.getContractFactory("VulnerabilityAnalysisPayment");
  const contract = VulnerabilityAnalysisPayment.attach(contractAddress);
  
  // Get contract details
  const owner = await contract.owner();
  const standardPrice = await contract.standardAnalysisPrice();
  const deepScanPrice = await contract.deepScanAnalysisPrice();
  
  console.log(`Contract Owner: ${owner}`);
  console.log(`Standard Analysis Price: ${ethers.formatEther(standardPrice)} ETH`);
  console.log(`Deep Scan Analysis Price: ${ethers.formatEther(deepScanPrice)} ETH`);
  
  // Get transaction count
  const txCount = await contract.getTransactionCount();
  console.log(`Total Transactions: ${txCount}`);
  
  // Get transactions if there are any
  if (txCount > 0) {
    console.log("\nRecent Transactions:");
    
    // Get the 5 most recent transactions (or fewer if there aren't 5)
    const limit = Math.min(Number(txCount), 5);
    for (let i = Number(txCount) - 1; i >= Number(txCount) - limit; i--) {
      const tx = await contract.getTransaction(i);
      console.log(`Transaction #${i}:`);
      console.log(`  User: ${tx[0]}`);
      console.log(`  Amount: ${ethers.formatEther(tx[1])} ETH`);
      console.log(`  Contract Hash: ${tx[2]}`);
      console.log(`  Deep Scan: ${tx[3]}`);
      console.log(`  Timestamp: ${new Date(Number(tx[4]) * 1000).toLocaleString()}`);
      console.log("");
    }
  }
}

function getContractAddress(): string | null {
  try {
    // Path to the contract interaction component
    const filePath = path.join(__dirname, "..", "client", "src", "components", "contract-interaction", "payment-contract.tsx");
    
    // Read the file content
    const fileContent = fs.readFileSync(filePath, "utf-8");
    
    // Extract the contract address
    const match = fileContent.match(/export const contractAddress = "([^"]*)"/);
    if (match && match[1] && match[1] !== "0x0000000000000000000000000000000000000000") {
      return match[1];
    }
    
    return null;
  } catch (error) {
    console.error("Error reading contract address:", error);
    return null;
  }
}

// Execute the interaction
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });