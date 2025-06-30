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

    // Large floating sparkles - MORE PRONOUNCED
    for (let i = 0; i < 25; i++) {
      allSparkles.push({
        id: `large-${i}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${6 + Math.random() * 12}px`, // Increased from 4-12px to 6-18px
        height: `${6 + Math.random() * 12}px`,
        background: `radial-gradient(circle, rgba(${Math.random() > 0.5 ? '147, 51, 234' : '59, 130, 246'}, ${0.6 + Math.random() * 0.4}) 0%, transparent 70%)`, // Increased opacity from 0.3-0.7 to 0.6-1.0
        animationDelay: `${Math.random() * 8}s`,
        animationDuration: `${6 + Math.random() * 4}s`,
        className: 'animate-magical-float'
      });
    }

    // Medium sparkles - MORE VISIBLE
    for (let i = 0; i < 40; i++) {
      allSparkles.push({
        id: `medium-${i}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${3 + Math.random() * 6}px`, // Increased from 2-6px to 3-9px
        height: `${3 + Math.random() * 6}px`,
        background: `rgba(${Math.random() > 0.6 ? '147, 51, 234' : Math.random() > 0.3 ? '59, 130, 246' : '236, 72, 153'}, ${0.5 + Math.random() * 0.4})`, // Increased opacity from 0.2-0.5 to 0.5-0.9
        animationDelay: `${Math.random() * 10}s`,
        animationDuration: `${8 + Math.random() * 6}s`,
        className: 'animate-gentle-sparkle'
      });
    }

    // Small twinkling stars - BRIGHTER
    for (let i = 0; i < 60; i++) {
      allSparkles.push({
        id: `small-${i}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: '2.5px', // Increased from 1.5px to 2.5px
        height: '2.5px',
        background: `rgba(${Math.random() > 0.7 ? '147, 51, 234' : Math.random() > 0.4 ? '59, 130, 246' : '236, 72, 153'}, ${0.7 + Math.random() * 0.3})`, // Increased opacity from 0.4-0.8 to 0.7-1.0
        animationDelay: `${Math.random() * 12}s`,
        animationDuration: `${4 + Math.random() * 8}s`,
        className: 'animate-twinkle'
      });
    }

    // Magical dust particles - BRIGHTER AND MORE VISIBLE
    for (let i = 0; i < 35; i++) {
      allSparkles.push({
        id: `dust-${i}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: '2px', // Increased from 1px to 2px
        height: '2px',
        background: `rgba(255, 255, 255, ${0.4 + Math.random() * 0.4})`, // Increased opacity from 0.2-0.5 to 0.4-0.8
        animationDelay: `${Math.random() * 15}s`,
        animationDuration: `${10 + Math.random() * 10}s`,
        className: 'animate-magical-dust'
      });
    }

    // NEW: Extra bright accent sparkles for maximum visibility
    for (let i = 0; i < 15; i++) {
      allSparkles.push({
        id: `bright-${i}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${8 + Math.random() * 8}px`,
        height: `${8 + Math.random() * 8}px`,
        background: `radial-gradient(circle, rgba(${Math.random() > 0.5 ? '255, 255, 255' : '147, 51, 234'}, 0.9) 0%, rgba(${Math.random() > 0.5 ? '147, 51, 234' : '59, 130, 246'}, 0.3) 70%, transparent 100%)`, // Very bright with white centers
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