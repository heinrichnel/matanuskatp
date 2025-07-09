import React from 'react';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
}

const Select: React.FC<SelectProps> & {
  Trigger: React.FC<{ children: React.ReactNode }>;
  Value: React.FC<{ placeholder: string }>;
  Content: React.FC<{ children: React.ReactNode }>;
  Item: React.FC<{ value: string; children: React.ReactNode }>;
} = ({ value, onValueChange, children, className }) => {
  return (
    <div className={className}>
      <select value={value} onChange={(e) => onValueChange(e.target.value)}>
        {children}
      </select>
    </div>
  );
};

Select.Trigger = ({ children }) => <div>{children}</div>;
Select.Value = ({ placeholder }) => <div>{placeholder}</div>;
Select.Content = ({ children }) => <div>{children}</div>;
Select.Item = ({ value, children }) => <option value={value}>{children}</option>;

export default Select;
