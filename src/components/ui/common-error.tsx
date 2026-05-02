import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/utils/common.utils";

interface CommonErrorProps {
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
  className?: string;
}

export function CommonError({
  message = "Something went wrong. Please try again.",
  onRetry,
  fullScreen = false,
  className,
}: CommonErrorProps) {
  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300",
        className,
      )}>
      <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600">
        <AlertCircle className="h-10 w-10" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        Error Occurred
      </h3>
      <p className="mb-6 max-w-xs text-sm text-gray-500">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="flex items-center gap-2 cursor-pointer">
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="flex min-h-[300px] w-full items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
      {content}
    </div>
  );
}
