import { useEffect, useState } from 'react'
import { createConfig, WagmiConfig } from 'wagmi'
import { sepolia } from 'viem/chains'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { http } from 'viem'
import { injected } from 'wagmi/connectors'
import { useTheme } from '@/components/theme-provider'

// Project ID from WalletConnect Cloud 
const projectId = '7d68f222d741b77b43e6aa29c2c494df'

// Set up wagmi config with Sepolia testnet
const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
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
  defaultChain: sepolia,
  chainImages: {
    [sepolia.id]: '/sepolia-logo.png', // This will fall back to default if image not available
  },
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