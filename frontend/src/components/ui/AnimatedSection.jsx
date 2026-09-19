import React, { useEffect, useRef, useState } from 'react';

const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) observer.unobserve(domRef.current);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      style={{
        transitionDuration: '700ms',
        transitionDelay: `${delay}ms`,
      }}
      className={`transition-all ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
