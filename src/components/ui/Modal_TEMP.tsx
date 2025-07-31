import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  let modalSize = 'max-w-md';
  if (size === 'sm') modalSize = 'max-w-sm';
  if (size === 'lg') modalSize = 'max-w-lg';
  if (size === 'xl') modalSize = 'max-w-xl';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        ref={modalRef}
        className={`bg-white rounded-lg shadow-lg w-full ${modalSize} p-6 relative`}
      >
        {title && (
          <div className="text-lg font-semibold mb-4">
            {title}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-red-500"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
