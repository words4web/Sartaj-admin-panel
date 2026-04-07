export type ProductFormFooterProps = {
  step: number;
  totalSteps: number;
  isStepValid: boolean;
  isFormValid: boolean;
  isSubmitting: boolean;
  submitLabel: string;
  onBack: () => void;
  onNext: () => void;
};
