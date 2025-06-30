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

    // Large floating sparkles
    for (let i = 0; i < 20; i++) {
      allSparkles.push({
        id: `large-${i}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${4 + Math.random() * 8}px`,
        height: `${4 + Math.random() * 8}px`,
        background: `radial-gradient(circle, rgba(${Math.random() > 0.5 ? '147, 51, 234' : '59, 130, 246'}, ${0.3 + Math.random() * 0.4}) 0%, transparent 70%)`,
        animationDelay: `${Math.random() * 8}s`,
        animationDuration: `${6 + Math.random() * 4}s`,
        className: 'animate-magical-float'
      });
    }

    // Medium sparkles
    for (let i = 0; i < 35; i++) {
      allSparkles.push({
        id: `medium-${i}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${2 + Math.random() * 4}px`,
        height: `${2 + Math.random() * 4}px`,
        background: `rgba(${Math.random() > 0.6 ? '147, 51, 234' : Math.random() > 0.3 ? '59, 130, 246' : '236, 72, 153'}, ${0.2 + Math.random() * 0.3})`,
        animationDelay: `${Math.random() * 10}s`,
        animationDuration: `${8 + Math.random() * 6}s`,
        className: 'animate-gentle-sparkle'
      });
    }

    // Small twinkling stars
    for (let i = 0; i < 50; i++) {
      allSparkles.push({
        id: `small-${i}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: '1.5px',
        height: '1.5px',
        background: `rgba(${Math.random() > 0.7 ? '147, 51, 234' : Math.random() > 0.4 ? '59, 130, 246' : '236, 72, 153'}, ${0.4 + Math.random() * 0.4})`,
        animationDelay: `${Math.random() * 12}s`,
        animationDuration: `${4 + Math.random() * 8}s`,
        className: 'animate-twinkle'
      });
    }

    // Magical dust particles
    for (let i = 0; i < 30; i++) {
      allSparkles.push({
        id: `dust-${i}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: '1px',
        height: '1px',
        background: `rgba(255, 255, 255, ${0.2 + Math.random() * 0.3})`,
        animationDelay: `${Math.random() * 15}s`,
        animationDuration: `${10 + Math.random() * 10}s`,
        className: 'animate-magical-dust'
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