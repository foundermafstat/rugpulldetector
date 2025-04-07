import { ShieldAlert } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/">
              <a className="flex items-center space-x-2">
                <ShieldAlert className="h-6 w-6 text-secondary" />
                <span className="font-semibold">RugPull Detector</span>
              </a>
            </Link>
            <p className="text-sm text-gray-300 mt-1">Secure your blockchain future</p>
          </div>
          
          <div className="flex space-x-8">
            <div>
              <h4 className="font-medium mb-2 text-sm">Resources</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li><Link href="/documentation"><a className="hover:text-white">Documentation</a></Link></li>
                <li><a href="#" className="hover:text-white">API Reference</a></li>
                <li><a href="#" className="hover:text-white">Security Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 text-sm">Company</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-4 text-sm text-gray-400 text-center">
          <p>&copy; {new Date().getFullYear()} RugPull Detector. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
