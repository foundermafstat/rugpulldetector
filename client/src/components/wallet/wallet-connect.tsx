import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useEnsName, useChainId, useSwitchChain } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Loader2, Wallet, ExternalLink, Copy, LogOut, SwitchCamera } from 'lucide-react'
import { injected } from 'wagmi/connectors'
import { sepolia } from 'viem/chains'
import { holesky } from './web3-provider'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// Shortened address display: 0x1234...5678
const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { connect, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain()
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  // This is to avoid hydration errors with SSR
  useEffect(() => {
    setMounted(true)
  }, [])

  // Helper to determine if connected to Holesky
  const isHolesky = chainId === holesky.id
  const isSupported = isHolesky || chainId === sepolia.id

  // Get current chain details for display
  const getCurrentChainDetails = () => {
    if (isHolesky) {
      return {
        name: 'Holesky',
        explorerUrl: `https://holesky.etherscan.io/address/${address}`,
        badgeClasses: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      }
    } else if (chainId === sepolia.id) {
      return {
        name: 'Sepolia',
        explorerUrl: `https://sepolia.etherscan.io/address/${address}`,
        badgeClasses: 'bg-green-500/10 text-green-500 border-green-500/20',
      }
    } else {
      return {
        name: 'Unsupported',
        explorerUrl: `https://etherscan.io/address/${address}`,
        badgeClasses: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      }
    }
  }

  const chainDetails = getCurrentChainDetails()

  if (!mounted) return null

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="border-primary/20 bg-primary/5 hover:bg-primary/10">
            <Badge variant="outline" className="rounded-md px-2 py-0 mr-2 whitespace-nowrap" 
              style={{ 
                backgroundColor: isSupported ? 'var(--bg-opacity-10)' : 'rgba(255, 165, 0, 0.1)',
                color: isSupported ? 'var(--accent-text)' : 'orange',
                borderColor: isSupported ? 'var(--accent-border)' : 'rgba(255, 165, 0, 0.3)'
              }}
            >
              {chainDetails.name}
            </Badge>
            {ensName || formatAddress(address)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex items-center">
            <Wallet className="h-4 w-4 mr-2 opacity-70" />
            Connected Wallet
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Networks
          </DropdownMenuLabel>
          
          <DropdownMenuItem
            className="cursor-pointer flex items-center justify-between"
            onClick={() => {
              if (chainId !== holesky.id) {
                switchChain({ chainId: holesky.id })
              }
            }}
            disabled={isSwitchingChain || chainId === holesky.id}
          >
            <div className="flex items-center">
              <SwitchCamera className="h-4 w-4 mr-2 opacity-70" />
              Holesky Testnet
            </div>
            {chainId === holesky.id && (
              <Badge variant="outline" className="ml-2 bg-blue-500/10 text-blue-500 border-blue-500/20">
                Active
              </Badge>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuItem
            className="cursor-pointer flex items-center justify-between"
            onClick={() => {
              if (chainId !== sepolia.id) {
                switchChain({ chainId: sepolia.id })
              }
            }}
            disabled={isSwitchingChain || chainId === sepolia.id}
          >
            <div className="flex items-center">
              <SwitchCamera className="h-4 w-4 mr-2 opacity-70" />
              Sepolia Testnet
            </div>
            {chainId === sepolia.id && (
              <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 border-green-500/20">
                Active
              </Badge>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            className="cursor-pointer flex items-center"
            onClick={() => window.open(chainDetails.explorerUrl, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2 opacity-70" />
            View on Etherscan
          </DropdownMenuItem>
          
          <DropdownMenuItem
            className="cursor-pointer flex items-center"
            onClick={() => {
              navigator.clipboard.writeText(address)
              toast({
                title: "Address Copied",
                description: "Wallet address copied to clipboard",
              })
            }}
          >
            <Copy className="h-4 w-4 mr-2 opacity-70" />
            Copy Address
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="cursor-pointer text-destructive focus:text-destructive flex items-center"
            onClick={() => disconnect()}
          >
            <LogOut className="h-4 w-4 mr-2 opacity-70" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button 
      variant="default" 
      onClick={() => connect({ connector: injected() })}
      disabled={isConnecting}
      className="bg-primary hover:bg-primary/90"
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  )
}