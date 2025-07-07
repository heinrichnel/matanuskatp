import React from 'react';

// Placeholder for button component
export const Button: React.FC<{ children: React.ReactNode; onClick?: () => void; variant?: string }> = ({ children, onClick, variant }) => (
  <button onClick={onClick} className={variant}>{children}</button>
);
