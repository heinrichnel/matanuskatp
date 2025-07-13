import React from 'react';

interface LogoProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ width = 180, height = 40, className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/images/logo.png" 
        alt="Matanuska Logo" 
        width={width} 
        height={height}
        className="object-contain"
      />
    </div>
  );
};

export default Logo;