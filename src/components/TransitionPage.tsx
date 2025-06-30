import React, { useEffect, useState } from 'react';
import { VibeMatchData } from '../services/vibeService';

interface TransitionPageProps {
  currentVibe: VibeMatchData | null;
}

// Gradient shapes for the transition animation
const GRADIENT_SHAPES = [
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
];

export default function TransitionPage({ currentVibe }: TransitionPageProps) {
  const [phase, setPhase] = useState<'fadeOut' | 'morphing' | 'fadeIn'>('fadeOut');
  const [morphingShapes, setMorphingShapes] = useState<string[]>([]);

  useEffect(() => {
    // Phase 1: Fade out current content (300ms)
    const timer1 = setTimeout(() => {
      setPhase('morphing');
      // Generate random shapes for morphing animation
      const randomShapes = Array.from({ length: 8 }, () => 
        GRADIENT_SHAPES[Math.floor(Math.random() * GRADIENT_SHAPES.length)]
      );
      setMorphingShapes(randomShapes);
    }, 300);

    // Phase 2: Morphing animation (600ms)
    const timer2 = setTimeout(() => {
      setPhase('fadeIn');
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
      {/* Phase 1: Fade out current image */}
      {phase === 'fadeOut' && currentVibe && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-64 h-64 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ease-out"
            style={{
              opacity: 0,
              transform: 'scale(0.9)',
              filter: 'blur(2px)'
            }}
          >
            <img 
              src={currentVibe.image_url} 
              alt="Transitioning design" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Phase 2: Morphing gradient shapes */}
      {phase === 'morphing' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-80 h-80">
            {morphingShapes.map((shape, index) => (
              <div
                key={index}
                className="absolute transition-all duration-600 ease-in-out"
                style={{
                  left: `${20 + (index % 3) * 30}%`,
                  top: `${20 + Math.floor(index / 3) * 25}%`,
                  width: '60px',
                  height: '60px',
                  opacity: 0.7,
                  transform: `
                    rotate(${index * 45}deg) 
                    scale(${0.8 + Math.sin(Date.now() / 1000 + index) * 0.3})
                    translateX(${Math.sin(Date.now() / 800 + index) * 20}px)
                    translateY(${Math.cos(Date.now() / 800 + index) * 20}px)
                  `,
                  animation: `float 2s ease-in-out infinite ${index * 0.2}s`,
                  filter: 'blur(1px)'
                }}
              >
                <img 
                  src={shape}
                  alt="Morphing shape"
                  className="w-full h-full object-contain"
                  style={{
                    filter: 'brightness(1.1) saturate(1.2)'
                  }}
                />
              </div>
            ))}
            
            {/* Central pulsing glow */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                width: '120px',
                height: '120px',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.2) 50%, transparent 70%)',
                borderRadius: '50%',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}
            />
          </div>
        </div>
      )}

      {/* Phase 3: Fade in to landing page elements */}
      {phase === 'fadeIn' && (
        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="m3-grid-container">
            <div className="m3-grid">
              <div className="m3-content-area text-center">
                {/* Logo appearing */}
                <div 
                  className="mb-8 transition-all duration-300 ease-out"
                  style={{
                    opacity: 1,
                    transform: 'translateY(0) scale(1)',
                    animation: 'fadeInUp 0.6s ease-out'
                  }}
                >
                  <div className="text-2xl font-pilar font-bold text-blue-600">
                    nailvibes
                  </div>
                </div>

                {/* Title appearing */}
                <div 
                  className="transition-all duration-500 ease-out"
                  style={{
                    opacity: 1,
                    transform: 'translateY(0) scale(1)',
                    animation: 'fadeInUp 0.8s ease-out 0.2s both'
                  }}
                >
                  <h1 className="text-display font-stratos-extrabold text-blue-600 leading-tight">
                    What's your nail vibe?
                  </h1>
                </div>

                {/* Textarea appearing */}
                <div 
                  className="mt-10 transition-all duration-500 ease-out"
                  style={{
                    opacity: 1,
                    transform: 'translateY(0) scale(1)',
                    animation: 'fadeInUp 1s ease-out 0.4s both'
                  }}
                >
                  <div className="textarea-long-container">
                    <div 
                      className="textarea-long"
                      style={{
                        background: 'rgba(252, 252, 252, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(230, 230, 230, 0.8)'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating particles for extra magic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 2}s`,
              opacity: Math.random() * 0.6 + 0.2
            }}
          />
        ))}
      </div>

      {/* Custom keyframes for the transition */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}