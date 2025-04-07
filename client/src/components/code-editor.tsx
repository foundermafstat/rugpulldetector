import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLoadExample: () => void;
}

export default function CodeEditor({ code, onChange, onUpload, onLoadExample }: CodeEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <Label htmlFor="contractCode" className="block text-sm font-medium text-gray-700">
          Contract Code
        </Label>
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs px-2 py-1 h-auto"
            onClick={handleUploadClick}
          >
            Upload File
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".sol,.txt"
            onChange={onUpload}
          />
          <Button
            variant="outline"
            size="sm"
            className="text-xs px-2 py-1 h-auto ml-1"
            onClick={onLoadExample}
          >
            Example
          </Button>
        </div>
      </div>
      
      <div className="relative border border-gray-300 rounded-md overflow-hidden">
        <textarea
          id="contractCode"
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono text-xs bg-gray-800 text-white p-4 h-64 w-full resize-none"
          placeholder="Enter Solidity smart contract code here..."
        />
      </div>
    </div>
  );
}
