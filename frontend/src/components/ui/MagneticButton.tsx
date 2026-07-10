'use client';

import { useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
}

export default function MagneticButton({
  children,
  className,
  onClick,
  strength = 0.32,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const reducedMotion = useReducedMotion();

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * strength, y: middleY * strength });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
    setHovering(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={reset}
      onClick={onClick}
      animate={{
        x: position.x,
        y: position.y,
        scale: hovering && !reducedMotion ? 1.03 : 1,
      }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.12 }}
      className={`inline-block ${className || ''}`}
    >
      {children}
    </motion.div>
  );
}
