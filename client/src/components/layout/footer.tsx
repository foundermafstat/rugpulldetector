import { ShieldAlert } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center space-x-2">
                <ShieldAlert className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">RugScan</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              Secure your blockchain investments by identifying and avoiding contracts with rugpull vulnerabilities.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold mb-3">Resources</h3>
              <ul className="text-sm space-y-2">
                <li><Link href="/documentation" className="text-muted-foreground hover:text-primary transition-colors">Documentation</Link></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">API Reference</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Security Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-3">Company</h3>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-sm text-muted-foreground text-center">
          <p>&copy; {new Date().getFullYear()} RugScan. All rights reserved.</p>
          <p className="mt-1 text-xs">Powered by the Ironblocks security framework</p>
        </div>
      </div>
    </footer>
  );
}
