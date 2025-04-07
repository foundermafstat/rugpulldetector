# Smart Contract Vulnerability Scanner

A comprehensive web application for smart contract security analysis, focusing on detecting and preventing potential rugpull vulnerabilities in blockchain projects.

## Features

- **Smart Contract Vulnerability Analysis**: Detection of backdoors, privileged access, and tokenomics manipulation
- **Real-time Progress Tracking**: Monitor analysis progress with detailed updates
- **Risk Visualization**: Animated risk meter with color-coded severity indicators
- **Premium Analysis Services**: Deep scan vulnerability detection (0.01 ETH)
- **Testnet Support**: Integration with Holesky and Sepolia testnets
- **Wallet Integration**: Connect and view wallet assets on supported networks

## Technical Implementation

- **Frontend**: React with TypeScript, using shadcn UI components and TailwindCSS
- **Blockchain**: Wagmi v2 for Web3 integration with Holesky and Sepolia support
- **Smart Contracts**: Vulnerability detection and payment handling through Solidity contracts
- **Development**: Hardhat for local contract development and testing

## Smart Contract Development

The project includes a Hardhat environment for smart contract development and testing:

- `contracts/VulnerabilityAnalysisPayment.sol`: Payment handling contract for premium services
- `scripts/deploy.ts`: Script to deploy the payment contract to a testnet
- `scripts/interact.ts`: Script to interact with the deployed contract

## Project Structure

- `client/`: Frontend React application
  - `src/components/`: UI components
  - `src/hooks/`: Custom React hooks
  - `src/lib/`: Utility functions
  - `src/pages/`: Application pages
- `server/`: Backend service
  - `analyzer.ts`: Contract analysis logic
  - `routes.ts`: API endpoints
  - `vulnerability-patterns.ts`: Vulnerability detection patterns
- `contracts/`: Smart contracts
- `scripts/`: Deployment and interaction scripts

## Payment Services

Premium analysis services are charged as follows:
- Standard Analysis: 0.01 ETH
- Deep Scan Analysis: 0.05 ETH

Payment is handled through the VulnerabilityAnalysisPayment smart contract, with all transactions recorded on the blockchain.

## License

MIT
