import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Loader2, Wallet, ExternalLink, Copy, LogOut } from 'lucide-react'
import { injected } from 'wagmi/connectors'
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
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  // This is to avoid hydration errors with SSR
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="border-primary/20 bg-primary/5 hover:bg-primary/10">
            <Badge variant="outline" className="rounded-md px-2 py-0 mr-2 bg-green-500/10 text-green-500 border-green-500/20">
              Sepolia
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
          <DropdownMenuItem
            className="cursor-pointer flex items-center"
            onClick={() => window.open(`https://sepolia.etherscan.io/address/${address}`, '_blank')}
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