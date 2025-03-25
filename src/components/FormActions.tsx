import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight, Save, Send } from "lucide-react";

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
    <div className="flex flex-col sm:flex-row justify-between items-center w-full mt-4 sm:mt-6 bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-4 shadow-lg border border-white/20 gap-3 sm:gap-0">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentSection === 0}
        className={`w-full sm:w-auto flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg
          ${currentSection === 0 
            ? 'opacity-50 text-white/40 bg-white/5 border-white/10 cursor-not-allowed pointer-events-none' 
            : 'text-white bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30'
          }`}
        type="button"
      >
        <ArrowLeft size={16} />
        Previous
      </Button>

      <div className="relative px-6 py-2 order-first sm:order-none">
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
          variant="outline"
          onClick={onSubmit}
          disabled={!isValid}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg
            ${!isValid
              ? 'opacity-50 text-white/40 bg-white/5 border-white/10 cursor-not-allowed pointer-events-none' 
              : 'text-white bg-gradient-to-r from-purple-500 to-blue-500 border-transparent hover:opacity-90'
            }`}
          type="button"
        >
          <Send size={16} />
          Submit Invoice
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={onNext}
          disabled={!isValid}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg
            ${!isValid
              ? 'opacity-50 text-white/40 bg-white/5 border-white/10 cursor-not-allowed pointer-events-none' 
              : 'text-white bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30'
            }`}
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
