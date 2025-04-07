import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { injected } from 'wagmi/connectors'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Shortened address display: 0x1234...5678
const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { connect, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()
  const [mounted, setMounted] = useState(false)

  // This is to avoid hydration errors with SSR
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="border-primary/20">
            {ensName || formatAddress(address)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => window.open(`https://sepolia.etherscan.io/address/${address}`, '_blank')}
          >
            View on Explorer
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(address)
            }}
          >
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={() => disconnect()}
          >
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button 
      variant="destructive" 
      onClick={() => connect({ connector: injected() })}
      disabled={isConnecting}
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        'Connect Wallet'
      )}
    </Button>
  )
}