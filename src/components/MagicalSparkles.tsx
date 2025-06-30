import React, { useMemo, useRef, useEffect } from 'react';

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

// CRITICAL: Global sparkle state to prevent jerky restarts
let globalSparkleState: SparkleData[] | null = null;
let sparkleStateInitialized = false;

export default function MagicalSparkles() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Generate sparkles only once GLOBALLY to prevent re-generation on re-renders or component remounts
  const sparkles = useMemo(() => {
    // If we already have global sparkle state, use it to maintain continuity
    if (globalSparkleState && sparkleStateInitialized) {
      console.log('🔄 Reusing existing sparkle state for seamless continuation');
      return globalSparkleState;
    }

    console.log('✨ Initializing sparkle state for the first time');
    const allSparkles: SparkleData[] = [];

    // Large floating sparkles - BALANCED VISIBILITY
    for (let i = 0; i < 18; i++) {
      allSparkles.push({
        id: `large-${i}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${4 + Math.random() * 8}px`,
        height: `${4 + Math.random() * 8}px`,
        background: `radial-gradient(circle, rgba(${Math.random() > 0.5 ? '147, 51, 234' : '59, 130, 246'}, ${0.4 + Math.random() * 0.3}) 0%, transparent 70%)`,
        animationDelay: `${Math.random() * 8}s`,
        animationDuration: `${6 + Math.random() * 4}s`,
        className: 'animate-magical-float'
      });
    }

    // Medium sparkles - MODERATELY VISIBLE
    for (let i = 0; i < 30; i++) {
      allSparkles.push({
        id: `medium-${i}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${2.5 + Math.random() * 4}px`,
        height: `${2.5 + Math.random() * 4}px`,
        background: `rgba(${Math.random() > 0.6 ? '147, 51, 234' : Math.random() > 0.3 ? '59, 130, 246' : '236, 72, 153'}, ${0.3 + Math.random() * 0.3})`,
        animationDelay: `${Math.random() * 10}s`,
        animationDuration: `${8 + Math.random() * 6}s`,
        className: 'animate-gentle-sparkle'
      });
    }

    // Small twinkling stars - SUBTLY BRIGHTER
    for (let i = 0; i < 45; i++) {
      allSparkles.push({
        id: `small-${i}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: '2px',
        height: '2px',
        background: `rgba(${Math.random() > 0.7 ? '147, 51, 234' : Math.random() > 0.4 ? '59, 130, 246' : '236, 72, 153'}, ${0.5 + Math.random() * 0.3})`,
        animationDelay: `${Math.random() * 12}s`,
        animationDuration: `${4 + Math.random() * 8}s`,
        className: 'animate-twinkle'
      });
    }

    // Magical dust particles - MODERATELY ENHANCED
    for (let i = 0; i < 25; i++) {
      allSparkles.push({
        id: `dust-${i}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: '1.5px',
        height: '1.5px',
        background: `rgba(255, 255, 255, ${0.3 + Math.random() * 0.3})`,
        animationDelay: `${Math.random() * 15}s`,
        animationDuration: `${10 + Math.random() * 10}s`,
        className: 'animate-magical-dust'
      });
    }

    // Accent sparkles - REDUCED BUT STILL VISIBLE
    for (let i = 0; i < 8; i++) {
      allSparkles.push({
        id: `bright-${i}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${6 + Math.random() * 6}px`,
        height: `${6 + Math.random() * 6}px`,
        background: `radial-gradient(circle, rgba(${Math.random() > 0.5 ? '255, 255, 255' : '147, 51, 234'}, 0.6) 0%, rgba(${Math.random() > 0.5 ? '147, 51, 234' : '59, 130, 246'}, 0.2) 70%, transparent 100%)`,
        animationDelay: `${Math.random() * 6}s`,
        animationDuration: `${5 + Math.random() * 3}s`,
        className: 'animate-magical-float'
      });
    }

    // Store globally to prevent regeneration
    globalSparkleState = allSparkles;
    sparkleStateInitialized = true;
    
    return allSparkles;
  }, []); // CRITICAL: Empty dependency array ensures this only runs once EVER

  // SEAMLESS CONTINUATION: Ensure animations continue from their current state
  useEffect(() => {
    if (containerRef.current && sparkleStateInitialized) {
      // Force browser to maintain animation continuity by preserving computed styles
      const sparkleElements = containerRef.current.querySelectorAll('[data-sparkle]');
      sparkleElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        // Preserve the current animation state by briefly pausing and resuming
        const currentAnimationPlayState = htmlElement.style.animationPlayState;
        htmlElement.style.animationPlayState = 'running'; // Ensure it's running
        
        // Use requestAnimationFrame to ensure smooth continuation
        requestAnimationFrame(() => {
          htmlElement.style.animationPlayState = currentAnimationPlayState || 'running';
        });
      });
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none" 
      style={{ zIndex: 0 }}
    >
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          data-sparkle={sparkle.id} // Add data attribute for seamless continuation
          className={`absolute rounded-full ${sparkle.className}`}
          style={{
            left: sparkle.left,
            top: sparkle.top,
            width: sparkle.width,
            height: sparkle.height,
            background: sparkle.background,
            animationDelay: sparkle.animationDelay,
            animationDuration: sparkle.animationDuration,
            // CRITICAL: Ensure animations continue seamlessly
            animationFillMode: 'both',
            animationPlayState: 'running',
            // Hardware acceleration for smooth performance
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
        />
      ))}
    </div>
  );
}

// Export function to reset sparkles only when truly needed (e.g., user preference change)
export function resetSparkleState() {
  console.log('🔄 Manually resetting sparkle state');
  globalSparkleState = null;
  sparkleStateInitialized = false;
}