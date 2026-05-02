"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductFormHint } from "./ProductFormHint";
import { cn } from "@/utils/common.utils";

/**
 * A standard sub-section header with uppercase label.
 */
export function PropertySection({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3 pt-2 first:pt-0", className)}>
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

/**
 * A standardized checkbox field with a label.
 */
export function PropertyCheckbox({
  label,
  checked,
  onCheckedChange,
  variant = "primary",
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  variant?: "primary" | "destructive";
}) {
  return (
    <label className="flex items-center gap-2.5 text-sm cursor-pointer select-none group">
      <Checkbox
        checked={checked}
        onCheckedChange={(c) => onCheckedChange(Boolean(c))}
        className={cn(
          "border-gray-300 h-5 w-5 rounded-md",
          variant === "primary"
            ? "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            : "data-[state=checked]:bg-destructive data-[state=checked]:border-destructive",
        )}
      />
      <span className="font-medium text-gray-700 capitalize group-hover:text-gray-900 transition-colors">
        {label}
      </span>
    </label>
  );
}

/**
 * A standard container for form sections across all tabs.
 * Standardizes the gray card look + header with icon and title.
 */
export function FormSectionCard({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-gray-50/80 rounded-xl p-5 border border-gray-100 space-y-6",
        className,
      )}>
      <div className="flex items-center gap-2 border-b border-gray-200/60 pb-3">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}

/**
 * A standardized select field with a label and optional hint.
 */
export function FormSelectField({
  label,
  value,
  onValueChange,
  placeholder,
  options,
  hint,
  required,
  disabled,
  className,
}: {
  label: string;
  value: string;
  onValueChange: (val: string) => void;
  placeholder?: string;
  options: { key: string; label: string }[];
  hint?: string | React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className="w-full bg-white shadow-none border-gray-200 h-10">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options?.map((opt) => (
            <SelectItem key={opt.key} value={opt.key}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hint && <ProductFormHint>{hint}</ProductFormHint>}
    </div>
  );
}
