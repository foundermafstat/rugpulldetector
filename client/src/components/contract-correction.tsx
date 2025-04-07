import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { Check, Wand2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useMutation } from '@tanstack/react-query'
import { apiRequest } from '@/lib/queryClient'
import { useAccount } from 'wagmi'
import { Vulnerability } from '@shared/schema'

interface ContractCorrectionProps {
  contractCode: string
  vulnerabilities: Vulnerability[]
  onCodeCorrected: (newCode: string) => void
}

export function ContractCorrection({ 
  contractCode, 
  vulnerabilities, 
  onCodeCorrected 
}: ContractCorrectionProps) {
  const [open, setOpen] = useState(false)
  const [purchaseComplete, setPurchaseComplete] = useState(false)
  const { toast } = useToast()
  const { isConnected } = useAccount()

  // This would normally call an API to fix the contract
  const correctMutation = useMutation({
    mutationFn: async () => {
      // Simulate the API call with a delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // This would be real API call in production
      // const res = await apiRequest('POST', '/api/correct-contract', {
      //   contractCode,
      //   vulnerabilities: vulnerabilities.map(v => v.id)
      // })
      // return res.json()
      
      // For demo, we'll just do a simple fix - replace critical vulnerabilities
      let correctedCode = contractCode
      
      // Remove risky functions and add safe alternatives
      if (vulnerabilities.some(v => v.name.includes('Self-Destruct'))) {
        correctedCode = correctedCode.replace(
          /selfdestruct\s*\(\s*[^)]*\s*\)|suicide\s*\(\s*[^)]*\s*\)/g,
          '// Removed unsafe selfdestruct function'
        )
      }
      
      if (vulnerabilities.some(v => v.name.includes('Hidden Ownership'))) {
        correctedCode = correctedCode.replace(
          /address\s+private\s+_\w*[oO]wner\w*;|address\s+private\s+\w*[oO]wner\w*;/g,
          '// Using OpenZeppelin Ownable instead\naddress public owner;'
        )
        
        // Add safe ownership transfer functions
        if (!correctedCode.includes('transferOwnership')) {
          correctedCode += '\n\n// Safe ownership transfer with timelock\nfunction transferOwnership(address newOwner) public {\n    require(msg.sender == owner, "Not the owner");\n    require(newOwner != address(0), "New owner cannot be zero address");\n    emit OwnershipTransferInitiated(owner, newOwner);\n    pendingOwner = newOwner;\n    ownershipTransferTime = block.timestamp + 2 days;\n}\n\nfunction acceptOwnership() public {\n    require(msg.sender == pendingOwner, "Not the pending owner");\n    require(block.timestamp >= ownershipTransferTime, "Timelock not expired");\n    emit OwnershipTransferred(owner, pendingOwner);\n    owner = pendingOwner;\n    pendingOwner = address(0);\n}'
        }
      }
      
      if (vulnerabilities.some(v => v.name.includes('Arbitrary Fee'))) {
        correctedCode = correctedCode.replace(
          /function\s+set\w*[fF]ee\w*\([^)]*\)[^{]*{[^}]*\}/g,
          'function setFee(uint256 newFee) external onlyOwner {\n    require(newFee <= 500, "Fee cannot exceed 5%");\n    emit FeeChanged(fee, newFee);\n    fee = newFee;\n}'
        )
      }
      
      return { correctedCode }
    },
    onSuccess: (data) => {
      setPurchaseComplete(true)
      onCodeCorrected(data.correctedCode)
      toast({
        title: 'Contract Corrected',
        description: 'Your contract has been updated with secure implementations',
        variant: 'default'
      })
    },
    onError: (error) => {
      toast({
        title: 'Correction Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      })
    }
  })
  
  const handlePurchase = () => {
    if (!isConnected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to proceed with the purchase',
        variant: 'destructive'
      })
      return
    }
    
    // In a real app, this would initiate a blockchain transaction
    correctMutation.mutate()
  }
  
  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="bg-gradient-to-r from-secondary to-primary hover:from-primary/90 hover:to-secondary/90 text-white"
        disabled={vulnerabilities.length === 0}
      >
        <Wand2 className="mr-2 h-4 w-4" />
        Auto-Fix Vulnerabilities
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{purchaseComplete ? 'Contract Fixed!' : 'Fix Contract Vulnerabilities'}</DialogTitle>
            <DialogDescription>
              {purchaseComplete 
                ? 'Your contract code has been updated with secure implementations'
                : 'Get professional fixes for all detected vulnerabilities'}
            </DialogDescription>
          </DialogHeader>
          
          {!purchaseComplete ? (
            <>
              <div className="grid gap-4 py-4">
                <div className="space-y-4">
                  <div className="pricing-card">
                    <h3 className="font-medium text-lg mb-2">Smart Contract Repair</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Our AI will fix all detected vulnerabilities in your contract with secure implementations
                    </p>
                    
                    <ul className="space-y-2 mb-6">
                      {vulnerabilities.map((v, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <Check className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                          <span>Fix <span className="font-medium">{v.name}</span></span>
                        </li>
                      ))}
                      <li className="flex items-start text-sm">
                        <Check className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                        <span>Add proper documentation</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <Check className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                        <span>Optimize gas usage</span>
                      </li>
                    </ul>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold">0.05 ETH</p>
                        <p className="text-xs text-muted-foreground">One-time payment</p>
                      </div>
                      <Button 
                        className="bg-primary hover:bg-primary/90" 
                        onClick={handlePurchase}
                        disabled={correctMutation.isPending}
                      >
                        {correctMutation.isPending ? (
                          <>Processing...</>
                        ) : (
                          <>Purchase Fix</>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-6 flex flex-col items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-center text-muted-foreground">
                Your contract has been fixed successfully! The updated code is now available in the editor.
              </p>
            </div>
          )}
          
          <DialogFooter>
            {purchaseComplete ? (
              <Button onClick={() => {
                setOpen(false)
                setPurchaseComplete(false)
              }}>
                Close
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}