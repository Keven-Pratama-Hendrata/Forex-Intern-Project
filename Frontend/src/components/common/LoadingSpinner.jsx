import React from 'react';

const LoadingSpinner = ({ 
  variant = 'default', 
  size = 'lg',
  className = '' 
}) => {
  const variants = {
    default: (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#6ca0c1] to-[#507fa1]">
        <span className={`loading loading-spinner loading-${size}`}></span>
      </div>
    ),
    inline: (
      <span className={`loading loading-spinner loading-${size}`} />
    ),
    centered: (
      <div className="flex items-center justify-center h-full">
        <span className={`loading loading-spinner loading-${size}`}></span>
      </div>
    ),
    custom: (
      <span className={`loading loading-spinner loading-${size} ${className}`} />
    )
  };

  return variants[variant] || variants.default;
};

export default LoadingSpinner; 