"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export default function TypewriterText({
  text,
  speed = 12,
  className = "",
  onComplete,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setDone(false);

    const timer = window.setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(timer);
        setDone(true);
        onCompleteRef.current?.();
      }
    }, speed);

    return () => window.clearInterval(timer);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayed}
      {!done && (
        <motion.span
          aria-hidden
          className="inline-block w-0.5 h-4 bg-amd-red ml-0.5 align-middle"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </span>
  );
}
