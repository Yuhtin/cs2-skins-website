import clsx from 'clsx';

export function Card({ className, children, ...rest }) {
  return (
    <div
      className={clsx(
        'bg-surface border border-subtle rounded-lg shadow-card',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
