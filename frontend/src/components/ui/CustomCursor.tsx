'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const pathname = usePathname();
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const isConsole =
    pathname === "/dashboard" ||
    pathname === "/analytics" ||
    pathname === "/routing" ||
    pathname === "/history" ||
    pathname === "/chat";

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || isConsole) return;

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isClient, isConsole]);

  useEffect(() => {
    if (!isClient || isConsole) return;

    const style = document.createElement('style');
    style.setAttribute('data-custom-cursor', 'true');
    style.textContent = `
      @media (pointer: fine) {
        body, a, button {
          cursor: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, [isClient, isConsole]);

  if (!isClient || isConsole) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[100] mix-blend-difference hidden md:block"
      animate={{
        x: mousePosition.x - 8,
        y: mousePosition.y - 8,
        scale: isHovering ? 2.5 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 700,
        damping: 28,
        mass: 0.5,
      }}
    />
  );
}
