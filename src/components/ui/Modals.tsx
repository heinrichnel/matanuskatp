import React, { useEffect, useRef } from "react";

interface ModalsProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

const Modals: React.FC<ModalsProps> = ({
  isOpen,
  onClose,
  title,
  size = "md",
  children,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className={`bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full ${sizeClasses[size]} p-6 relative`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {/* Title */}
        {title && (
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">{title}</h2>
        )}
        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modals;
