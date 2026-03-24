import { TextareaHTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export function FormTextarea({
  label,
  error,
  helperText,
  required,
  className,
  ...props
}: FormTextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        {...props}
        className={`
          w-full px-4 py-2 border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          placeholder:text-gray-400
          transition-colors duration-200
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          resize-none
          ${error ? "border-red-500 focus:ring-red-500" : ""}
          ${className || ""}
        `}
      />

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
