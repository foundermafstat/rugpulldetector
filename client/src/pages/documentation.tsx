import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, AlertTriangle, BarChart2 } from "lucide-react";

export default function Documentation() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Documentation</h1>
      <p className="text-gray-600 mb-8">Learn how to use the RugPull Detector to analyze your smart contracts</p>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerability Types</TabsTrigger>
          <TabsTrigger value="api">API Access</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>What is RugPull Detector?</CardTitle>
              <CardDescription>A tool for analyzing smart contract vulnerabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                RugPull Detector is a specialized analysis tool designed to help developers and investors identify potential vulnerabilities in Ethereum smart contracts, with a focus on detecting features that could enable rugpulls - a type of exit scam where developers abandon a project and run away with investor funds.
              </p>
              <p>
                Our analysis engine scans Solidity code for common patterns associated with rugpulls, including backdoor mechanisms, excessive owner privileges, and tokenomics manipulation capabilities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How to Use the Tool</CardTitle>
              <CardDescription>Simple steps to analyze your contracts</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2">
                <li>Input your contract's Solidity code in the editor or upload a file</li>
                <li>Optionally specify a contract address to fetch verified code from Etherscan</li>
                <li>Select the vulnerability types you want to scan for</li>
                <li>Click "Analyze Contract" to begin the analysis</li>
                <li>Review the results showing any detected vulnerabilities</li>
                <li>Examine the detailed recommendations for fixing issues</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vulnerabilities" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-secondary" />
                <div>
                  <CardTitle>Backdoor Mechanisms</CardTitle>
                  <CardDescription>Hidden control capabilities</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Backdoor mechanisms are hidden features that allow the contract developer to maintain control over the contract's operation outside the normal governance process. These often include:
                </p>
                <ul className="list-disc list-inside mt-2 text-sm">
                  <li>Hidden admin addresses</li>
                  <li>Secondary owner functions</li>
                  <li>Secret minting capabilities</li>
                  <li>Self-destruct mechanisms</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <div>
                  <CardTitle>Privileged Functions</CardTitle>
                  <CardDescription>Excessive owner controls</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Privileged functions give contract owners excessive control over user assets or contract operation. These include:
                </p>
                <ul className="list-disc list-inside mt-2 text-sm">
                  <li>User blacklisting without timelocks</li>
                  <li>Fee/tax adjustments without caps</li>
                  <li>Ability to pause trading indefinitely</li>
                  <li>Withdrawal functions without limits</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-x-2">
                <BarChart2 className="h-5 w-5 text-yellow-500" />
                <div>
                  <CardTitle>Tokenomics Manipulation</CardTitle>
                  <CardDescription>Control over token economy</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Tokenomics manipulation capabilities allow developers to control token supply, value, or liquidity in potentially harmful ways:
                </p>
                <ul className="list-disc list-inside mt-2 text-sm">
                  <li>Unlimited minting functions</li>
                  <li>Arbitrary transaction limits</li>
                  <li>Dynamic tax/fee/burn rates</li>
                  <li>Liquidity removal without restrictions</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>Programmatically access vulnerability scanning</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Our API allows you to integrate RugPull Detector's analysis capabilities into your own applications. The API is RESTful and returns JSON responses.
              </p>
              
              <h3 className="text-lg font-medium mt-4 mb-2">Endpoints</h3>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h4 className="font-bold">POST /api/analyze</h4>
                  <p className="text-sm mt-1">Analyze a smart contract for vulnerabilities</p>
                  <h5 className="font-medium mt-2">Request Body:</h5>
                  <pre className="bg-gray-100 p-2 rounded mt-1 text-xs font-mono">
{`{
  "contractCode": "contract Example { ... }",
  "contractName": "Example", // optional
  "contractAddress": "0x...", // optional
  "options": {
    "detectBackdoors": true,
    "detectPrivileged": true,
    "detectTokenomics": true,
    "deepScan": false
  }
}`}
                  </pre>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="font-bold">GET /api/analysis/:id</h4>
                  <p className="text-sm mt-1">Retrieve results of a previous analysis</p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="font-bold">GET /api/examples/contract</h4>
                  <p className="text-sm mt-1">Get an example vulnerable contract</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Is the analysis 100% accurate?</h3>
                <p className="text-sm mt-1">
                  No analysis tool can guarantee 100% accuracy. RugPull Detector uses pattern matching and static analysis to identify suspicious patterns, but some false positives or false negatives may occur. We recommend using this tool as part of a comprehensive security review.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Can RugPull Detector analyze any contract?</h3>
                <p className="text-sm mt-1">
                  The tool is optimized for ERC20 token contracts and focuses on rugpull-specific vulnerabilities. While it can analyze other contract types, the results may be less relevant for non-token contracts.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">How does the deep scan option work?</h3>
                <p className="text-sm mt-1">
                  Deep scanning enables additional checks that may take longer to process. These include more complex pattern analysis, cross-function checks, and additional tokenomics vulnerabilities that require more processing power to detect.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Is my contract code kept private?</h3>
                <p className="text-sm mt-1">
                  We do not store your contract code beyond what is necessary for analysis. Analysis results are stored temporarily but can be deleted upon request. For completely private analysis, consider using our API with your own infrastructure.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
