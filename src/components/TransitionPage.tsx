import React, { useEffect, useState } from 'react';
import { VibeMatchData } from '../services/vibeService';
import GradientShapesScroll from './GradientShapesScroll';

interface TransitionPageProps {
  currentVibe: VibeMatchData | null;
}

export default function TransitionPage({ currentVibe }: TransitionPageProps) {
  const [phase, setPhase] = useState<'fadeOut' | 'sparklyMist' | 'gentleLanding' | 'fullyLanded'>('fadeOut');

  useEffect(() => {
    // Phase 1: Gentle fade out (300ms)
    const timer1 = setTimeout(() => {
      setPhase('sparklyMist');
    }, 300);

    // Phase 2: Sparkly mist (400ms)
    const timer2 = setTimeout(() => {
      setPhase('gentleLanding');
    }, 700);

    // Phase 3: Fully landed and ready (300ms)
    const timer3 = setTimeout(() => {
      setPhase('fullyLanded');
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #F5F1EC 0%, #FFFAF4 50%, #F5F1EC 100%)'
      }}
    >
      {/* Phase 1: Gentle fade out of current image */}
      {phase === 'fadeOut' && currentVibe && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-64 h-64 rounded-2xl overflow-hidden shadow-lg animate-fade-out-smooth"
          >
            <img 
              src={currentVibe.image_url} 
              alt="Transitioning design" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Phase 2: Sparkly mist effect */}
      {phase === 'sparklyMist' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Ethereal mist particles */}
          <div className="relative w-full h-full">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-sparkle-float-smooth"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  width: `${3 + Math.random() * 6}px`,
                  height: `${3 + Math.random() * 6}px`,
                  background: `radial-gradient(circle, rgba(${Math.random() > 0.5 ? '147, 51, 234' : '59, 130, 246'}, ${0.4 + Math.random() * 0.3}) 0%, transparent 70%)`,
                  animationDelay: `${Math.random() * 0.3}s`,
                  animationDuration: `${1.2 + Math.random() * 0.6}s`
                }}
              />
            ))}
            
            {/* Central gentle glow */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-gentle-pulse-smooth"
              style={{
                width: '180px',
                height: '180px',
                background: 'radial-gradient(circle, rgba(147, 51, 234, 0.08) 0%, rgba(59, 130, 246, 0.04) 50%, transparent 70%)',
                borderRadius: '50%'
              }}
            />
          </div>
        </div>
      )}

      {/* Phase 3 & 4: Gentle landing on homepage - ULTRA SMOOTH */}
      {(phase === 'gentleLanding' || phase === 'fullyLanded') && (
        <div className="absolute inset-0 flex flex-col justify-center landing-page">
          {/* Header that gracefully appears - PRELOADED AND SMOOTH */}
          <div 
            className="w-full px-4 md:px-8 lg:px-12 animate-ultra-smooth-appear" 
            style={{ 
              animationDelay: '0ms',
              animationFillMode: 'both'
            }}
          >
            <div className="flex justify-center md:justify-start pt-8 pb-4">
              <div className="text-2xl font-pilar font-bold text-blue-600 transition-all duration-300">
                nailvibes
              </div>
            </div>
          </div>
          
          {/* Main content that flows in beautifully - PRELOADED */}
          <div className="flex-1 flex flex-col justify-center pb-20">
            <div className="m3-grid-container">
              <div className="m3-grid">
                <div className="m3-content-area">
                  {/* Title floating in with elegant timing - PRELOADED */}
                  <div 
                    className="animate-ultra-smooth-appear" 
                    style={{ 
                      animationDelay: '100ms',
                      animationFillMode: 'both'
                    }}
                  >
                    <h1 className="text-display font-stratos-extrabold text-blue-600 mb-8 leading-tight text-center transition-all duration-300">
                      What's your nail vibe?
                    </h1>
                  </div>

                  {/* Textarea materializing with glassmorphism effect - PRELOADED */}
                  <div 
                    className="animate-ultra-smooth-appear" 
                    style={{ 
                      animationDelay: '200ms',
                      animationFillMode: 'both'
                    }}
                  >
                    <div className="textarea-long-container">
                      <textarea
                        placeholder="Harry Potter cutesy, Barbie glam metallic, dark academia matte"
                        className="textarea-long placeholder-calling-code transition-all duration-300"
                        style={{
                          background: 'rgba(252, 252, 252, 0.98)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(230, 230, 230, 0.9)',
                          boxShadow: '0 20px 20px 0 rgba(155, 155, 169, 0.25)'
                        }}
                        readOnly
                      />
                      <div className="textarea-long-button bg-blue-600 text-white transition-all duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gradient shapes that gracefully appear at the bottom - PRELOADED */}
          <div 
            className="animate-ultra-smooth-appear" 
            style={{ 
              animationDelay: '300ms',
              animationFillMode: 'both'
            }}
          >
            <GradientShapesScroll />
          </div>

          {/* Subtle floating sparkles that continue after landing - SMOOTH CONTINUATION */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-gentle-sparkle-continuous"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: '1.5px',
                  height: '1.5px',
                  background: `rgba(${Math.random() > 0.5 ? '147, 51, 234' : '59, 130, 246'}, 0.3)`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${5 + Math.random() * 3}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ULTRA SMOOTH custom animations - NO JERKINESS */}
      <style jsx>{`
        @keyframes sparkle-float-smooth {
          0% {
            opacity: 0;
            transform: translateY(15px) scale(0) rotate(0deg);
          }
          40% {
            opacity: 0.8;
            transform: translateY(-8px) scale(1.1) rotate(180deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-25px) scale(0.7) rotate(360deg);
          }
        }

        @keyframes gentle-pulse-smooth {
          0%, 100% {
            opacity: 0.2;
            transform: translate(-50%, -50%) scale(0.95);
          }
          50% {
            opacity: 0.4;
            transform: translate(-50%, -50%) scale(1.05);
          }
        }

        @keyframes ultra-smooth-appear {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
            filter: blur(2px);
          }
          50% {
            opacity: 0.7;
            transform: translateY(3px) scale(0.995);
            filter: blur(0.5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }

        @keyframes gentle-sparkle-continuous {
          0%, 100% {
            opacity: 0;
            transform: translateY(0) scale(0.8);
          }
          20% {
            opacity: 0.4;
            transform: translateY(-3px) scale(1.1);
          }
          80% {
            opacity: 0.2;
            transform: translateY(3px) scale(0.9);
          }
        }

        .animate-fade-out-smooth {
          animation: fadeOutUltraSmooth 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .animate-sparkle-float-smooth {
          animation: sparkle-float-smooth 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .animate-gentle-pulse-smooth {
          animation: gentle-pulse-smooth 1.8s ease-in-out infinite;
        }

        .animate-ultra-smooth-appear {
          animation: ultra-smooth-appear 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          opacity: 0;
        }

        .animate-gentle-sparkle-continuous {
          animation: gentle-sparkle-continuous 6s ease-in-out infinite;
        }

        @keyframes fadeOutUltraSmooth {
          0% {
            opacity: 1;
            transform: scale(1) blur(0px);
          }
          100% {
            opacity: 0;
            transform: scale(0.97) blur(1.5px);
          }
        }

        /* CRITICAL: Ensure all elements are hardware accelerated for smoothness */
        .animate-fade-out-smooth,
        .animate-sparkle-float-smooth,
        .animate-gentle-pulse-smooth,
        .animate-ultra-smooth-appear,
        .animate-gentle-sparkle-continuous {
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