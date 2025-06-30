import React, { useEffect, useState } from 'react';

interface ReverseTransitionPageProps {
  prompt: string;
}

export default function ReverseTransitionPage({ prompt }: ReverseTransitionPageProps) {
  const [phase, setPhase] = useState<'gentleRise' | 'sparklyMist' | 'fadeToLoading'>('gentleRise');

  useEffect(() => {
    // Phase 1: Gentle rise from homepage (300ms)
    const timer1 = setTimeout(() => {
      setPhase('sparklyMist');
    }, 300);

    // Phase 2: Sparkly mist journey (500ms)
    const timer2 = setTimeout(() => {
      setPhase('fadeToLoading');
    }, 800);

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
      {/* Phase 1: Gentle rise - Homepage elements floating up */}
      {phase === 'gentleRise' && (
        <div className="absolute inset-0 flex flex-col justify-center landing-page">
          {/* Header floating up */}
          <div 
            className="w-full px-4 md:px-8 lg:px-12 animate-gentle-float-up" 
            style={{ 
              animationDelay: '0ms',
              animationFillMode: 'both'
            }}
          >
            <div className="flex justify-center md:justify-start pt-8 pb-4">
              <div className="text-2xl font-pilar font-bold text-blue-600">
                nailvibes
              </div>
            </div>
          </div>
          
          {/* Main content floating up */}
          <div className="flex-1 flex flex-col justify-center pb-20">
            <div className="m3-grid-container">
              <div className="m3-grid">
                <div className="m3-content-area">
                  {/* Title floating up */}
                  <div 
                    className="animate-gentle-float-up" 
                    style={{ 
                      animationDelay: '50ms',
                      animationFillMode: 'both'
                    }}
                  >
                    <h1 className="text-display font-stratos-extrabold text-blue-600 mb-8 leading-tight text-center">
                      What's your nail vibe?
                    </h1>
                  </div>

                  {/* Textarea floating up with user's prompt */}
                  <div 
                    className="animate-gentle-float-up" 
                    style={{ 
                      animationDelay: '100ms',
                      animationFillMode: 'both'
                    }}
                  >
                    <div className="textarea-long-container">
                      <textarea
                        value={prompt}
                        className="textarea-long placeholder-calling-code"
                        style={{
                          background: 'rgba(252, 252, 252, 0.98)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(230, 230, 230, 0.9)',
                          boxShadow: '0 20px 20px 0 rgba(155, 155, 169, 0.25)'
                        }}
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
          </div>

          {/* Gradient shapes floating up */}
          <div 
            className="animate-gentle-float-up" 
            style={{ 
              animationDelay: '150ms',
              animationFillMode: 'both'
            }}
          >
            <div className="gradient-shapes-container">
              <div className="gradient-shapes-scroll">
                {/* Simplified gradient shapes for transition */}
                <div className="gradient-shape">
                  <img 
                    src="https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-11-Col2%201.png"
                    alt="Gradient shape"
                    className="gradient-shape-image"
                  />
                </div>
                <div className="gradient-shape">
                  <img 
                    src="https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-12-Col4%201.png"
                    alt="Gradient shape"
                    className="gradient-shape-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase 2: Sparkly mist journey - Floating through magical space */}
      {(phase === 'sparklyMist' || phase === 'fadeToLoading') && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Magical journey particles */}
          <div className="relative w-full h-full">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-journey-sparkle"
                style={{
                  left: `${15 + Math.random() * 70}%`,
                  top: `${15 + Math.random() * 70}%`,
                  width: `${2 + Math.random() * 8}px`,
                  height: `${2 + Math.random() * 8}px`,
                  background: `radial-gradient(circle, rgba(${Math.random() > 0.5 ? '147, 51, 234' : '59, 130, 246'}, ${0.5 + Math.random() * 0.4}) 0%, transparent 70%)`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${1.5 + Math.random() * 1}s`
                }}
              />
            ))}
            
            {/* Central magical vortex */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-magical-vortex"
              style={{
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(147, 51, 234, 0.12) 0%, rgba(59, 130, 246, 0.08) 40%, rgba(147, 51, 234, 0.04) 70%, transparent 100%)',
                borderRadius: '50%'
              }}
            />

            {/* Floating prompt text in the mist */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center animate-prompt-float">
              <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <p className="text-white font-calling-code text-sm font-medium tracking-wide">
                  "{prompt.length > 40 ? prompt.substring(0, 40) + '...' : prompt}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase 3: Gentle fade to loading */}
      {phase === 'fadeToLoading' && (
        <div 
          className="absolute inset-0 animate-fade-to-loading"
          style={{ 
            background: 'linear-gradient(135deg, #F5F1EC 0%, #FFFAF4 50%, #F5F1EC 100%)'
          }}
        />
      )}

      {/* ULTRA SMOOTH custom animations for reverse transition */}
      <style jsx>{`
        @keyframes gentle-float-up {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
          }
        }

        @keyframes journey-sparkle {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0) rotate(0deg);
          }
          30% {
            opacity: 0.9;
            transform: translateY(-5px) scale(1.2) rotate(120deg);
          }
          70% {
            opacity: 0.6;
            transform: translateY(-15px) scale(1) rotate(240deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-40px) scale(0.8) rotate(360deg);
          }
        }

        @keyframes magical-vortex {
          0%, 100% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(0.9) rotate(0deg);
          }
          50% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1.1) rotate(180deg);
          }
        }

        @keyframes prompt-float {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(20px) scale(0.9);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(0) scale(1);
          }
          80% {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(-5px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(-20px) scale(0.95);
          }
        }

        @keyframes fade-to-loading {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-gentle-float-up {
          animation: gentle-float-up 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .animate-journey-sparkle {
          animation: journey-sparkle 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .animate-magical-vortex {
          animation: magical-vortex 2.5s ease-in-out infinite;
        }

        .animate-prompt-float {
          animation: prompt-float 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .animate-fade-to-loading {
          animation: fade-to-loading 0.4s ease-out forwards;
        }

        /* CRITICAL: Hardware acceleration for all elements */
        .animate-gentle-float-up,
        .animate-journey-sparkle,
        .animate-magical-vortex,
        .animate-prompt-float,
        .animate-fade-to-loading {
          will-change: transform, opacity, filter;
          backface-visibility: hidden;
          perspective: 1000px;
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
}