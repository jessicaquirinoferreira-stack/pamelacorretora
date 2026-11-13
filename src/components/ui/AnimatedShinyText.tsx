import React from 'react';

interface AnimatedShinyTextProps {
  children: React.ReactNode;
  className?: string;
  shimmerWidth?: number;
}

export const AnimatedShinyText: React.FC<AnimatedShinyTextProps> = ({
  children,
  className = '',
  shimmerWidth = 100,
}) => {
  return (
    <span
      className={`inline-block bg-[length:250%_100%] bg-clip-text text-transparent transition-colors animate-shiny-text ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(120deg, rgba(226, 149, 120, 0.85) 0%, rgba(250, 247, 242, 1) 50%, rgba(226, 149, 120, 0.85) 100%)',
      }}
    >
      {children}
    </span>
  );
};
