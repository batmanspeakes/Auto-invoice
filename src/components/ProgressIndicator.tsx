import React, { useState, useEffect } from "react";
import { Progress } from "../components/ui/progress";
import { cn } from "../lib/utils";

interface ProgressIndicatorProps {
  currentStep?: number;
  totalSteps?: number;
  steps?: string[];
  onStepClick?: (step: number) => void;
}

const ProgressIndicator = ({
  currentStep = 1,
  totalSteps = 3,
  steps = ["Campaign Details", "Financial Details", "Bank Details"],
  onStepClick,
}: ProgressIndicatorProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Calculate progress percentage
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    setProgress(progressPercentage);
  }, [currentStep, totalSteps]);

  return (
    <div className="w-full max-w-full sm:max-w-3xl p-3 sm:p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
      <div className="mb-2">
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex justify-between mt-2 sm:mt-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div
              key={index}
              className={cn(
                "flex flex-col items-center space-y-1 sm:space-y-2 transition-all duration-300",
                isActive ? "scale-105 sm:scale-110" : "",
                onStepClick ? "cursor-pointer" : "cursor-default",
              )}
              onClick={() => onStepClick && onStepClick(stepNumber)}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-primary text-primary-foreground ring-2 sm:ring-4 ring-primary/30"
                    : isCompleted
                      ? "bg-primary/80 text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {stepNumber}
              </div>
              <span
                className={cn(
                  "text-xs sm:text-sm font-medium text-center",
                  isActive
                    ? "text-primary"
                    : isCompleted
                      ? "text-primary/80"
                      : "text-muted-foreground",
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;
