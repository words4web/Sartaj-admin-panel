import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ProductFormFooterProps } from "./types/ProductFormFooter.types";

export function ProductFormFooter({
  step,
  totalSteps,
  isStepValid,
  isFormValid,
  isSubmitting,
  submitLabel,
  onBack,
  onNext,
}: ProductFormFooterProps) {
  return (
    <div className="flex items-center justify-between gap-4 pt-4 mt-6 border-t border-gray-100">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onBack}
        disabled={step === 0}
        className="gap-1 text-muted-foreground hover:text-foreground">
        <ChevronLeft className="w-4 h-4" />
        Back
      </Button>

      <p className="text-xs text-muted-foreground hidden sm:block">
        {!isStepValid && "Complete required fields to proceed"}
      </p>

      {step < totalSteps - 1 ? (
        <Button type="button" size="sm" onClick={onNext} className="gap-1">
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      ) : (
        <Button
          type="submit"
          size="sm"
          disabled={!isFormValid || isSubmitting}
          className="min-w-28 text-sm px-6">
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
      )}
    </div>
  );
}
