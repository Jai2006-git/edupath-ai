import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'interactive';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'glass',
  ...props
}) => {
  const baseStyles = 'rounded-3xl border transition-all duration-200';

  const variantStyles = {
    glass: 'glass-panel border-slate-800 shadow-xl',
    solid: 'bg-slate-900 border-slate-800 shadow-lg',
    interactive: 'glass-card border-slate-800 hover:border-brand-500/40 shadow-xl hover:shadow-brand-500/5'
  }[variant];

  return (
    <div
      className={twMerge(clsx(baseStyles, variantStyles, className))}
      {...props}
    >
      {children}
    </div>
  );
};
