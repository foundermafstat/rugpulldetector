import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

// Default private key for development only
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    // Local development network
    hardhat: {
      chainId: 31337
    },
    // Holesky testnet
    holesky: {
      url: "https://ethereum-holesky.publicnode.com",
      accounts: [PRIVATE_KEY],
      chainId: 17000,
    },
    // Sepolia testnet
    sepolia: {
      url: "https://rpc.sepolia.org",
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};

export default config;