import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  { className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={twMerge(
        clsx(
          'h-10 w-full rounded-md bg-bg border border-subtle px-3 text-sm text-fg placeholder:text-faint',
          'focus:outline-none focus:border-accent2 focus:ring-2 focus:ring-accent2/20',
          'transition-colors duration-150',
          className,
        ),
      )}
      {...rest}
    />
  );
});
