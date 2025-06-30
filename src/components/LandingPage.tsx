import React from 'react';
import { ArrowUp } from 'lucide-react';
import GradientShapesScroll from './GradientShapesScroll';
import MagicalSparkles from './MagicalSparkles';
import Footer from './Footer';

interface LandingPageProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  generatePrompt: string;
  setGeneratePrompt: (prompt: string) => void;
  generatedImageUrl: string;
  isGenerating: boolean;
  generateError: string | null;
  error: string | null;
  onInitialSubmit: () => void;
  onGenerateImage: () => void;
  onLogoClick: () => void;
  handleKeyPress: (e: React.KeyboardEvent, isChat?: boolean, isRefine?: boolean, isGenerate?: boolean) => void;
}

const SAMPLE_NAIL_IMAGE = "https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=800";

export default function LandingPage({
  prompt,
  setPrompt,
  generatePrompt,
  setGeneratePrompt,
  generatedImageUrl,
  isGenerating,
  generateError,
  error,
  onInitialSubmit,
  onGenerateImage,
  onLogoClick,
  handleKeyPress
}: LandingPageProps) {
  return (
    <div className="min-h-screen bg-input-background flex flex-col relative landing-page">
      {/* SEAMLESS SPARKLE CONTINUATION: Magical Sparkly Background Effect - Behind all content */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <MagicalSparkles />
      </div>

      {/* Header - Updated to use Material Design Grid for alignment */}
      <div className="w-full" style={{ zIndex: 10 }}>
        {/* Mobile: Center the logo */}
        <div className="flex justify-center pt-8 pb-4 md:hidden px-4">
          <button 
            onClick={onLogoClick}
            className="transition-all duration-300 hover:scale-105 hover:opacity-80"
          >
            <img 
              src="/nail-vibes-short-logo.png" 
              alt="NailVibes" 
              className="h-8 w-auto object-contain"
            />
          </button>
        </div>

        {/* Tablet & Desktop: Use Material Design Grid for alignment */}
        <div className="hidden md:block">
          <div className="m3-grid-container">
            <div className="m3-grid">
              <div className="pt-8 pb-4 md:col-span-8 lg:col-span-12">
                <button 
                  onClick={onLogoClick}
                  className="transition-all duration-300 hover:scale-105 hover:opacity-80"
                >
                  <img 
                    src="/nail-vibes-long-logo.png" 
                    alt="NailVibes" 
                    className="h-8 w-auto object-contain"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center pb-20" style={{ zIndex: 10 }}>
        <div className="m3-grid-container">
          <div className="m3-grid">
            <div className="m3-content-area">
              <h1 className="text-display font-stratos-extrabold text-blue-600 mb-8 leading-tight text-center">
                What's your nail vibe?
              </h1>
              
              {/* Error Message - Fixed z-index and spacing */}
              {error && (
                <div className="relative z-10 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
                  <p className="text-sm text-red-600 font-calling-code">{error}</p>
                </div>
              )}
              
              <div className="textarea-long-container">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e)}
                  placeholder="Harry Potter cutesy, Barbie glam metallic, dark academia matte"
                  className="textarea-long placeholder-calling-code"
                />
                
                <button
                  onClick={onInitialSubmit}
                  disabled={!prompt.trim()}
                  className="textarea-long-button bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white transition-colors"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      
      {/* Gradient Shapes Auto-Scroll - Only on landing page */}
      <div style={{ zIndex: 10 }}>
        <GradientShapesScroll />
      </div>

      {/* Footer */}
      <div style={{ zIndex: 10 }}>
        <Footer />
      </div>
    </div>
  );
}