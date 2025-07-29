import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  className,
  ...props
}) => {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ''}`}
      {...props}
    />
  );
};

export default Input;
