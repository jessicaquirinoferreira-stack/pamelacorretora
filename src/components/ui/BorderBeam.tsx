import React from 'react';

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  className = '',
  size = 200,
  duration = 12,
  borderWidth = 1.5,
  colorFrom = '#E29578',
  colorTo = '#FAF7F2',
  delay = 0,
}) => {
  return (
    <div
      style={
        {
          '--size': size,
          '--duration': duration,
          '--border-width': borderWidth,
          '--color-from': colorFrom,
          '--color-to': colorTo,
          '--delay': `-${delay}s`,
        } as React.CSSProperties
      }
      className={`pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent] [mask-clip:padding-box,no-clip] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#fff,#fff)] ${className}`}
    >
      <div
        className="absolute aspect-square w-[var(--size)] bg-gradient-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent [offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))] animate-border-beam"
        style={{
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          animationIterationCount: 'infinite',
          animationTimingFunction: 'linear',
        }}
      />
    </div>
  );
};
