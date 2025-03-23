import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";

interface FormActionsProps {
  currentSection: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isValid?: boolean;
  isLastSection?: boolean;
}

const FormActions = ({
  currentSection,
  totalSections,
  onPrevious,
  onNext,
  onSubmit,
  isValid = true,
  isLastSection,
}: FormActionsProps) => {
  return (
    <div className="flex justify-between items-center w-full mt-6 bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg border border-white/20">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentSection === 0}
        className={`flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg
          ${currentSection === 0 
            ? 'opacity-50 text-white/40 bg-white/5 border-white/10 cursor-not-allowed pointer-events-none' 
            : 'text-white bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30'
          }`}
        type="button"
      >
        <ArrowLeft size={16} />
        Previous
      </Button>

      <div className="relative px-6 py-2">
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalSections }).map((_, i) => (
            <div 
              key={i} 
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === currentSection 
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 scale-125" 
                  : i < currentSection 
                    ? "bg-white/60" 
                    : "bg-white/20"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-white/70 text-center mt-1">
          Step {currentSection + 1} of {totalSections}
        </p>
      </div>

      {isLastSection ? (
        <Button
          onClick={onSubmit}
          disabled={!isValid}
          className={`flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg
            ${!isValid
              ? 'opacity-50 bg-gradient-to-r from-purple-500/50 to-blue-500/50 cursor-not-allowed pointer-events-none'
              : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
            } text-white`}
          type="button"
        >
          <Save size={16} />
          Submit Invoice
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={!isValid}
          className={`flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg
            ${!isValid
              ? 'opacity-50 bg-gradient-to-r from-purple-500/50 to-blue-500/50 cursor-not-allowed pointer-events-none'
              : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
            } text-white`}
          type="button"
        >
          Next
          <ArrowRight size={16} />
        </Button>
      )}
    </div>
  );
};

export default FormActions;
