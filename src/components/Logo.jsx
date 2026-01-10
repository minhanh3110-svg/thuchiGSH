import React from 'react';

const Logo = ({ size = 'md', showText = true }) => {
  const sizes = {
    sm: { container: 'h-8', text: 'text-sm' },
    md: { container: 'h-10', text: 'text-base' },
    lg: { container: 'h-12', text: 'text-lg' },
    xl: { container: 'h-16', text: 'text-xl' }
  };

  const sizeClasses = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-2">
      <img 
        src="/logo.png" 
        alt="Green Straw Hat" 
        className={`${sizeClasses.container} object-contain`}
        onError={(e) => {
          // Fallback nếu logo không load được
          e.target.style.display = 'none';
        }}
      />
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`font-bold ${sizeClasses.text}`}>Green Straw Hat</span>
          <span className="text-xs opacity-90">Happiness Together</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
