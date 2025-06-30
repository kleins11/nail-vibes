import React, { useEffect, useState } from 'react';

interface MagicalLoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export default function MagicalLoadingOverlay({ 
  isVisible, 
  message = "Refining your design..." 
}: MagicalLoadingOverlayProps) {
  const [dots, setDots] = useState('');
  const [shimmerPhase, setShimmerPhase] = useState(0);

  // Animated dots effect
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isVisible]);

  // Shimmer animation phase
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setShimmerPhase(prev => (prev + 1) % 3);
    }, 800);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div 
      className="absolute inset-0 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, rgba(63, 63, 63, 0.6) 0%, rgba(63, 63, 63, 0.5) 50%, rgba(63, 63, 63, 0.6) 100%)'
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main loading content */}
      <div className="relative text-center px-8 py-6">
        {/* Magical spinner with gradient */}
        <div className="relative mb-6 flex justify-center">
          <div className="relative">
            {/* Outer ring */}
            <div className="w-16 h-16 border-4 border-white/20 rounded-full animate-spin-slow">
              <div className="absolute inset-0 border-4 border-transparent border-t-white/80 border-r-white/60 rounded-full animate-spin"></div>
            </div>
            
            {/* Inner shimmer */}
            <div className="absolute inset-2 bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-blue-400/30 rounded-full animate-pulse"></div>
            
            {/* Center glow */}
            <div className="absolute inset-4 bg-white/10 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Elegant text with shimmer effect */}
        <div className="space-y-3">
          <h3 className="text-white font-calling-code text-lg font-medium tracking-wide">
            <span className="inline-block animate-shimmer bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent bg-[length:200%_100%]">
              {message.replace('...', '')}{dots}
            </span>
          </h3>
          
          {/* Subtitle with staggered fade */}
          <p className="text-white/70 font-calling-code text-sm">
            <span className={`inline-block transition-opacity duration-500 ${shimmerPhase === 0 ? 'opacity-100' : 'opacity-40'}`}>
              Adding your personal touch
            </span>
            <span className={`inline-block transition-opacity duration-500 ml-2 ${shimmerPhase === 1 ? 'opacity-100' : 'opacity-40'}`}>
              ✨
            </span>
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mt-6 w-48 h-1 bg-white/20 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full animate-progress"></div>
        </div>
      </div>

      {/* Subtle corner accents */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/20 rounded-tl-lg"></div>
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/20 rounded-tr-lg"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/20 rounded-bl-lg"></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/20 rounded-br-lg"></div>
    </div>
  );
}