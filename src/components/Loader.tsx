
import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
}

const Loader: React.FC<LoaderProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex justify-center items-center py-6">
      <div className={`${sizeClasses[size]} rounded-full border-2 border-muted border-t-primary animate-spin-slow`} />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loader;
