import React, { useEffect, useRef } from "react";
import { X } from 'lucide-react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  size?: 'sm' | 'md' | 'lg' | 'xl'; // For backward compatibility
  className?: string; // Added className prop
}

/**
 * Modal
 *
 * A modal dialog component for displaying content in a layer above the page
 *
 * @example
 * ```tsx
 * <Modal isOpen={true} onClose={() => {}} title="example" className="example">
 *   Content
 * </Modal>
 * ```
 *
 * @param props - Component props
 * @param props.isOpen - isOpen of the component
 * @param props.onClose - onClose of the component
 * @param props.title - title of the component
 * @param props.children - children of the component
 * @param props.maxWidth - maxWidth of the component
 * @param props.size - size of the component
 * @param props.className - Added className prop
 * @returns React component
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  size,
  className = ''
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Use size prop for backward compatibility if provided
  const finalMaxWidth = size ?
    (size === 'xl' ? '2xl' : size) :
    maxWidth;

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close modal on escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div
          ref={modalRef}
          className={`inline-block w-full ${maxWidthClasses[finalMaxWidth as keyof typeof maxWidthClasses]} p-6 my-8
            overflow-hidden text-left align-middle transition-all transform bg-white
            shadow-xl rounded-lg max-h-[90vh] flex flex-col ${className}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 border-b pb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {title}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

