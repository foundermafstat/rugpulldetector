import { Shield, AlertTriangle, Key, DollarSign, PhoneCall, Grip, Fingerprint, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function Detectors() {
  const detectors = [
    {
      id: "backdoor",
      name: "Backdoor Detector",
      description: "Identifies hidden mechanisms that allow unauthorized contract access and control.",
      icon: <Shield className="h-8 w-8 text-red-500" />,
      examples: ["Hidden ownership control", "Emergency access controls", "Backdoor minting functions"],
      category: "Core",
      color: "bg-red-100 dark:bg-red-900/20"
    },
    {
      id: "privileged",
      name: "Privileged Functions",
      description: "Detects functions that give a central authority excessive control over the contract.",
      icon: <Key className="h-8 w-8 text-orange-500" />,
      examples: ["Centralized blacklisting", "Dynamic transaction limits", "Pausable transfers without timelock"],
      category: "Core",
      color: "bg-orange-100 dark:bg-orange-900/20"
    },
    {
      id: "tokenomics",
      name: "Tokenomics Manipulation",
      description: "Identifies mechanisms that can be used to manipulate token economics.",
      icon: <DollarSign className="h-8 w-8 text-yellow-500" />,
      examples: ["Arbitrary fee adjustment", "Dynamic tax/burn rates", "Centralized liquidity control"],
      category: "Core",
      color: "bg-yellow-100 dark:bg-yellow-900/20"
    },
    {
      id: "phishing",
      name: "Phishing Detector",
      description: "Detects deceptive mechanisms that can be used to trick users into harmful actions.",
      icon: <AlertTriangle className="h-8 w-8 text-purple-500" />,
      examples: ["Deceptive transaction flows", "Address spoofing vulnerabilities", "Misleading contract interfaces"],
      category: "Advanced",
      color: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      id: "approvals",
      name: "Approvals Detector",
      description: "Identifies malicious or risky approval mechanisms that could give attackers access to assets.",
      icon: <Grip className="h-8 w-8 text-blue-500" />,
      examples: ["Unrestricted token approvals", "Hidden approval flows", "Permanent approval risks"],
      category: "Advanced",
      color: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      id: "2fa",
      name: "2FA Security Detector",
      description: "Evaluates the implementation of two-factor authentication in critical operations.",
      icon: <Fingerprint className="h-8 w-8 text-green-500" />,
      examples: ["Missing secondary verification", "Vulnerable recovery mechanisms", "Authentication bypasses"],
      category: "Advanced",
      color: "bg-green-100 dark:bg-green-900/20"
    },
    {
      id: "mev",
      name: "MEV Protection Detector",
      description: "Detects vulnerabilities that could be exploited by miners or validators for profit extraction.",
      icon: <Zap className="h-8 w-8 text-pink-500" />,
      examples: ["Front-running vulnerabilities", "Time-dependent execution risks", "Sandwich attack vectors"],
      category: "Advanced",
      color: "bg-pink-100 dark:bg-pink-900/20"
    }
  ];

  const coreDetectors = detectors.filter(d => d.category === "Core");
  const advancedDetectors = detectors.filter(d => d.category === "Advanced");

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Smart Contract Vulnerability Detectors</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Our analysis engine uses specialized detectors to identify potential rugpull and security vulnerabilities in smart contracts.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Core Detectors</h2>
          <div className="grid gap-6">
            {coreDetectors.map(detector => (
              <Card key={detector.id} className={`overflow-hidden border ${detector.color}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">{detector.name}</CardTitle>
                    {detector.icon}
                  </div>
                  <CardDescription>{detector.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Detects:</h4>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {detector.examples.map((example, i) => (
                        <li key={i}>{example}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Advanced Detectors</h2>
          <div className="grid gap-6">
            {advancedDetectors.map(detector => (
              <Card key={detector.id} className={`overflow-hidden border ${detector.color}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">{detector.name}</CardTitle>
                    {detector.icon}
                  </div>
                  <CardDescription>{detector.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Detects:</h4>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {detector.examples.map((example, i) => (
                        <li key={i}>{example}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link href="/">
            <Button variant="default" className="bg-primary text-white">
              Analyze Your Contract
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}