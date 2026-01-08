import React from 'react';

// A generic card with glowing borders and corners
interface CyberCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const CyberCard: React.FC<CyberCardProps> = ({ children, className = "", hoverEffect = false }) => {
  return (
    <div className={`relative bg-cyber-panel border border-cyber-dark p-6 overflow-hidden group ${className} ${hoverEffect ? 'hover:border-cyber-cyan/50 transition-colors duration-300' : ''}`}>
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyber-cyan"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyber-cyan"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyber-cyan"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyber-cyan"></div>
      
      {/* Scanline effect opacity */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-10 pointer-events-none"></div>
      
      {children}
    </div>
  );
};

interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle }) => (
  <div className="mb-12 relative">
    <h2 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple tracking-wider uppercase mb-2">
      {title}
    </h2>
    {subtitle && (
      <p className="text-cyber-green font-mono text-sm tracking-widest border-l-2 border-cyber-green pl-3 uppercase">
        {subtitle}
      </p>
    )}
    <div className="h-1 w-24 bg-cyber-cyan mt-4 shadow-[0_0_10px_rgba(0,243,255,0.5)]"></div>
  </div>
);

interface BadgeProps {
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ children }) => (
  <span className="inline-block px-3 py-1 bg-cyber-dark border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono rounded-sm hover:bg-cyber-cyan/10 transition-colors">
    {children}
  </span>
);

interface TechBarProps {
  level: number;
}

export const TechBar: React.FC<TechBarProps> = ({ level }) => (
  <div className="h-1 w-full bg-cyber-dark mt-2 overflow-hidden">
    <div 
      className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple" 
      style={{ width: `${level}%` }}
    ></div>
  </div>
);