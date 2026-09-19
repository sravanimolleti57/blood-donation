import React, { useState } from 'react';

const TiltCard = ({ children, className = '', maxAngle = 3, scaleOnHover = 1.01, ...props }) => {
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    // Check reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = Math.min(Math.max(((y - centerY) / centerY) * -maxAngle, -maxAngle), maxAngle);
    const rotateY = Math.min(Math.max(((x - centerX) / centerX) * maxAngle, -maxAngle), maxAngle);

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(${scaleOnHover})`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: isHovered ? 'transform 0.15s ease-out, box-shadow 0.2s ease-out' : 'transform 0.4s ease-out, box-shadow 0.3s ease-out',
        willChange: 'transform',
      }}
      className={`${className} ${isHovered ? 'shadow-lg border-brand-500/30' : ''}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default TiltCard;
