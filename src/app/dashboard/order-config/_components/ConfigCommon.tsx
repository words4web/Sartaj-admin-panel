"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideIcon, Trash2 } from "lucide-react";
import { cn } from "@/utils/common.utils";

/**
 * Common Tab Header Component
 */
export function ConfigHeader({
  title,
  icon: Icon,
  action,
}: {
  title: string;
  icon: LucideIcon;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b pb-2 mb-4">
      <div className="flex items-center gap-3 text-lg font-bold text-gray-900">
        <Icon className="w-5 h-5 text-blue-600" />
        {title}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

/**
 * Common Grid Wrapper
 */
export function ConfigGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
        className,
      )}>
      {children}
    </div>
  );
}

/**
 * Common Card for Settings
 */
export function ConfigCard({
  title,
  subtitle,
  children,
  onRemove,
  badge,
  className,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  onRemove?: () => void;
  badge?: { text: string; bgColor: string };
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "p-6 border-gray-200 shadow-sm hover:shadow-md transition-shadow relative bg-white",
        className,
      )}>
      {badge && (
        <div
          className={cn(
            "absolute top-0 right-0 px-3 py-1.5 text-white rounded-bl-lg border-l border-b border-gray-200",
            badge?.bgColor,
          )}>
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {badge?.text}
          </span>
        </div>
      )}

      {(title || onRemove) && (
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          {title && (
            <span className="text-xs font-semibold text-gray-900 tracking-wider block">
              {title}
            </span>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-gray-300 hover:text-red-500 transition-colors ml-auto"
              title="Remove">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {subtitle && (
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">
          {subtitle}
        </div>
      )}

      {children}
    </Card>
  );
}

/**
 * Reusable Numeric Input with Integer Enforcement
 */
export function NumericInputField({
  label,
  register,
  unit,
  unitPosition = "left",
  error,
  min = 0,
  max,
  step = 1,
  required = true,
  placeholder,
  className,
  description,
}: {
  label: string;
  register: any;
  unit?: string;
  unitPosition?: "left" | "right";
  error?: any;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  placeholder?: string;
  className?: string;
  description?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-[12px] font-bold text-gray-700 tracking-tight">
        {label}
      </Label>
      <div className="relative">
        {unit && unitPosition === "left" && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 font-medium text-sm">
            {unit}
          </span>
        )}
        <Input
          type="number"
          min={min}
          max={max}
          step={step}
          required={required}
          placeholder={placeholder}
          {...register}
          onKeyDown={(e: React.KeyboardEvent) => {
            // Prevent decimals, scientific notation, etc. if step is 1
            if (
              step === 1 &&
              (e.key === "." || e.key === "e" || e.key === "E")
            ) {
              e.preventDefault();
            }
          }}
          className={cn(
            "h-11 text-base font-bold border-gray-200 focus:ring-blue-500 rounded-lg",
            unit && unitPosition === "left" && "pl-8",
            unit && unitPosition === "right" && "pr-12",
            error && "border-red-500 focus:ring-red-500",
          )}
        />
        {unit && unitPosition === "right" && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-900 font-medium text-sm">
            {unit}
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500 mt-1">
          {error.message || "Invalid value"}
        </p>
      )}
      {description && (
        <p className="text-xs text-gray-900 italic opacity-80 mt-1">
          {description}
        </p>
      )}
    </div>
  );
}
