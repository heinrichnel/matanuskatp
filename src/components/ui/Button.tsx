import { cn } from "@/utils/cn";
import React, { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "primary" | "danger" | "success";
  size?: "default" | "sm" | "lg" | "icon" | "xs" | "md";
  icon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Button
 *
 * A customizable button component with various variants and sizes
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", icon, isLoading, fullWidth, children, ...props }, ref) => {
    // Map legacy variants to new variants
    const mappedVariant = variant === "primary" ? "default"
                        : variant === "danger" ? "destructive"
                        : variant === "success" ? "default" // Map success to default with custom class
                        : variant;

    // Map legacy sizes to new sizes
    const mappedSize = size === "md" ? "default"
                     : size === "xs" ? "sm" // Map xs to sm
                     : size;

    // Success variant custom class
    const successClass = variant === "success" ? "bg-green-500 hover:bg-green-600 text-white focus-visible:ring-green-500" : "";

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500":
              mappedVariant === "default",
            "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500":
              mappedVariant === "destructive",
            "border border-gray-300 bg-white hover:bg-gray-50 focus-visible:ring-gray-500":
              mappedVariant === "outline",
            "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500":
              mappedVariant === "secondary",
            "hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500":
              mappedVariant === "ghost",
            "text-blue-600 hover:underline": mappedVariant === "link",
          },
          {
            "h-10 px-4 py-2": mappedSize === "default",
            "h-8 px-3 text-sm": mappedSize === "sm",
            "h-12 px-6 text-lg": mappedSize === "lg",
            "h-9 w-9 p-0": mappedSize === "icon",
          },
          fullWidth ? "w-full" : "",
          successClass,
          className
        )}
        disabled={isLoading || props.disabled}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && <span className="mr-2">{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

// Default handler for when onClick is not provided
const ButtonWithHandler = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onClick) {
      props.onClick(event);
    }
  };

  return <Button {...props} onClick={handleClick} ref={ref} />;
});

ButtonWithHandler.displayName = "ButtonWithHandler";

export { Button, ButtonWithHandler as DefaultButton };
export default Button;
