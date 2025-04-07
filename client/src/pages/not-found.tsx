import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4">
      <div className="rounded-full bg-primary/10 p-6 mb-6">
        <ShieldAlert className="h-16 w-16 text-primary" />
      </div>
      <h1 className="text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        The contract you're looking for might have been removed or is temporarily
        unavailable. Try checking for security vulnerabilities on another contract.
      </p>
      <Link href="/">
        <Button size="lg" className="gap-2">
          Return to Contract Scanner
        </Button>
      </Link>
    </div>
  );
}
