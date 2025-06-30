import React, { useEffect, useState } from 'react';
import { VibeMatchData } from '../services/vibeService';

interface TransitionPageProps {
  currentVibe: VibeMatchData | null;
}

export default function TransitionPage({ currentVibe }: TransitionPageProps) {
  const [phase, setPhase] = useState<'fadeOut' | 'sparklyMist' | 'gentleLanding'>('fadeOut');

  useEffect(() => {
    // Phase 1: Gentle fade out (400ms)
    const timer1 = setTimeout(() => {
      setPhase('sparklyMist');
    }, 400);

    // Phase 2: Sparkly mist (500ms)
    const timer2 = setTimeout(() => {
      setPhase('gentleLanding');
    }, 900);

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
      {/* Phase 1: Gentle fade out of current image */}
      {phase === 'fadeOut' && currentVibe && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-64 h-64 rounded-2xl overflow-hidden shadow-lg animate-fade-out"
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
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-sparkle-float"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  width: `${4 + Math.random() * 8}px`,
                  height: `${4 + Math.random() * 8}px`,
                  background: `radial-gradient(circle, rgba(${Math.random() > 0.5 ? '147, 51, 234' : '59, 130, 246'}, ${0.3 + Math.random() * 0.4}) 0%, transparent 70%)`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${1.5 + Math.random() * 1}s`
                }}
              />
            ))}
            
            {/* Central gentle glow */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-gentle-pulse"
              style={{
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 70%)',
                borderRadius: '50%'
              }}
            />
          </div>
        </div>
      )}

      {/* Phase 3: Gentle landing on homepage - SMOOTH AND GRACEFUL */}
      {phase === 'gentleLanding' && (
        <div className="absolute inset-0 flex flex-col justify-center landing-page">
          {/* Header that gracefully appears */}
          <div className="w-full px-4 md:px-8 lg:px-12 animate-gentle-appear" style={{ animationDelay: '0ms' }}>
            <div className="flex justify-center md:justify-start pt-8 pb-4">
              <div className="text-2xl font-pilar font-bold text-blue-600">
                nailvibes
              </div>
            </div>
          </div>
          
          {/* Main content that flows in beautifully */}
          <div className="flex-1 flex flex-col justify-center pb-20">
            <div className="m3-grid-container">
              <div className="m3-grid">
                <div className="m3-content-area">
                  {/* Title floating in with elegant timing */}
                  <div className="animate-gentle-appear" style={{ animationDelay: '150ms' }}>
                    <h1 className="text-display font-stratos-extrabold text-blue-600 mb-8 leading-tight text-center">
                      What's your nail vibe?
                    </h1>
                  </div>

                  {/* Textarea materializing with glassmorphism effect */}
                  <div className="animate-gentle-appear" style={{ animationDelay: '300ms' }}>
                    <div className="textarea-long-container">
                      <textarea
                        placeholder="Harry Potter cutesy, Barbie glam metallic, dark academia matte"
                        className="textarea-long placeholder-calling-code"
                        style={{
                          background: 'rgba(252, 252, 252, 0.95)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(230, 230, 230, 0.8)',
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

          {/* Gradient shapes that gracefully appear at the bottom */}
          <div className="animate-gentle-appear" style={{ animationDelay: '450ms' }}>
            <div className="gradient-shapes-container">
              <div className="gradient-shapes-scroll">
                {/* First set of shapes */}
                {[
                  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-11-Col2%201.png",
                  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-12-Col4%201.png",
                  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-1-Col3%201.png",
                  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-2-Col5%201.png",
                  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-4-Col8%201.png",
                  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-5-Col10%201.png",
                  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-5-Col1%201.png",
                  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-6-Col4%201.png",
                  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-7-Col9%201.png",
                  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-8-Col2%201.png"
                ].map((shape, index) => (
                  <div key={`first-${index}`} className="gradient-shape">
                    <img 
                      src={shape} 
                      alt={`Gradient shape ${index + 1}`}
                      className="gradient-shape-image"
                    />
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {[
                  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-11-Col2%201.png",
                  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-12-Col4%201.png",
                  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-1-Col3%201.png",
                  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-2-Col5%201.png",
                  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-4-Col8%201.png",
                  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-5-Col10%201.png",
                  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-5-Col1%201.png",
                  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-6-Col4%201.png",
                  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-7-Col9%201.png",
                  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-8-Col2%201.png"
                ].map((shape, index) => (
                  <div key={`second-${index}`} className="gradient-shape">
                    <img 
                      src={shape} 
                      alt={`Gradient shape ${index + 1}`}
                      className="gradient-shape-image"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subtle floating sparkles that continue after landing */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-gentle-sparkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: '2px',
                  height: '2px',
                  background: `rgba(${Math.random() > 0.5 ? '147, 51, 234' : '59, 130, 246'}, 0.4)`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${4 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Enhanced custom animations for the elegant transition */}
      <style jsx>{`
        @keyframes sparkle-float {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-10px) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px) scale(0.8);
          }
        }

        @keyframes gentle-pulse {
          0%, 100% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        @keyframes gentle-appear {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.96);
            filter: blur(4px);
          }
          60% {
            opacity: 0.8;
            transform: translateY(5px) scale(0.99);
            filter: blur(1px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }

        @keyframes gentle-sparkle {
          0%, 100% {
            opacity: 0;
            transform: translateY(0) scale(1);
          }
          25% {
            opacity: 0.6;
            transform: translateY(-5px) scale(1.2);
          }
          75% {
            opacity: 0.3;
            transform: translateY(5px) scale(0.8);
          }
        }

        .animate-fade-out {
          animation: fadeOutGently 0.4s cubic-bezier(0.4, 0, 0.6, 1) forwards;
        }

        .animate-sparkle-float {
          animation: sparkle-float 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-gentle-pulse {
          animation: gentle-pulse 2s ease-in-out infinite;
        }

        .animate-gentle-appear {
          animation: gentle-appear 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          opacity: 0;
        }

        .animate-gentle-sparkle {
          animation: gentle-sparkle 4s ease-in-out infinite;
        }

        @keyframes fadeOutGently {
          0% {
            opacity: 1;
            transform: scale(1) blur(0px);
          }
          100% {
            opacity: 0;
            transform: scale(0.95) blur(3px);
          }
        }
      `}</style>
    </div>
  );
}