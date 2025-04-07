import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeSwitch } from "./theme-switch";
import { WalletConnect } from "@/components/wallet/wallet-connect";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  if (!mounted) return null;

  return (
    <header 
      className={`sticky top-0 z-40 w-full border-b bg-background transition-all ${
        scrolled ? "border-border shadow-sm" : "border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
            <ShieldAlert className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              RugScan
            </h1>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
          </Link>
          <Link href="/detectors" className="text-sm font-medium transition-colors hover:text-primary">
              Detectors
          </Link>
          <Link href="/documentation" className="text-sm font-medium transition-colors hover:text-primary">
              Documentation
          </Link>
          
          <div className="flex items-center space-x-4">
            <ThemeSwitch />
            <WalletConnect />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 md:hidden">
          <ThemeSwitch />
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 py-4 border-t">
          <div className="flex flex-col space-y-3">
            <Link href="/" className="py-2 hover:text-primary">
              Home
            </Link>
            <Link href="/detectors" className="py-2 hover:text-primary">
              Detectors
            </Link>
            <Link href="/documentation" className="py-2 hover:text-primary">
              Documentation
            </Link>
            
            <div className="pt-2">
              <WalletConnect />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
