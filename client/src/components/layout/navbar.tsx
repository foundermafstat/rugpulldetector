import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <a className="flex items-center space-x-2">
            <ShieldAlert className="h-8 w-8 text-secondary" />
            <h1 className="text-xl font-bold">RugPull Detector</h1>
          </a>
        </Link>
        
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/documentation">
            <a className="hover:text-gray-300">Documentation</a>
          </Link>
          <a href="#" className="hover:text-gray-300">API</a>
          <Button variant="destructive" className="bg-secondary hover:bg-opacity-90">
            Sign In
          </Button>
        </div>
        
        <button 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 py-2 bg-primary border-t border-gray-700">
          <Link href="/documentation">
            <a className="block py-2 hover:text-gray-300">Documentation</a>
          </Link>
          <a href="#" className="block py-2 hover:text-gray-300">API</a>
          <Button variant="destructive" className="mt-2 w-full bg-secondary hover:bg-opacity-90">
            Sign In
          </Button>
        </div>
      )}
    </nav>
  );
}
