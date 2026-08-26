import React from 'react';
import { HelpCircle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        'glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 text-center space-y-4 max-w-md mx-auto',
        className
      )}
      {...props}
    >
      <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto text-brand-400">
        {icon || <HelpCircle className="w-7 h-7" />}
      </div>
      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg font-bold text-white">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <div className="pt-2">
          <Button onClick={onAction} size="sm" variant="primary">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
