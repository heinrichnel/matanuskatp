import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case "default":
          return "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500";
        case "destructive":
          return "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500";
        case "outline":
          return "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500";
        case "secondary":
          return "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500";
        case "ghost":
          return "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500";
        case "link":
          return "bg-transparent text-blue-600 underline-offset-4 hover:underline focus:ring-blue-500";
        default:
          return "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500";
      }
    };

    const getSizeClasses = () => {
      switch (size) {
        case "sm":
          return "h-9 px-3 text-xs";
        case "lg":
          return "h-12 px-8 text-base";
        default:
          return "h-10 px-4 py-2 text-sm";
      }
    };

    return (
      <button
        className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${getVariantClasses()} ${getSizeClasses()} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
