import React from 'react';

const BloodGroupBadge = ({ bloodGroup, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5 font-bold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-full bg-brand-50 text-brand-700 border border-brand-200 shadow-xs ${
        sizes[size] || sizes.md
      } ${className}`}
    >
      <span className="text-brand-600 font-serif">🩸</span>
      <span>{bloodGroup || 'N/A'}</span>
    </span>
  );
};

export default BloodGroupBadge;
