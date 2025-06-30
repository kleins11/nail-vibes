import React, { useEffect, useState } from 'react';
import MagicalSparkles from './MagicalSparkles';

interface HomepageToResultTransitionProps {
  prompt: string;
}

export default function HomepageToResultTransition({ prompt }: HomepageToResultTransitionProps) {
  const [phase, setPhase] = useState<'fadeOut' | 'sparklyMist' | 'complete'>('fadeOut');

  useEffect(() => {
    // Phase 1: Gentle fade out of homepage content (300ms)
    const timer1 = setTimeout(() => {
      setPhase('sparklyMist');
    }, 300);

    // Phase 2: Sparkly mist effect (400ms)
    const timer2 = setTimeout(() => {
      setPhase('complete');
    }, 700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #F5F1EC 0%, #FFFAF4 50%, #F5F1EC 100%)'
      }}
    >
      {/* Phase 1: Gentle fade out of homepage elements */}
      {phase === 'fadeOut' && (
        <div className="absolute inset-0 flex flex-col">
          {/* Header fading out */}
          <div 
            className="w-full px-4 md:px-8 lg:px-12 animate-fade-out-smooth"
            style={{ zIndex: 10 }}
          >
            <div className="flex justify-center md:justify-start pt-8 pb-4">
              <div className="text-2xl font-pilar font-bold text-blue-600 transition-all duration-300">
                nailvibes
              </div>
            </div>
          </div>
          
          {/* Main content fading out */}
          <div className="flex-1 flex flex-col justify-center pb-20 animate-fade-out-smooth" style={{ zIndex: 10 }}>
            <div className="m3-grid-container">
              <div className="m3-grid">
                <div className="m3-content-area">
                  <h1 className="text-display font-stratos-extrabold text-blue-600 mb-8 leading-tight text-center">
                    What's your nail vibe?
                  </h1>
                  
                  <div className="textarea-long-container">
                    <textarea
                      value={prompt}
                      placeholder="Harry Potter cutesy, Barbie glam metallic, dark academia matte"
                      className="textarea-long placeholder-calling-code"
                      readOnly
                    />
                    <div className="textarea-long-button bg-blue-600 text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Magical sparkles fading out */}
          <div className="animate-fade-out-smooth">
            <MagicalSparkles />
          </div>
        </div>
      )}

      {/* Phase 2: Sparkly mist effect - REVERSE of result-to-homepage */}
      {phase === 'sparklyMist' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Ethereal mist particles - MORE INTENSE than result-to-homepage */}
          <div className="relative w-full h-full">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-sparkle-gather-smooth"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  width: `${4 + Math.random() * 8}px`,
                  height: `${4 + Math.random() * 8}px`,
                  background: `radial-gradient(circle, rgba(${Math.random() > 0.5 ? '147, 51, 234' : '59, 130, 246'}, ${0.5 + Math.random() * 0.4}) 0%, transparent 70%)`,
                  animationDelay: `${Math.random() * 0.2}s`,
                  animationDuration: `${0.8 + Math.random() * 0.4}s`
                }}
              />
            ))}
            
            {/* Central gathering glow - REVERSE EFFECT */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-gentle-gather-smooth"
              style={{
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(147, 51, 234, 0.12) 0%, rgba(59, 130, 246, 0.06) 50%, transparent 70%)',
                borderRadius: '50%'
              }}
            />
          </div>
        </div>
      )}

      {/* Phase 3: Complete transition - CLEAN FINISH */}
      {phase === 'complete' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Just a subtle final glow - NO LOADING ELEMENTS */}
          <div 
            className="animate-gentle-completion-glow"
            style={{
              width: '80px',
              height: '80px',
              background: 'radial-gradient(circle, rgba(147, 51, 234, 0.06) 0%, transparent 70%)',
              borderRadius: '50%'
            }}
          />
        </div>
      )}

      {/* ULTRA SMOOTH custom animations - REVERSE DIRECTION */}
      <style jsx>{`
        @keyframes sparkle-gather-smooth {
          0% {
            opacity: 0;
            transform: translateY(-15px) scale(0.8) rotate(0deg);
          }
          40% {
            opacity: 0.9;
            transform: translateY(8px) scale(1.2) rotate(180deg);
          }
          100% {
            opacity: 0;
            transform: translateY(25px) scale(0.6) rotate(360deg);
          }
        }

        @keyframes gentle-gather-smooth {
          0%, 100% {
            opacity: 0.1;
            transform: translate(-50%, -50%) scale(0.9);
          }
          50% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        @keyframes gentle-completion-glow {
          0% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.1);
          }
          100% {
            opacity: 0;
            transform: scale(1.3);
          }
        }

        .animate-fade-out-smooth {
          animation: fadeOutUltraSmooth 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .animate-sparkle-gather-smooth {
          animation: sparkle-gather-smooth 1.0s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .animate-gentle-gather-smooth {
          animation: gentle-gather-smooth 1.5s ease-in-out infinite;
        }

        .animate-gentle-completion-glow {
          animation: gentle-completion-glow 1.0s ease-out forwards;
        }

        @keyframes fadeOutUltraSmooth {
          0% {
            opacity: 1;
            transform: scale(1) blur(0px);
          }
          100% {
            opacity: 0;
            transform: scale(0.98) blur(1px);
          }
        }

        /* CRITICAL: Hardware acceleration for all elements */
        .animate-fade-out-smooth,
        .animate-sparkle-gather-smooth,
        .animate-gentle-gather-smooth,
        .animate-gentle-completion-glow {
          will-change: transform, opacity, filter;
          backface-visibility: hidden;
          perspective: 1000px;
          transform-style: preserve-3d;
        }

        /* Smooth transitions for all interactive elements */
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
    </div>
  );
}