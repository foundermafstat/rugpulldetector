import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, AlertTriangle, BarChart2, Code, Wallet, ShieldCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Documentation() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">Documentation</h1>
        <p className="text-muted-foreground text-lg">
          Learn how to use RugScan to identify and prevent smart contract vulnerabilities
        </p>
        <Separator className="mt-6" />
      </div>

      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8 w-full justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vulnerabilities">Vulnerability Types</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="api">API Access</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">What is RugScan?</CardTitle>
                <CardDescription>Smart contract security for investors and developers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  RugScan is a specialized analysis tool built on the Ironblocks security framework, designed to help developers and investors identify potential vulnerabilities in Ethereum smart contracts, with a focus on detecting features that could enable rugpulls - a type of exit scam where developers abandon a project and run away with investor funds.
                </p>
                <p>
                  Our analysis engine scans Solidity code for common patterns associated with rugpulls, including backdoor mechanisms, excessive owner privileges, and tokenomics manipulation capabilities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">How to Use the Tool</CardTitle>
                <CardDescription>Simple steps to analyze your contracts</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-3 ml-2">
                  <li className="pl-2">Input your contract's Solidity code in the editor or upload a file</li>
                  <li className="pl-2">Select the vulnerability types you want to scan for</li>
                  <li className="pl-2">Connect your Ethereum wallet to enable contract repair features</li>
                  <li className="pl-2">Click "Analyze Contract" to begin the analysis</li>
                  <li className="pl-2">Review the detailed results showing any detected vulnerabilities</li>
                  <li className="pl-2">Optionally use the contract repair feature to automatically fix issues</li>
                </ol>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vulnerabilities" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="mb-2 rounded-full bg-red-100 dark:bg-red-900/20 w-10 h-10 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                  </div>
                  <CardTitle>Backdoor Mechanisms</CardTitle>
                  <CardDescription>Hidden control capabilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Hidden features that allow contract developers to maintain unauthorized control:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>Hidden admin addresses</li>
                    <li>Secondary owner functions</li>
                    <li>Secret minting capabilities</li>
                    <li>Self-destruct mechanisms</li>
                    <li>Obfuscated proxy implementations</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="mb-2 rounded-full bg-amber-100 dark:bg-amber-900/20 w-10 h-10 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                  </div>
                  <CardTitle>Privileged Functions</CardTitle>
                  <CardDescription>Excessive owner controls</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Functions giving excessive control over assets or operation:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>Blacklisting without timelocks</li>
                    <li>Fee adjustments without caps</li>
                    <li>Trading pausing mechanisms</li>
                    <li>Unlimited withdrawal functions</li>
                    <li>Lack of multi-signature security</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="mb-2 rounded-full bg-blue-100 dark:bg-blue-900/20 w-10 h-10 flex items-center justify-center">
                    <BarChart2 className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                  </div>
                  <CardTitle>Tokenomics Manipulation</CardTitle>
                  <CardDescription>Control over token economy</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Features allowing control over supply, value, or liquidity:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>Unlimited minting capabilities</li>
                    <li>Arbitrary transaction limits</li>
                    <li>Dynamic tax/fee/burn rates</li>
                    <li>Liquidity removal without locks</li>
                    <li>Supply manipulation functions</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="mb-2 rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center">
                    <Code className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>AI-Powered Contract Repair</CardTitle>
                  <CardDescription>Automatic vulnerability fixing</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Our advanced AI engine can automatically fix detected vulnerabilities in your smart contract, providing you with a clean, secure version. The AI analyzes the identified issues and generates proper fixes while maintaining the original contract's functionality.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="mb-2 rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Web3 Wallet Integration</CardTitle>
                  <CardDescription>Seamless blockchain connection</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Connect your MetaMask or other Web3 wallet to access premium features like contract repair. Our Sepolia testnet integration lets you securely sign transactions without dealing with mainnet gas fees, making the experience smooth and cost-effective.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="mb-2 rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Deep Scanning</CardTitle>
                  <CardDescription>Comprehensive security analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Our deep scanning feature enables thorough code analysis, including cross-function flows, complex vulnerability patterns, and inheritance security issues. This comprehensive approach identifies subtle vulnerabilities that might be missed by standard scanners.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">API Documentation</CardTitle>
                <CardDescription>Programmatically access vulnerability scanning</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6">
                  Our API allows you to integrate RugScan's analysis capabilities into your own applications. The API is RESTful and returns JSON responses.
                </p>
                
                <h3 className="text-lg font-medium mb-4">Endpoints</h3>
                
                <div className="space-y-6">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted p-4 border-b">
                      <h4 className="font-bold">POST /api/analyze</h4>
                      <p className="text-sm text-muted-foreground mt-1">Analyze a smart contract for vulnerabilities</p>
                    </div>
                    <div className="p-4">
                      <h5 className="font-medium">Request Body:</h5>
                      <pre className="mt-2 p-4 bg-muted rounded-md overflow-x-auto text-xs font-mono">
{`{
  "contractCode": "contract Example { ... }",
  "contractName": "Example", // optional
  "options": {
    "detectBackdoors": true,
    "detectPrivileged": true,
    "detectTokenomics": true,
    "deepScan": false
  }
}`}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted p-4 border-b">
                      <h4 className="font-bold">GET /api/analysis/:id</h4>
                      <p className="text-sm text-muted-foreground mt-1">Retrieve results of a previous analysis</p>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted p-4 border-b">
                      <h4 className="font-bold">GET /api/examples/contract</h4>
                      <p className="text-sm text-muted-foreground mt-1">Get an example vulnerable contract</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
                <CardDescription>Common questions about RugScan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Is the analysis 100% accurate?</h3>
                  <p className="text-muted-foreground mt-2">
                    No analysis tool can guarantee 100% accuracy. RugScan uses pattern matching and static analysis to identify suspicious patterns, but some false positives or false negatives may occur. We recommend using this tool as part of a comprehensive security review.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium">Can RugScan analyze any contract?</h3>
                  <p className="text-muted-foreground mt-2">
                    The tool is optimized for ERC20 token contracts and focuses on rugpull-specific vulnerabilities. While it can analyze other contract types, the results may be less relevant for non-token contracts.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium">How does the deep scan option work?</h3>
                  <p className="text-muted-foreground mt-2">
                    Deep scanning enables additional checks that may take longer to process. These include more complex pattern analysis, cross-function checks, and additional tokenomics vulnerabilities that require more processing power to detect.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium">Is my contract code kept private?</h3>
                  <p className="text-muted-foreground mt-2">
                    We do not store your contract code beyond what is necessary for analysis. Analysis results are stored temporarily but can be deleted upon request. For completely private analysis, consider using our API with your own infrastructure.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium">Do I need to pay for contract repair?</h3>
                  <p className="text-muted-foreground mt-2">
                    Yes, the AI-powered contract repair feature is a premium service that requires payment in testnet ETH. This simulates the real-world cost while allowing you to test the service without spending real funds. Connect your wallet to the Sepolia testnet to use this feature.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
