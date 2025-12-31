// components/PageContainer.tsx
import React from 'react';
import Background from './Background';
import GlassCard from './GlassCard';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  backgroundIntensity?: 'low' | 'medium' | 'high';
  showBackground?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  backgroundIntensity = 'medium',
  showBackground = true,
  maxWidth = 'lg',
  padding = 'md'
}) => {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'max-w-full'
  };
  
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4 sm:p-6',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-12'
  };
  
  return (
    <div className="relative min-h-screen bg-gray-900">
      {showBackground && <Background intensity={backgroundIntensity} />}
      
      <div className="relative z-20">
        <div className={`container mx-auto ${paddingClasses[padding]} ${className}`}>
          <div className={`mx-auto ${maxWidthClasses[maxWidth]}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export { PageContainer, GlassCard };
export default PageContainer;