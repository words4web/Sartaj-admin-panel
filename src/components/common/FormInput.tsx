import { InputHTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  prefix?: string;
}

export function FormInput({
  label,
  error,
  helperText,
  required,
  prefix,
  className,
  ...props
}: FormInputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-gray-500 font-medium">
            {prefix}
          </span>
        )}
        <input
          {...props}
          className={`
            w-full py-2.5 border border-gray-200 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
            placeholder:text-gray-400
            transition-all duration-200
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            hover:border-gray-300
            ${prefix ? "pl-11 pr-4" : "px-4"}
            ${error ? "border-red-500 focus:ring-red-500/30 focus:border-red-500" : ""}
            ${className || ""}
          `}
        />
      </div>

      {error && (
        <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {helperText && !error && (
        <p className="text-gray-500 text-sm mt-2">{helperText}</p>
      )}
    </div>
  );
}
