import { useEffect, useState } from 'react'
import { createConfig, WagmiConfig } from 'wagmi'
import { sepolia as viemSepolia } from 'viem/chains'
export const sepolia = viemSepolia
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { http } from 'viem'
import { injected } from 'wagmi/connectors'
import { useTheme } from '@/components/theme-provider'
import { Chain, defineChain } from 'viem'

// Project ID from WalletConnect Cloud 
const projectId = '7d68f222d741b77b43e6aa29c2c494df'

// Define Holesky Testnet chain
export const holesky = defineChain({
  id: 17000,
  name: 'Holesky',
  nativeCurrency: {
    decimals: 18,
    name: 'Holesky Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://ethereum-holesky.publicnode.com'],
    },
    public: {
      http: ['https://ethereum-holesky.publicnode.com'],
    },
  },
  blockExplorers: {
    default: { 
      name: 'Etherscan', 
      url: 'https://holesky.etherscan.io'
    },
  },
  testnet: true,
})

// Set up wagmi config with Sepolia and Holesky testnets
const config = createConfig({
  chains: [sepolia, holesky],
  transports: {
    [sepolia.id]: http(),
    [holesky.id]: http(),
  },
  connectors: [
    injected()
  ],
})

// Initialize Web3Modal with default settings
// Theme mode will be updated in the provider component
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: 'light',
  featuredWalletIds: [],
  enableAnalytics: false,
  defaultChain: holesky, // Set Holesky as default
  chainImages: {
    [sepolia.id]: '/sepolia-logo.png', // This will fall back to default if image not available
    [holesky.id]: '/holesky-logo.png', // This will fall back to default if image not available
  },
  includeWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
    'ecc4036f814562b41a5268adc86270fba1365471402006302e70169465b7ac18', // Coinbase Wallet
  ],
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  
  // Update Web3Modal theme when app theme changes
  useEffect(() => {
    if (mounted) {
      const web3Modal = document.querySelector('w3m-modal');
      if (web3Modal) {
        // Set theme based on application theme
        if (theme === 'dark') {
          web3Modal.setAttribute('thememode', 'dark');
        } else if (theme === 'light') {
          web3Modal.setAttribute('thememode', 'light');
        } else {
          // For 'system', detect preferred color scheme
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          web3Modal.setAttribute('thememode', prefersDark ? 'dark' : 'light');
        }
      }
    }
  }, [theme, mounted]);

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <WagmiConfig config={config}>
      {mounted && children}
    </WagmiConfig>
  )
}