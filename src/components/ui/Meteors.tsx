import React from 'react';

interface MeteorsProps {
  number?: number;
}

export const Meteors: React.FC<MeteorsProps> = ({ number = 20 }) => {
  const meteors = Array.from({ length: number });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {meteors.map((_, idx) => {
        const top = Math.floor(Math.random() * 100);
        const left = Math.floor(Math.random() * 100);
        const delay = (Math.random() * 1).toFixed(2);
        const duration = Math.floor(Math.random() * 3) + 2;
        const size = Math.floor(Math.random() * 2) + 1;

        return (
          <span
            key={idx}
            className="absolute h-0.5 w-0.5 rounded-full bg-[#c5a880] shadow-[0_0_0_1px_#c5a88015] rotate-[215deg] animate-meteor"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              width: `${size * 25}px`,
              height: `${size}px`,
            }}
          />
        );
      })}
    </div>
  );
};
