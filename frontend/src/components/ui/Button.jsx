import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const VARIANTS = {
  primary: 'bg-accent text-bg hover:bg-accent/90 active:bg-accent/80',
  secondary: 'bg-elevated text-fg border border-subtle hover:bg-subtle',
  danger: 'bg-danger/20 text-danger border border-danger/40 hover:bg-danger/30',
  ghost: 'bg-transparent text-muted hover:bg-surface hover:text-fg',
};

const SIZES = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}) {
  return (
    <button
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent2/50 disabled:opacity-50 disabled:cursor-not-allowed',
          VARIANTS[variant],
          SIZES[size],
          className,
        ),
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
