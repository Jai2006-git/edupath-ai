import React from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,
  size = 'md',
  label,
  ...props
}) => {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10'
  }[size];

  return (
    <div
      role="status"
      aria-live="polite"
      className={twMerge('flex flex-col items-center justify-center gap-3 p-6 text-center text-slate-400', className)}
      {...props}
    >
      <Loader2 className={clsx('animate-spin text-brand-400', iconSizes)} />
      {label && <p className="text-xs sm:text-sm font-medium text-slate-300">{label}</p>}
      <span className="sr-only">Loading...</span>
    </div>
  );
};
