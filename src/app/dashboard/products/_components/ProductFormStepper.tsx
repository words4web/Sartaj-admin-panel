import { cn } from "@/utils/common.utils";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { ProductFormStepperProps } from "./types/ProductFormStepper.types";

export function ProductFormStepper({
  current,
  complete,
  steps,
  onBack,
  onNext,
  isSubmitting,
  submitLabel,
  isFormValid,
}: ProductFormStepperProps) {
  const isFirstStep = current === 0;
  const isLastStep = current === steps.length - 1;

  return (
    <div className="flex items-center justify-between w-full bg-white/50 backdrop-blur-sm sticky top-0 z-10 py-3 mb-1 border-b border-gray-100 px-4">
      {/* ── BACK BUTTON ── */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onBack}
        disabled={isFirstStep}
        className="gap-1.5 text-muted-foreground hover:text-foreground h-9 px-3">
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Back</span>
      </Button>

      {/* ── STEPS ── */}
      <div className="flex items-center justify-center overflow-x-auto scrollbar-none px-4">
        {steps?.map((step, i) => {
          const isDone = complete[i];
          const isActive = i === current;
          return (
            <div key={step.id} className="flex items-center shrink-0">
              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border",
                  isDone
                    ? "bg-primary/5 text-primary border-primary/20"
                    : isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "text-muted-foreground border-transparent hover:bg-muted/50",
                )}>
                {isDone ? (
                  <Check className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <span
                    className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}>
                    {i + 1}
                  </span>
                )}
                <span className="hidden md:inline">{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "h-[1.5px] w-4 mx-1 transition-colors rounded-full",
                    complete[i] ? "bg-primary/30" : "bg-border",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── NEXT / SAVE BUTTON ── */}
      {isLastStep ? (
        <Button
          key="save-button"
          type="submit"
          size="sm"
          disabled={!isFormValid || isSubmitting}
          className="h-9 px-6 min-w-[100px] shadow-sm">
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      ) : (
        <Button
          key="next-button"
          type="button"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onNext();
          }}
          className="gap-1.5 h-9 px-4 shadow-sm">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
