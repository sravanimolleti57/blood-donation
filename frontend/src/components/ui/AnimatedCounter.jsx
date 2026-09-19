import React, { useEffect, useState, useRef } from 'react';

const AnimatedCounter = ({ value = 0, duration = 1500, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  const numericValue = typeof value === 'number' ? value : parseInt(value, 10) || 0;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(numericValue);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          startCounter();
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) observer.unobserve(elementRef.current);
    };
  }, [numericValue, hasAnimated]);

  const startCounter = () => {
    if (numericValue === 0) {
      setCount(0);
      return;
    }

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out quad formula
      const currentVal = Math.floor((1 - (1 - progress) * (1 - progress)) * numericValue);
      setCount(currentVal);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(numericValue);
      }
    };
    window.requestAnimationFrame(step);
  };

  return (
    <span ref={elementRef} className="tabular-nums font-black">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

export default AnimatedCounter;
