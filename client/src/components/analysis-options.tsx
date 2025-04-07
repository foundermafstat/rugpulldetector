import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AnalysisOptionsProps {
  options: {
    detectBackdoors: boolean;
    detectPrivileged: boolean;
    detectTokenomics: boolean;
    deepScan: boolean;
  };
  onChange: (options: {
    detectBackdoors: boolean;
    detectPrivileged: boolean;
    detectTokenomics: boolean;
    deepScan: boolean;
  }) => void;
}

export default function AnalysisOptions({ options, onChange }: AnalysisOptionsProps) {
  const handleOptionChange = (option: keyof typeof options, checked: boolean) => {
    onChange({
      ...options,
      [option]: checked
    });
  };
  
  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <h4 className="font-medium text-sm mb-3">Analysis Options</h4>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <Checkbox 
            id="detectBackdoors" 
            checked={options.detectBackdoors}
            onCheckedChange={(checked) => 
              handleOptionChange('detectBackdoors', checked === true)
            }
            className="h-4 w-4 text-primary border-gray-300 rounded"
          />
          <Label 
            htmlFor="detectBackdoors" 
            className="ml-2 text-sm text-gray-700"
          >
            Detect backdoor mechanisms
          </Label>
        </div>
        
        <div className="flex items-center">
          <Checkbox 
            id="detectPrivileged" 
            checked={options.detectPrivileged}
            onCheckedChange={(checked) => 
              handleOptionChange('detectPrivileged', checked === true)
            }
            className="h-4 w-4 text-primary border-gray-300 rounded"
          />
          <Label 
            htmlFor="detectPrivileged" 
            className="ml-2 text-sm text-gray-700"
          >
            Detect privileged functions
          </Label>
        </div>
        
        <div className="flex items-center">
          <Checkbox 
            id="detectTokenomics" 
            checked={options.detectTokenomics}
            onCheckedChange={(checked) => 
              handleOptionChange('detectTokenomics', checked === true)
            }
            className="h-4 w-4 text-primary border-gray-300 rounded"
          />
          <Label 
            htmlFor="detectTokenomics" 
            className="ml-2 text-sm text-gray-700"
          >
            Detect tokenomics manipulation
          </Label>
        </div>
        
        <div className="flex items-center">
          <Checkbox 
            id="deepScan" 
            checked={options.deepScan}
            onCheckedChange={(checked) => 
              handleOptionChange('deepScan', checked === true)
            }
            className="h-4 w-4 text-primary border-gray-300 rounded"
          />
          <Label 
            htmlFor="deepScan" 
            className="ml-2 text-sm text-gray-700"
          >
            Deep scan (takes longer)
          </Label>
        </div>
      </div>
    </div>
  );
}
