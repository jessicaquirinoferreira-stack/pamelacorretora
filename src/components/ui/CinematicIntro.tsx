import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../../context/DataContext';

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const { siteSettings } = useData();
  const [isExiting, setIsExiting] = useState(false);

  const brokerName = siteSettings.professionalName || 'Pâmela Boccaletti';

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Exact 7-second timeline: hold/draw up to 6.15s, then 0.85s cinematic fade-out ending at 7.0s
    const exitTimer = window.setTimeout(() => {
      setIsExiting(true);
    }, 6150);

    const completeTimer = window.setTimeout(() => {
      onComplete();
    }, 7000);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(exitTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (isExiting) return;
    setIsExiting(true);
    window.setTimeout(() => {
      onComplete();
    }, 450);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="cinematic-intro-overlay"
        initial={{ opacity: 1 }}
        animate={isExiting ? { opacity: 0, scale: 1.03 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        aria-label="Apresentação Pâmela Boccaletti"
        className="fixed inset-0 z-[100] bg-[#2D3B32] flex flex-col items-center justify-center px-4 sm:px-8 overflow-hidden select-none"
      >
        {/* Subtle warm ambient atmosphere (free space, no boxes or borders) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(226,149,120,0.12)_0%,rgba(59,77,65,0.28)_45%,rgba(45,59,50,0.98)_85%)]"
        />

        {/* Free-standing architectural luxury house + calligraphic broker name */}
        <div className="relative z-10 w-full max-w-5xl flex flex-col items-center justify-center">
          {/* Large Architectural Residence Vector Drawing (No circle, no square frame) */}
          <svg
            viewBox="0 0 900 380"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-[820px] h-auto overflow-visible"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="interior-warm-glow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E29578" stopOpacity="0.34" />
                <stop offset="100%" stopColor="#B55D3E" stopOpacity="0.08" />
              </linearGradient>
              <linearGradient id="pool-water-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C6D4C8" stopOpacity="0" />
                <stop offset="50%" stopColor="#C6D4C8" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#C6D4C8" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="facade-sheen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FAF7F2" stopOpacity="0" />
                <stop offset="50%" stopColor="#FAF7F2" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Subtle warm interior illumination fading in after structure draws */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.3, duration: 1.1, ease: 'easeOut' }}
            >
              {/* Left upper glass suite glow */}
              <polygon
                points="190,152 405,134 405,208 190,212"
                fill="url(#interior-warm-glow)"
              />
              {/* Main atrium double-height glass glow */}
              <polygon
                points="425,112 570,126 570,285 425,285"
                fill="url(#interior-warm-glow)"
              />
              {/* Ground living room panoramic glass glow */}
              <rect x="200" y="218" width="215" height="67" fill="url(#interior-warm-glow)" />
              {/* Infinity pool soft reflection */}
              <polygon points="150,305 645,305 685,332 115,332" fill="url(#pool-water-glow)" />
            </motion.g>

            {/* Stage 1: Horizon, Terrain & Reflecting Infinity Pool (0.15s - 1.0s) */}
            <motion.path
              d="M 45 292 L 855 292"
              stroke="#C6D4C8"
              strokeOpacity="0.55"
              strokeWidth="1.3"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path
              d="M 150 305 L 645 305 L 685 332 L 115 332 Z"
              stroke="#C6D4C8"
              strokeOpacity="0.45"
              strokeWidth="1.2"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.9, ease: 'easeInOut' }}
            />
            <motion.path
              d="M 210 318 L 365 318 M 420 322 L 590 322"
              stroke="#E29578"
              strokeOpacity="0.45"
              strokeWidth="1"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.7, ease: 'easeOut' }}
            />

            {/* Stage 2: Main Contemporary Architectural Volumes & Roof Overhangs (0.55s - 2.1s) */}
            {/* Left cantilevered terrace & ground wing */}
            <motion.path
              d="M 175 292 L 175 212 L 420 212"
              stroke="#FAF7F2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.55, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Upper cantilevered volume & sloped modern roofline */}
            <motion.path
              d="M 155 152 L 418 118 L 418 212 L 175 212 L 175 150"
              stroke="#FAF7F2"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.7, duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Roof fascia depth accent in warm terracotta */}
            <motion.path
              d="M 148 158 L 418 125"
              stroke="#E29578"
              strokeWidth="1.6"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 1.15, duration: 0.85, ease: 'easeOut' }}
            />

            {/* Central double-height pavilion & architectural pitched roof */}
            <motion.path
              d="M 385 122 L 515 62 L 668 122 L 648 124 L 648 292"
              stroke="#FAF7F2"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.9, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Double roof eave soffit line */}
            <motion.path
              d="M 392 128 L 515 72 L 660 128"
              stroke="#E29578"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.9, ease: 'easeOut' }}
            />

            {/* Right lower stone pavilion & covered garage/lounge wing */}
            <motion.path
              d="M 648 205 L 748 205 L 748 292 M 648 213 L 758 213"
              stroke="#FAF7F2"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.95, ease: 'easeOut' }}
            />

            {/* Stage 3: Panoramic Floor-to-Ceiling Glass, Pivot Door & Balcony Details (1.3s - 2.65s) */}
            {/* Grand pivot entrance door & vertical stone column */}
            <motion.path
              d="M 418 292 L 418 112 M 580 126 L 580 292 M 486 292 L 486 205 L 542 205 L 542 292"
              stroke="#FAF7F2"
              strokeOpacity="0.9"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 1.45, duration: 1.0, ease: 'easeInOut' }}
            />
            {/* Glass balcony balustrade */}
            <motion.path
              d="M 185 194 L 408 194 M 235 194 L 235 212 M 295 194 L 295 212 M 355 194 L 355 212"
              stroke="#C6D4C8"
              strokeOpacity="0.85"
              strokeWidth="1.1"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 1.65, duration: 0.85, ease: 'easeOut' }}
            />
            {/* Upper & Lower Glass Mullions */}
            <motion.path
              d="M 248 145 L 248 212 M 325 135 L 325 212 M 248 218 L 248 292 M 325 218 L 325 292 M 515 75 L 515 198 M 445 168 L 568 168"
              stroke="#FAF7F2"
              strokeOpacity="0.65"
              strokeWidth="1.15"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 1.75, duration: 0.95, ease: 'easeOut' }}
            />
            {/* Floating terrace steps & deck */}
            <motion.path
              d="M 465 292 L 465 282 L 565 282 L 565 292 M 668 235 L 725 235 L 725 292"
              stroke="#C6D4C8"
              strokeOpacity="0.7"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 1.95, duration: 0.75, ease: 'easeOut' }}
            />

            {/* Stage 4: Subtle Botanical Landscape Lines Framing the House (2.0s - 2.9s) */}
            <motion.path
              d="M 118 292 L 118 195 M 118 232 C 102 222 104 198 118 188 C 132 198 134 222 118 232 Z M 88 292 L 88 230 M 88 258 C 76 248 77 230 88 222 C 99 230 100 248 88 258 Z"
              stroke="#C6D4C8"
              strokeOpacity="0.65"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 2.0, duration: 0.9, ease: 'easeOut' }}
            />
            <motion.path
              d="M 785 292 L 785 200 M 785 238 C 770 226 771 200 785 190 C 799 200 800 226 785 238 Z M 815 292 L 815 242 M 815 266 C 805 258 806 242 815 235 C 824 242 825 258 815 266 Z"
              stroke="#C6D4C8"
              strokeOpacity="0.65"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 2.15, duration: 0.85, ease: 'easeOut' }}
            />
          </svg>

          {/* Stage 5: Broker's Name Written Smoothly Left-to-Right (Free, Large, Zero Circle/Square) */}
          <div className="relative mt-2 sm:mt-4 text-center px-2">
            <div className="relative inline-block">
              <motion.h1
                initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0.9 }}
                animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
                transition={{ delay: 2.85, duration: 1.85, ease: [0.37, 0, 0.63, 1] }}
                className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-wide text-[#FAF7F2] leading-tight whitespace-nowrap"
              >
                {brokerName}
              </motion.h1>

              {/* Luminous writing light-point sweeping along the name */}
              <motion.div
                aria-hidden="true"
                initial={{ left: '0%', opacity: 0 }}
                animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
                transition={{ delay: 2.85, duration: 1.85, ease: [0.37, 0, 0.63, 1] }}
                className="pointer-events-none absolute top-1/2 -translate-y-1/2 w-8 h-12 rounded-full bg-[#E29578]/50 blur-md"
              />
            </div>

            {/* Calligraphic Signature Flourish Stroke Underneath */}
            <div className="w-full max-w-md mx-auto mt-1 sm:mt-2">
              <svg
                viewBox="0 0 420 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto overflow-visible"
                aria-hidden="true"
              >
                <motion.path
                  d="M 15 12 C 110 4, 210 18, 310 9 C 350 6, 385 11, 405 8"
                  stroke="#E29578"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 3.3, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
            </div>

            {/* Subtitle Reveal */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4.65, duration: 0.9, ease: 'easeOut' }}
              className="mt-3 sm:mt-4 text-[11px] sm:text-sm uppercase tracking-[0.32em] sm:tracking-[0.4em] text-[#E29578] font-light"
            >
              Alphaville · Imóveis de Alto Padrão
            </motion.p>
          </div>
        </div>

        {/* Discreet Skip Action */}
        <motion.button
          type="button"
          onClick={handleSkip}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="fixed bottom-6 right-6 z-20 px-4 py-2 rounded-full bg-[#3B4D41]/80 hover:bg-[#495C4E] text-[#FAF7F2] text-[11px] uppercase tracking-widest border border-[#586E5E] backdrop-blur-sm transition-all cursor-pointer"
        >
          Pular entrada
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};
