export type ProductFormStep = {
  id: string;
  label: string;
};

export type ProductFormStepperProps = {
  current: number;
  complete: boolean[];
  steps: ProductFormStep[];
  onBack: () => void;
  onNext: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  isFormValid?: boolean;
};
