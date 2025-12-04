interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
}

export function Logo({ className = '', size = 'md', variant = 'full' }: LogoProps) {
  const sizes = {
    sm: { height: 24, fontSize: 'text-sm' },
    md: { height: 32, fontSize: 'text-base' },
    lg: { height: 40, fontSize: 'text-lg' }
  };

  const currentSize = sizes[size];

  if (variant === 'icon') {
    return (
      <svg
        width={currentSize.height}
        height={currentSize.height}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect width="40" height="40" rx="8" fill="#2b6cb0" />
        <path
          d="M20 8L28 12V18C28 24 24 28.5 20 32C16 28.5 12 24 12 18V12L20 8Z"
          fill="white"
          opacity="0.9"
        />
        <path
          d="M20 14V26M14 20H26"
          stroke="#2b6cb0"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={currentSize.height}
        height={currentSize.height}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" rx="8" fill="#2b6cb0" />
        <path
          d="M20 8L28 12V18C28 24 24 28.5 20 32C16 28.5 12 24 12 18V12L20 8Z"
          fill="white"
          opacity="0.9"
        />
        <path
          d="M20 14V26M14 20H26"
          stroke="#2b6cb0"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <div className="flex flex-col leading-tight">
        <span className={`font-semibold text-white ${currentSize.fontSize}`}>
          ePrescription
        </span>
        {size !== 'sm' && (
          <span className="text-xs text-muted-foreground">
            Sistema Hospitalario
          </span>
        )}
      </div>
    </div>
  );
}