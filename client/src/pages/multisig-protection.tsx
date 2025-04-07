import { Shield, AlertTriangle, KeyRound, Users, UserCheck, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

export default function MultisigProtection() {
  // Sample vulnerable code for multisig risks
  const vulnerableCode = `pragma solidity ^0.8.0;

contract VulnerableMultisigWallet {
    address[] public owners;
    uint256 public requiredSignatures;
    mapping(address => bool) public isOwner;
    mapping(bytes32 => mapping(address => bool)) public confirmations;
    
    constructor(address[] memory _owners, uint256 _requiredSignatures) {
        require(_owners.length > 0);
        require(_requiredSignatures > 0);
        require(_requiredSignatures <= _owners.length);
        
        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0));
            require(!isOwner[owner]);
            isOwner[owner] = true;
            owners.push(owner);
        }
        
        requiredSignatures = _requiredSignatures;
    }
    
    // VULNERABLE: No protection against frontrunning
    function submitTransaction(address destination, uint256 value, bytes memory data) public returns (bytes32 transactionId) {
        transactionId = keccak256(abi.encodePacked(destination, value, data, block.timestamp));
        confirmations[transactionId][msg.sender] = true;
        return transactionId;
    }
    
    // VULNERABLE: No time-lock mechanism
    function executeTransaction(bytes32 transactionId, address destination, uint256 value, bytes memory data) public {
        require(isConfirmed(transactionId));
        (bool success, ) = destination.call{value: value}(data);
        require(success, "Transaction execution failed");
    }
    
    function confirmTransaction(bytes32 transactionId) public {
        require(isOwner[msg.sender]);
        confirmations[transactionId][msg.sender] = true;
    }
    
    function isConfirmed(bytes32 transactionId) public view returns (bool) {
        uint256 count = 0;
        for (uint256 i = 0; i < owners.length; i++) {
            if (confirmations[transactionId][owners[i]])
                count++;
            if (count >= requiredSignatures)
                return true;
        }
        return false;
    }
}`;

  // Sample secure code for multisig implementation
  const secureCode = `pragma solidity ^0.8.0;

contract SecureMultisigWallet {
    address[] public owners;
    uint256 public requiredSignatures;
    mapping(address => bool) public isOwner;
    mapping(bytes32 => mapping(address => bool)) public confirmations;
    mapping(bytes32 => bool) public transactionExecuted;
    mapping(bytes32 => uint256) public transactionSubmitTime;
    
    uint256 public constant TIMELOCK_DURATION = 24 hours;
    
    event TransactionSubmitted(bytes32 indexed transactionId, address submitter);
    event TransactionConfirmed(bytes32 indexed transactionId, address confirmer);
    event TransactionExecuted(bytes32 indexed transactionId, address executor);
    
    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not an owner");
        _;
    }
    
    modifier transactionExists(bytes32 _transactionId) {
        require(transactionSubmitTime[_transactionId] > 0, "Transaction does not exist");
        _;
    }
    
    modifier notExecuted(bytes32 _transactionId) {
        require(!transactionExecuted[_transactionId], "Transaction already executed");
        _;
    }
    
    constructor(address[] memory _owners, uint256 _requiredSignatures) {
        require(_owners.length > 0, "Owners required");
        require(_requiredSignatures > 0, "Required signatures cannot be zero");
        require(_requiredSignatures <= _owners.length, "Required signatures exceeds owners");
        
        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Invalid owner");
            require(!isOwner[owner], "Duplicate owner");
            isOwner[owner] = true;
            owners.push(owner);
        }
        
        requiredSignatures = _requiredSignatures;
    }
    
    // Secure: Uses commit-reveal pattern to prevent frontrunning
    function submitTransaction(
        address destination, 
        uint256 value, 
        bytes memory data,
        bytes32 salt // Salt to prevent transaction hash prediction
    ) public onlyOwner returns (bytes32 transactionId) {
        transactionId = keccak256(abi.encodePacked(destination, value, data, salt));
        require(transactionSubmitTime[transactionId] == 0, "Transaction already submitted");
        
        transactionSubmitTime[transactionId] = block.timestamp;
        confirmations[transactionId][msg.sender] = true;
        
        emit TransactionSubmitted(transactionId, msg.sender);
        return transactionId;
    }
    
    // Secure: Implements time-lock for execution
    function executeTransaction(
        bytes32 transactionId, 
        address destination, 
        uint256 value, 
        bytes memory data
    ) public onlyOwner transactionExists(transactionId) notExecuted(transactionId) {
        require(isConfirmed(transactionId), "Transaction not confirmed");
        require(block.timestamp >= transactionSubmitTime[transactionId] + TIMELOCK_DURATION,
            "Time lock period not passed");
        
        transactionExecuted[transactionId] = true;
        
        (bool success, ) = destination.call{value: value}(data);
        require(success, "Transaction execution failed");
        
        emit TransactionExecuted(transactionId, msg.sender);
    }
    
    function confirmTransaction(bytes32 transactionId) 
        public 
        onlyOwner 
        transactionExists(transactionId) 
        notExecuted(transactionId) 
    {
        require(!confirmations[transactionId][msg.sender], "Transaction already confirmed");
        confirmations[transactionId][msg.sender] = true;
        emit TransactionConfirmed(transactionId, msg.sender);
    }
    
    function isConfirmed(bytes32 transactionId) public view returns (bool) {
        uint256 count = 0;
        for (uint256 i = 0; i < owners.length; i++) {
            if (confirmations[transactionId][owners[i]])
                count++;
            if (count >= requiredSignatures)
                return true;
        }
        return false;
    }
    
    // Secure: Ability to revoke confirmation with proper verification
    function revokeConfirmation(bytes32 transactionId)
        public
        onlyOwner
        transactionExists(transactionId)
        notExecuted(transactionId)
    {
        require(confirmations[transactionId][msg.sender], "Transaction not confirmed");
        confirmations[transactionId][msg.sender] = false;
    }
}`;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start mb-6">
          <div className="mr-4">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Multisig Protection Detector</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Enhanced security analyzer for multisignature wallets, detecting unusual signing patterns and unauthorized execution attempts
            </p>
            <div className="flex items-center mt-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 mr-2">
                Advanced Detector
              </Badge>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                High Impact
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg font-semibold">
                <Shield className="h-5 w-5 mr-2 text-blue-500" />
                Security Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <UserCheck className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                  <span>Prevents transaction frontrunning attacks</span>
                </li>
                <li className="flex items-start">
                  <UserCheck className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                  <span>Identifies missing timelock mechanisms</span>
                </li>
                <li className="flex items-start">
                  <UserCheck className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                  <span>Detects signature replay vulnerabilities</span>
                </li>
                <li className="flex items-start">
                  <UserCheck className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                  <span>Validates owner management security</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg font-semibold">
                <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                Common Vulnerabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <FileWarning className="h-4 w-4 mr-2 mt-0.5 text-red-500" />
                  <span>Insufficient signer verification</span>
                </li>
                <li className="flex items-start">
                  <FileWarning className="h-4 w-4 mr-2 mt-0.5 text-red-500" />
                  <span>Lack of transaction timelock</span>
                </li>
                <li className="flex items-start">
                  <FileWarning className="h-4 w-4 mr-2 mt-0.5 text-red-500" />
                  <span>Vulnerable signature verification</span>
                </li>
                <li className="flex items-start">
                  <FileWarning className="h-4 w-4 mr-2 mt-0.5 text-red-500" />
                  <span>Insecure owner management</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg font-semibold">
                <KeyRound className="h-5 w-5 mr-2 text-purple-500" />
                Detection Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <Shield className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                  <span>Frontrunning vulnerability detection</span>
                </li>
                <li className="flex items-start">
                  <Shield className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                  <span>Timelock implementation verification</span>
                </li>
                <li className="flex items-start">
                  <Shield className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                  <span>Signature replay protection analysis</span>
                </li>
                <li className="flex items-start">
                  <Shield className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                  <span>Owner management security audit</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Multisig Security Analysis</h2>
          <p className="mb-6">
            Multisignature wallets provide an additional layer of security by requiring multiple signers to approve transactions.
            However, they introduce specific security concerns that need careful consideration. Our detector specializes in
            identifying these vulnerabilities through static analysis and runtime verification.
          </p>

          <Tabs defaultValue="vulnerable">
            <TabsList className="mb-4">
              <TabsTrigger value="vulnerable">Vulnerable Example</TabsTrigger>
              <TabsTrigger value="secure">Secure Implementation</TabsTrigger>
            </TabsList>
            <TabsContent value="vulnerable">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vulnerable Multisig Implementation</CardTitle>
                  <CardDescription>
                    This vulnerable multisig contract lacks essential security features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900 text-slate-50 p-4 rounded-md overflow-x-auto font-mono text-sm">
                    <pre>{vulnerableCode}</pre>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="text-sm text-red-500">
                    ⚠️ Contains multiple security vulnerabilities
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="secure">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Secure Multisig Implementation</CardTitle>
                  <CardDescription>
                    This implementation includes proper security measures to protect multisig operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900 text-slate-50 p-4 rounded-md overflow-x-auto font-mono text-sm">
                    <pre>{secureCode}</pre>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="text-sm text-green-500">
                    ✓ Implements recommended security practices
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <Separator className="my-8" />

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Vulnerability Detection Patterns</h2>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Transaction Frontrunning</CardTitle>
                <CardDescription>
                  Monitors for vulnerable transaction submission logic that enables transaction frontrunning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Detection Pattern:</h4>
                    <p className="bg-slate-100 dark:bg-slate-800 p-2 rounded font-mono text-xs">
                      keccak256(...block.timestamp...)
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Impact:</h4>
                    <p>
                      Attackers can predict and front-run transactions, potentially manipulating the
                      execution order to their advantage.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Recommendation:</h4>
                    <p>
                      Implement commit-reveal patterns with user-provided unique salts to prevent
                      transaction hash prediction.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Missing Timelock Protection</CardTitle>
                <CardDescription>
                  Identifies multisig implementations that lack time-based safety mechanisms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Detection Pattern:</h4>
                    <p className="bg-slate-100 dark:bg-slate-800 p-2 rounded font-mono text-xs">
                      function execute<span className="text-blue-500">Transaction</span>(...) {"{"} ... destination.call{"{"}<span className="text-green-500">value</span>: value{"}"}(data); ... {"}"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Impact:</h4>
                    <p>
                      Without a timelock, transactions can be executed immediately after confirmation,
                      preventing owners from reacting to suspicious activities.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Recommendation:</h4>
                    <p>
                      Implement a time delay between confirmation and execution to allow owners
                      to identify and respond to unauthorized confirmation attempts.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Insecure Owner Management</CardTitle>
                <CardDescription>
                  Scans for vulnerable methods of adding or removing multisig owners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Detection Pattern:</h4>
                    <p className="bg-slate-100 dark:bg-slate-800 p-2 rounded font-mono text-xs">
                      function add<span className="text-blue-500">Owner</span>(...) | function remove<span className="text-blue-500">Owner</span>(...) | function replace<span className="text-blue-500">Owner</span>(...)
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Impact:</h4>
                    <p>
                      Inadequate authorization checks on owner management functions can lead to
                      unauthorized addition or removal of signers.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Recommendation:</h4>
                    <p>
                      Require multiple signatures for owner management operations and implement 
                      timelock periods for such critical changes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center">
          <Link href="/">
            <Button variant="default" className="bg-primary text-white mr-4">
              Analyze Your Contract
            </Button>
          </Link>
          <Link href="/detectors">
            <Button variant="outline">
              View All Detectors
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}