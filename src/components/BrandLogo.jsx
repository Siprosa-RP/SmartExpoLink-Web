import React from 'react';

export function BrandLogo({ size = 'md', showTagline = false }) {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };
  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="inline-flex items-center gap-3 select-none">
      <img
        src="/smartexpolink_app_icon.png"
        alt="SmartExpoLink Emblem"
        className={`${iconSizes[size]} rounded-xl shadow-glow-sm object-contain`}
      />
      <div className="flex flex-col">
        <div className={`${textSizes[size]} font-extrabold tracking-tight leading-none`}>
          <span className="text-white">Smart</span>
          <span className="text-accent">Expo</span>
          <span className="text-white">Link</span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-mono uppercase tracking-widest text-accent-soft/80 mt-0.5">
            AI EXPO LEAD &amp; SOURCING ENGINE
          </span>
        )}
      </div>
    </div>
  );
}
