import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Deploying VulnerabilityAnalysisPayment contract...");
  
  const VulnerabilityAnalysisPayment = await ethers.getContractFactory("VulnerabilityAnalysisPayment");
  const contract = await VulnerabilityAnalysisPayment.deploy();
  
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  console.log(`VulnerabilityAnalysisPayment deployed to: ${contractAddress}`);
  
  // Update the contract address in the frontend component
  updateContractAddress(contractAddress);
  
  console.log("Contract address updated in the frontend files");
}

function updateContractAddress(contractAddress: string) {
  try {
    // Path to the contract interaction component
    const filePath = path.join(__dirname, "..", "client", "src", "components", "contract-interaction", "payment-contract.tsx");
    
    // Read the current file content
    let fileContent = fs.readFileSync(filePath, "utf-8");
    
    // Replace the contract address with the new one
    fileContent = fileContent.replace(
      /export const contractAddress = "[^"]*"/,
      `export const contractAddress = "${contractAddress}"`
    );
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, fileContent);
    
    console.log(`Contract address updated in: ${filePath}`);
  } catch (error) {
    console.error("Error updating contract address:", error);
  }
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });