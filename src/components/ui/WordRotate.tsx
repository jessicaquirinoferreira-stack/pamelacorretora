import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface WordRotateProps {
  words: string[];
  duration?: number;
  className?: string;
}

export const WordRotate: React.FC<WordRotateProps> = ({
  words,
  duration = 3200,
  className = '',
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <span className={`inline-block overflow-hidden align-top ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="inline-block"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
