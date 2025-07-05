import React, { forwardRef } from 'react';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    loadingText = 'Loading...',
    icon,
    iconPosition = 'left',
    fullWidth = false,
    ariaLabel,
    ariaDescribedBy,
    className = '',
    children,
    disabled,
    ...props
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      primary: 'bg-accent hover:bg-accent/90 text-white shadow-lg hover:shadow-xl hover:shadow-accent/20',
      secondary: 'glass glass-hover text-white border border-white/30',
      danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl hover:shadow-red-600/20'
    };
    
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm rounded-lg',
      md: 'px-6 py-3 text-base rounded-xl',
      lg: 'px-8 py-4 text-lg rounded-xl'
    };
    
    const widthClass = fullWidth ? 'w-full' : '';
    
    const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;
    
    const renderContent = () => {
      if (loading) {
        return (
          <>
            <svg 
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{loadingText}</span>
          </>
        );
      }
      
      return (
        <>
          {icon && iconPosition === 'left' && (
            <span className="mr-2" aria-hidden="true">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="ml-2" aria-hidden="true">{icon}</span>
          )}
        </>
      );
    };
    
    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-busy={loading}
        {...props}
      >
        {renderContent()}
      </button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton'; 