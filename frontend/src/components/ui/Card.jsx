import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ className, children, ...rest }) {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-surface border border-subtle rounded-lg shadow-card',
          className,
        ),
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
