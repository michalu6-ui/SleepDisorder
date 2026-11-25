import type { ButtonHTMLAttributes, ReactNode } from 'react';

import './Button.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'rescue';

export function Button({
  children,
  variant = 'primary',
  fullWidth,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  fullWidth?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`btn btn--${variant} ${fullWidth ? 'btn--full' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}