import React, { useState } from 'react';
import './BloodFlowAnimation.css';

const BloodFlowAnimation = ({ bloodGroup, isAvailable }) => {
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = Math.min(Math.max(((y - centerY) / centerY) * -2, -2), 2);
    const rotateY = Math.min(Math.max(((x - centerX) / centerX) * 3, -3), 3);

    setTiltStyle({
      transform: `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.005)`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'rotateX(0deg) rotateY(0deg) scale(1)',
    });
  };

  return (
    <div
      className="blood-flow-viewport"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
    >
      <div className="blood-flow-container text-white space-y-4">
        
        {/* Header & Real Donor Info Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span className="text-brand-500 animate-pulse">🩸</span> Every Drop Creates a Connection
            </h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              From donor to donation, every contribution moves us closer to saving a life.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Real Blood Group Badge */}
            {bloodGroup && (
              <div className="px-3 py-1.5 bg-slate-900/90 border border-brand-500/40 rounded-xl text-xs font-black text-white flex items-center gap-1.5 shadow-sm">
                <span className="text-[10px] text-slate-400 font-normal uppercase">Group</span>
                <span className="text-brand-400 font-extrabold">{bloodGroup}</span>
              </div>
            )}

            {/* Real Availability Indicator */}
            <div className="px-3 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs font-bold flex items-center gap-2">
              <span className="relative flex items-center justify-center">
                <span className={`w-2.5 h-2.5 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
                {isAvailable && (
                  <span className="absolute w-4 h-4 rounded-full bg-emerald-400 animate-ping opacity-60"></span>
                )}
              </span>
              <span className={isAvailable ? 'text-emerald-400 font-black' : 'text-slate-400 font-semibold'}>
                {isAvailable ? 'AVAILABLE TO DONATE' : 'UNAVAILABLE'}
              </span>
            </div>
          </div>
        </div>

        {/* Continuous Flow Visual SVG */}
        <div className="relative py-2 overflow-hidden">
          <svg viewBox="0 0 600 100" className="w-full h-auto max-h-36 overflow-visible">
            <defs>
              {/* Path Definition */}
              <path id="flowPath" d="M 30 50 C 130 15, 230 85, 330 50 S 510 15, 570 50" />
              
              {/* Gradient for Vessel */}
              <linearGradient id="vesselGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#e52521" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.4" />
              </linearGradient>

              {/* Radial Glow for Blood Cells */}
              <radialGradient id="particleGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#ff4d4d" />
                <stop offset="80%" stopColor="#e52521" />
                <stop offset="100%" stopColor="#881337" />
              </radialGradient>
            </defs>

            {/* Vessel Outline & Animated Dash */}
            <path
              d="M 30 50 C 130 15, 230 85, 330 50 S 510 15, 570 50"
              fill="none"
              stroke="url(#vesselGradient)"
              strokeWidth="14"
              strokeLinecap="round"
              className="vessel-track"
            />
            <path
              d="M 30 50 C 130 15, 230 85, 330 50 S 510 15, 570 50"
              fill="none"
              stroke="#ff8080"
              strokeWidth="2.5"
              strokeDasharray="6 12"
              className="vessel-inner"
              opacity="0.6"
            />

            {/* Start Node: DONOR */}
            <g transform="translate(15, 32)">
              <circle cx="15" cy="18" r="18" fill="#0f172a" stroke="#ef4444" strokeWidth="2.5" />
              <text x="15" y="23" textAnchor="middle" fontSize="14" fill="#ffffff">🩸</text>
            </g>

            {/* End Node: SAVE A LIFE */}
            <g transform="translate(555, 32)">
              <circle cx="15" cy="18" r="18" fill="#0f172a" stroke="#ef4444" strokeWidth="2.5" />
              <text x="15" y="23" textAnchor="middle" fontSize="14" fill="#ffffff">❤️</text>
            </g>

            {/* 10 Flowing Blood Cell Particles */}
            <circle r="4.5" fill="url(#particleGlow)" filter="drop-shadow(0 0 4px #e52521)">
              <animateMotion dur="5s" repeatCount="indefinite">
                <mpath href="#flowPath" />
              </animateMotion>
            </circle>
            <circle r="6.5" fill="url(#particleGlow)" filter="drop-shadow(0 0 6px #e52521)">
              <animateMotion dur="5s" begin="0.5s" repeatCount="indefinite">
                <mpath href="#flowPath" />
              </animateMotion>
            </circle>
            <circle r="8" fill="url(#particleGlow)" filter="drop-shadow(0 0 8px #e52521)">
              <animateMotion dur="5s" begin="1.0s" repeatCount="indefinite">
                <mpath href="#flowPath" />
              </animateMotion>
            </circle>
            <circle r="5" fill="url(#particleGlow)" filter="drop-shadow(0 0 5px #e52521)">
              <animateMotion dur="5s" begin="1.5s" repeatCount="indefinite">
                <mpath href="#flowPath" />
              </animateMotion>
            </circle>
            <circle r="7" fill="url(#particleGlow)" filter="drop-shadow(0 0 7px #e52521)">
              <animateMotion dur="5s" begin="2.0s" repeatCount="indefinite">
                <mpath href="#flowPath" />
              </animateMotion>
            </circle>
            <circle r="4" fill="url(#particleGlow)" filter="drop-shadow(0 0 4px #e52521)">
              <animateMotion dur="5s" begin="2.5s" repeatCount="indefinite">
                <mpath href="#flowPath" />
              </animateMotion>
            </circle>
            <circle r="6" fill="url(#particleGlow)" filter="drop-shadow(0 0 6px #e52521)">
              <animateMotion dur="5s" begin="3.0s" repeatCount="indefinite">
                <mpath href="#flowPath" />
              </animateMotion>
            </circle>
            <circle r="8" fill="url(#particleGlow)" filter="drop-shadow(0 0 8px #e52521)">
              <animateMotion dur="5s" begin="3.5s" repeatCount="indefinite">
                <mpath href="#flowPath" />
              </animateMotion>
            </circle>
            <circle r="5.5" fill="url(#particleGlow)" filter="drop-shadow(0 0 5px #e52521)">
              <animateMotion dur="5s" begin="4.0s" repeatCount="indefinite">
                <mpath href="#flowPath" />
              </animateMotion>
            </circle>
            <circle r="7" fill="url(#particleGlow)" filter="drop-shadow(0 0 7px #e52521)">
              <animateMotion dur="5s" begin="4.5s" repeatCount="indefinite">
                <mpath href="#flowPath" />
              </animateMotion>
            </circle>
          </svg>
        </div>

        {/* Labels below flow */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-2">
          <span className="flex items-center gap-1.5 text-slate-300 font-bold">
            <span>🩸</span> DONOR START
          </span>
          <span className="text-brand-400 font-mono text-[10px] tracking-widest uppercase animate-pulse">
            Continuous Flow
          </span>
          <span className="flex items-center gap-1.5 text-slate-300 font-bold">
            <span>❤️</span> LIFE SAVED
          </span>
        </div>

      </div>
    </div>
  );
};

export default BloodFlowAnimation;
