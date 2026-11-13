import React from 'react';

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = '#FAF7F2',
      shimmerSize = '0.08em',
      shimmerDuration = '3s',
      borderRadius = '9999px',
      background = '#B55D3E',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={`group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-6 py-3 font-semibold uppercase tracking-wider text-xs text-[#FAF7F2] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg rounded-full ${className}`}
        style={
          {
            '--spread': '90deg',
            '--shimmer-color': shimmerColor,
            '--radius': borderRadius,
            '--speed': shimmerDuration,
            '--cut': shimmerSize,
            '--bg': background,
            borderRadius,
            backgroundColor: background,
          } as React.CSSProperties
        }
        {...props}
      >
        {/* Shimmer sweep container */}
        <div
          className="pointer-events-none absolute -inset-[100%] animate-shimmer-sweep [mask:none]"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${shimmerColor}25 50%, transparent 100%)`,
          }}
        />

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );
  }
);

ShimmerButton.displayName = 'ShimmerButton';
