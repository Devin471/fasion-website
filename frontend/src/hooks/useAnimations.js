import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

/**
 * useScrollReveal - Hook to trigger animation when element comes into view
 */
export function useScrollReveal() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return { ref, isInView };
}

/**
 * useCountUp - Animate number counting up
 */
export function useCountUp(end, duration = 2, start = 0) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let timeout;
    let current = start;
    const increment = (end - start) / (duration * 60); // 60fps

    const animate = () => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        setCount(end);
      } else {
        setCount(Math.floor(current));
        timeout = setTimeout(animate, 1000 / 60);
      }
    };

    animate();
    return () => clearTimeout(timeout);
  }, [end, duration, start]);

  return count;
}

/**
 * useParallax - Hook for parallax scroll effect
 */
export function useParallax(ref, offset = 50) {
  const [y, setY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrollY = window.scrollY;
        const elementTop = rect.top + scrollY;
        const distance = scrollY - elementTop;
        setY(distance * 0.5);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref, offset]);

  return y;
}

/**
 * useMountAnimation - Control animations on component mount
 */
export function useMountAnimation(initialState = false) {
  const [mounted, setMounted] = useState(initialState);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

/**
 * useHoverAnimation - Manage hover state for animations
 */
export function useHoverAnimation() {
  const [isHovered, setIsHovered] = useState(false);

  return {
    isHovered,
    onHoverStart: () => setIsHovered(true),
    onHoverEnd: () => setIsHovered(false),
  };
}
