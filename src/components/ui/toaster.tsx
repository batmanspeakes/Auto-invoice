import React from "react";
import { useToast, Toast, ToastProvider as BaseToastProvider } from "./use-toast";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface ToasterProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
}

// Map of variant to classes
const variantClasses = {
  default: "bg-white text-gray-800 border-gray-200",
  success: "bg-green-100 text-green-800 border-green-200",
  error: "bg-red-100 text-red-800 border-red-200",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  info: "bg-blue-100 text-blue-800 border-blue-200",
  destructive: "bg-red-500 text-white border-red-600",
};

// Map of position to classes
const positionClasses = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
};

// Helper component to display a single toast
const ToastItem: React.FC<{ toast: Toast; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const variant = toast.variant || "default";
  
  return (
    <div className={cn(
      "relative flex items-center justify-between gap-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all",
      variantClasses[variant],
      "my-2 max-w-md"
    )}>
      <div className="flex flex-col gap-1">
        {toast.title && <div className="font-semibold">{toast.title}</div>}
        {toast.description && <div className="text-sm opacity-90">{toast.description}</div>}
      </div>
      <button
        onClick={onDismiss}
        className="inline-flex h-6 w-6 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  );
};

// The main toaster component
export function Toaster({ position = "top-right" }: ToasterProps = {}) {
  const { toasts, dismiss } = useToast();

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col items-end gap-2 max-h-screen w-full overflow-hidden p-4 md:max-w-[420px]",
        positionClasses[position]
      )}
    >
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onDismiss={() => dismiss(toast.id)} 
        />
      ))}
    </div>
  );
}

// Create a wrapper for the provider to simplify imports
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <BaseToastProvider>{children}</BaseToastProvider>;
}
