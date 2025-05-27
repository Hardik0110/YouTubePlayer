import React, { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'category' | 'default';
  scheme?: 1 | 2 | 3 | 4;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'default', 
  scheme = 1, 
  isActive = false, 
  className = '', 
  onClick 
}) => {
  const getVariantClasses = () => {
    if (variant === 'category') {
      const schemeClasses = {
        1: 'bg-category-schemes-1-base text-category-schemes-1-light border-category-schemes-1-accent',
        2: 'bg-category-schemes-2-base text-category-schemes-2-light border-category-schemes-2-accent',
        3: 'bg-category-schemes-3-base text-category-schemes-3-light border-category-schemes-3-accent',
        4: 'bg-category-schemes-4-base text-category-schemes-4-light border-category-schemes-4-accent'
      };

      const activeClasses = 'bg-category-active-base text-category-active-light border-category-active-accent transform scale-105 opacity-100';
      const inactiveClasses = `${schemeClasses[scheme]} opacity-90`;
      
      return `
        px-4 py-2 font-bold uppercase transition-all duration-200 rounded-md 
        border-3 min-w-[100px] text-sm tracking-wide
        hover:opacity-100 hover:scale-102 active:scale-98
        ${isActive ? activeClasses : inactiveClasses}
      `;
    }

    return `
      bg-button-base text-button-text w-12 h-12 font-bold uppercase 
      transition-all duration-200 rounded-md flex items-center justify-center
      shadow-[0_4px_2px_theme(colors.red.600),0_4px_3px_theme(colors.black)]
      hover:opacity-100 hover:scale-102 
      active:translate-y-0.5 active:shadow-[0_2px_2px_theme(colors.red.600),0_2px_3px_theme(colors.black)]
    `;
  };

  return (
    <button 
      onClick={onClick}
      className={`${getVariantClasses()} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;