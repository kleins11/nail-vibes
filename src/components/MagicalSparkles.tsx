import React, { useMemo } from 'react';

interface SparkleData {
  id: string;
  left: string;
  top: string;
  width: string;
  height: string;
  background: string;
  animationDelay: string;
  animationDuration: string;
  className: string;
}

export default function MagicalSparkles() {
  // Generate sparkles only once using useMemo to prevent re-generation on re-renders
  const sparkles = useMemo(() => {
    const allSparkles: SparkleData[] = [];

    // Large floating sparkles - BALANCED VISIBILITY
    for (let i = 0; i < 18; i++) { // Reduced from 25 to 18
      allSparkles.push({
        id: `large-${i}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${4 + Math.random() * 8}px`, // Balanced: 4-12px (between original 4-12 and enhanced 6-18)
        height: `${4 + Math.random() * 8}px`,
        background: `radial-gradient(circle, rgba(${Math.random() > 0.5 ? '147, 51, 234' : '59, 130, 246'}, ${0.4 + Math.random() * 0.3}) 0%, transparent 70%)`, // Balanced opacity: 0.4-0.7 (between original 0.3-0.7 and enhanced 0.6-1.0)
        animationDelay: `${Math.random() * 8}s`,
        animationDuration: `${6 + Math.random() * 4}s`,
        className: 'animate-magical-float'
      });
    }

    // Medium sparkles - MODERATELY VISIBLE
    for (let i = 0; i < 30; i++) { // Reduced from 40 to 30
      allSparkles.push({
        id: `medium-${i}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${2.5 + Math.random() * 4}px`, // Balanced: 2.5-6.5px (between original 2-6 and enhanced 3-9)
        height: `${2.5 + Math.random() * 4}px`,
        background: `rgba(${Math.random() > 0.6 ? '147, 51, 234' : Math.random() > 0.3 ? '59, 130, 246' : '236, 72, 153'}, ${0.3 + Math.random() * 0.3})`, // Balanced opacity: 0.3-0.6 (between original 0.2-0.5 and enhanced 0.5-0.9)
        animationDelay: `${Math.random() * 10}s`,
        animationDuration: `${8 + Math.random() * 6}s`,
        className: 'animate-gentle-sparkle'
      });
    }

    // Small twinkling stars - SUBTLY BRIGHTER
    for (let i = 0; i < 45; i++) { // Reduced from 60 to 45
      allSparkles.push({
        id: `small-${i}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: '2px', // Balanced: 2px (between original 1.5px and enhanced 2.5px)
        height: '2px',
        background: `rgba(${Math.random() > 0.7 ? '147, 51, 234' : Math.random() > 0.4 ? '59, 130, 246' : '236, 72, 153'}, ${0.5 + Math.random() * 0.3})`, // Balanced opacity: 0.5-0.8 (between original 0.4-0.8 and enhanced 0.7-1.0)
        animationDelay: `${Math.random() * 12}s`,
        animationDuration: `${4 + Math.random() * 8}s`,
        className: 'animate-twinkle'
      });
    }

    // Magical dust particles - MODERATELY ENHANCED
    for (let i = 0; i < 25; i++) { // Reduced from 35 to 25
      allSparkles.push({
        id: `dust-${i}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: '1.5px', // Balanced: 1.5px (between original 1px and enhanced 2px)
        height: '1.5px',
        background: `rgba(255, 255, 255, ${0.3 + Math.random() * 0.3})`, // Balanced opacity: 0.3-0.6 (between original 0.2-0.5 and enhanced 0.4-0.8)
        animationDelay: `${Math.random() * 15}s`,
        animationDuration: `${10 + Math.random() * 10}s`,
        className: 'animate-magical-dust'
      });
    }

    // Accent sparkles - REDUCED BUT STILL VISIBLE
    for (let i = 0; i < 8; i++) { // Reduced from 15 to 8
      allSparkles.push({
        id: `bright-${i}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${6 + Math.random() * 6}px`, // Reduced from 8-16px to 6-12px
        height: `${6 + Math.random() * 6}px`,
        background: `radial-gradient(circle, rgba(${Math.random() > 0.5 ? '255, 255, 255' : '147, 51, 234'}, 0.6) 0%, rgba(${Math.random() > 0.5 ? '147, 51, 234' : '59, 130, 246'}, 0.2) 70%, transparent 100%)`, // Reduced opacity from 0.9 to 0.6
        animationDelay: `${Math.random() * 6}s`,
        animationDuration: `${5 + Math.random() * 3}s`,
        className: 'animate-magical-float'
      });
    }

    return allSparkles;
  }, []); // Empty dependency array ensures this only runs once

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className={`absolute rounded-full ${sparkle.className}`}
          style={{
            left: sparkle.left,
            top: sparkle.top,
            width: sparkle.width,
            height: sparkle.height,
            background: sparkle.background,
            animationDelay: sparkle.animationDelay,
            animationDuration: sparkle.animationDuration
          }}
        />
      ))}
    </div>
  );
}