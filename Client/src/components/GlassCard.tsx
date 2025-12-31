// components/GlassCard.tsx
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  floating?: boolean;
  gradientBorder?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hoverEffect = true,
  floating = false,
  gradientBorder = false,
  intensity = 'medium'
}) => {
  const baseClasses = `
    relative
    backdrop-blur-lg
    ${gradientBorder 
      ? 'bg-gradient-to-br from-white/10 to-white/5 border border-transparent' 
      : 'bg-white/5 border border-white/10'
    }
    rounded-2xl
    shadow-2xl
    ${intensity === 'high' ? 'shadow-purple-500/20' : 
      intensity === 'medium' ? 'shadow-purple-500/10' : 
      'shadow-purple-500/5'
    }
    transition-all duration-300
    ${hoverEffect ? 'hover:bg-white/10 hover:shadow-purple-500/20 hover:scale-[1.02]' : ''}
    ${floating ? 'animate-float' : ''}
    overflow-hidden
    transform-gpu
  `;
  
  // Gradient border effect
  const gradientBorderClasses = gradientBorder ? `
    before:absolute before:inset-0 before:rounded-2xl before:p-[1px]
    before:bg-gradient-to-r before:from-indigo-500/30 before:via-purple-500/30 before:to-pink-500/30
    before:-z-10 before:blur-sm
  ` : '';
  
  return (
    <div className={`${baseClasses} ${gradientBorderClasses} ${className}`}>
      {/* Inner glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 rounded-2xl pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;