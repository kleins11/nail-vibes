import React, { useEffect, useState } from 'react';

interface LoadingPageProps {
  onLogoClick: () => void;
}

export default function LoadingPage({ onLogoClick }: LoadingPageProps) {
  const [dots, setDots] = useState('');
  const [currentMessage, setCurrentMessage] = useState(0);
  const [shimmerPhase, setShimmerPhase] = useState(0);

  // Loading messages that cycle through
  const loadingMessages = [
    "Discovering your perfect vibe",
    "Matching your aesthetic",
    "Finding the ideal design",
    "Curating your inspiration"
  ];

  // Animated dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Cycle through messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Shimmer animation phase
  useEffect(() => {
    const interval = setInterval(() => {
      setShimmerPhase(prev => (prev + 1) % 3);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: '#F5F1EC' }}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Gradient background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-200/30 via-pink-200/20 to-blue-200/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '0s', animationDuration: '4s' }}
        />
        <div 
          className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-br from-blue-200/30 via-purple-200/20 to-pink-200/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s', animationDuration: '5s' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-pink-200/40 via-purple-200/30 to-blue-200/40 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: '1s', animationDuration: '3s' }}
        />
      </div>
      
      {/* Header */}
      <div className="w-full px-4 md:px-8 lg:px-12 relative z-10">
        <div className="flex justify-center md:justify-start pt-8 pb-4">
          <button 
            onClick={onLogoClick}
            className="text-2xl font-pilar font-bold text-blue-600 hover:text-blue-700 transition-colors focus-ring"
          >
            nv
          </button>
        </div>
      </div>
      
      {/* Loading Content */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="m3-grid-container">
          <div className="m3-grid">
            <div className="m3-content-area text-center">
              
              {/* Main magical spinner */}
              <div className="relative mb-8 flex justify-center">
                <div className="relative">
                  {/* Outer rotating ring */}
                  <div className="w-20 h-20 border-4 border-blue-200/30 rounded-full animate-spin-slow">
                    <div className="absolute inset-0 border-4 border-transparent border-t-blue-500/80 border-r-blue-400/60 rounded-full animate-spin"></div>
                  </div>
                  
                  {/* Middle ring */}
                  <div className="absolute inset-2 border-3 border-purple-200/40 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '4s' }}>
                    <div className="absolute inset-0 border-3 border-transparent border-l-purple-500/70 border-b-purple-400/50 rounded-full"></div>
                  </div>
                  
                  {/* Inner shimmer */}
                  <div className="absolute inset-4 bg-gradient-to-r from-blue-400/30 via-purple-400/40 to-pink-400/30 rounded-full animate-pulse"></div>
                  
                  {/* Center glow */}
                  <div className="absolute inset-6 bg-white/20 rounded-full animate-ping"></div>
                  
                  {/* Central icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>
                      ✨
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic loading text */}
              <div className="space-y-4 mb-8">
                <h2 className="text-2xl font-stratos-extrabold text-blue-600">
                  <span className="inline-block animate-shimmer bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_100%]">
                    {loadingMessages[currentMessage]}{dots}
                  </span>
                </h2>
                
                {/* Subtitle with staggered animations */}
                <div className="space-y-2">
                  <p className="text-gray-600 font-calling-code text-sm">
                    <span className={`inline-block transition-all duration-700 ${shimmerPhase === 0 ? 'opacity-100 transform translate-y-0' : 'opacity-50 transform translate-y-1'}`}>
                      Analyzing your style preferences
                    </span>
                  </p>
                  <p className="text-gray-500 font-calling-code text-xs">
                    <span className={`inline-block transition-all duration-700 ${shimmerPhase === 1 ? 'opacity-100 transform translate-y-0' : 'opacity-30 transform translate-y-1'}`}>
                      Searching through thousands of designs
                    </span>
                  </p>
                </div>
              </div>

              {/* Elegant progress bar */}
              <div className="w-64 mx-auto mb-6">
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-progress"></div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="relative">
                <div className="flex justify-center space-x-8">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-blue-400/60 rounded-full animate-bounce"
                      style={{
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: '1.5s'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Inspirational text */}
              <div className="mt-8">
                <p className="text-gray-400 font-calling-code text-xs italic animate-pulse">
                  "Every nail tells a story"
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Subtle corner accents */}
      <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-blue-300/30 rounded-tl-2xl"></div>
      <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-purple-300/30 rounded-tr-2xl"></div>
      <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-pink-300/30 rounded-bl-2xl"></div>
      <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-blue-300/30 rounded-br-2xl"></div>
    </div>
  );
}