import { cn } from "@/utils/common.utils";

import { ProductFormHintProps } from "./ProductFormHint.types";

export function ProductFormHint({ children, className }: ProductFormHintProps) {
  return (
    <p className={cn("text-xs text-muted-foreground mt-1", className)}>
      {children}
    </p>
  );
}
