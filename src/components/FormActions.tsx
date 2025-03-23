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
  isValid,
  isLastSection,
}: FormActionsProps) => {
  return (
    <div className="flex justify-between items-center w-full mt-6 bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-4 shadow-lg">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentSection === 0}
        className="flex items-center gap-2 hover:bg-white hover:bg-opacity-20 transition-all text-white"
      >
        <ArrowLeft size={16} />
        Previous
      </Button>

      <div className="text-sm text-white opacity-80">
        {currentSection + 1} of {totalSections}
      </div>

      {isLastSection ? (
        <Button
          onClick={onSubmit}
          disabled={false}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white transition-all"
          type="button"
        >
          <Save size={16} />
          Submit Invoice
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={false}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white transition-all"
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
