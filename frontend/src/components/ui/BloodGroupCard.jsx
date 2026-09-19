import React, { useState } from 'react';

const BloodGroupCard = ({ bloodGroup, label = 'Ready for matching' }) => {
  const [transformStyle, setTransformStyle] = useState('');

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const tiltX = (y / (rect.height / 2)) * -8;
    const tiltY = (x / (rect.width / 2)) * 8;

    setTransformStyle(`perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.03, 1.03, 1.03)`);
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
      className="group relative bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-2xl hover:shadow-red-500/15 hover:border-red-400/60 transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden"
    >
      {/* Background Ambient Red Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/10 via-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      {/* Blood Badge Icon */}
      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-700 via-brand-600 to-red-500 text-white flex items-center justify-center font-black text-xl shadow-md group-hover:shadow-red-500/30 group-hover:scale-105 transition-all duration-300">
        {bloodGroup}
      </div>

      <div className="text-center space-y-1 relative z-10">
        <h4 className="text-base font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">
          Blood Group {bloodGroup}
        </h4>
        <p className="text-[11px] text-slate-500 font-medium group-hover:text-slate-700">
          {label}
        </p>
      </div>
    </div>
  );
};

export default BloodGroupCard;
