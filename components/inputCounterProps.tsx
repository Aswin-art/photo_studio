import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface InputCounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const InputCounter = ({ 
  value, 
  onChange, 
  min = 0, 
  max = 99 
}: InputCounterProps) => {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDecrement}
        className="h-8 w-8 rounded-lg hover:bg-gray-100"
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <div className="w-8 text-center">
        <input
          type="text"
          className="text-lg font-medium bg-transparent border-0 w-8 text-center outline-none"
          value={value}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (/^\d*$/.test(inputValue)) {
              onChange(Number(inputValue));
            }
          }}
        />
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleIncrement}
        className="h-8 w-8 rounded-lg hover:bg-gray-100"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default InputCounter;