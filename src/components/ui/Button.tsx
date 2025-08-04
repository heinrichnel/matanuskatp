import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "success";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
  outline: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  success: "bg-green-500 hover:bg-green-600 text-white",
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "px-2 py-1 text-xs rounded",
  sm: "px-3 py-1.5 text-sm rounded",
  md: "px-4 py-2 text-base rounded-md",
  lg: "px-6 py-3 text-lg rounded-lg",
};

/**
 * Button
 *
 * A customizable button component with various variants and sizes
 *
 * @example
 * ```tsx
 * <Button />
 * ```
 *
 * @param props - Component props
 * @returns React component
 */
const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  isLoading,
  fullWidth,
  children,
  ...props
}) => (
  <button
    className={`inline-flex items-center justify-center font-medium focus:outline-none transition ${variantClasses[variant]} ${sizeClasses[size]}${fullWidth ? " w-full" : ""} ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    disabled={isLoading || props.disabled}
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

// Export both as default and named export for backward compatibility
export { Button };
export default Button;
import { cn } from "@/utils/cn";
import React, { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500":
              variant === "default",
            "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500":
              variant === "destructive",
            "border border-gray-300 bg-white hover:bg-gray-50 focus-visible:ring-gray-500":
              variant === "outline",
            "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500":
              variant === "secondary",
            "hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500":
              variant === "ghost",
            "text-blue-600 hover:underline": variant === "link",
          },
          {
            "h-10 px-4 py-2": size === "default",
            "h-8 px-3 text-sm": size === "sm",
            "h-12 px-6 text-lg": size === "lg",
            "h-9 w-9 p-0": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
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
