import { useEffect, useState } from 'react'
import { createConfig, WagmiConfig } from 'wagmi'
import { sepolia } from 'viem/chains'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { http } from 'viem'
import { injected } from 'wagmi/connectors'

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

// Initialize Web3Modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: 'dark',
  featuredWalletIds: [],
  enableAnalytics: false,
  defaultChain: sepolia,
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <WagmiConfig config={config}>
      {mounted && children}
    </WagmiConfig>
  )
}