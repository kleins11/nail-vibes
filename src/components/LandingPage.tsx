import React from 'react';
import { ArrowUp } from 'lucide-react';
import GradientShapesScroll from './GradientShapesScroll';

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
    <div className="min-h-screen bg-input-background flex flex-col relative">
      {/* Header */}
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="flex justify-center md:justify-start pt-8 pb-4">
          <button 
            onClick={onLogoClick}
            className="text-2xl font-pilar font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            nailvibes
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center pb-20">
        <div className="m3-grid-container">
          <div className="m3-grid">
            <div className="m3-content-area">
              <h1 className="text-display font-stratos-extrabold text-blue-600 mb-8 leading-tight text-center">
                What's your nail vibe?
              </h1>
              
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
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

              {/* Divider */}
              <div className="my-8 border-t border-gray-200"></div>

              {/* Generate Image Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Generate Custom Design
                </h2>
                
                {/* Generate Error Message */}
                {generateError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{generateError}</p>
                  </div>
                )}
                
                <div className="relative">
                  <textarea
                    value={generatePrompt}
                    onChange={(e) => setGeneratePrompt(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, false, false, true)}
                    placeholder="Describe the nail design you want to generate..."
                    className="w-full h-20 p-4 text-sm textarea-calling-code placeholder-calling-code border border-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                    disabled={isGenerating}
                  />
                </div>
                
                <button
                  onClick={onGenerateImage}
                  disabled={!generatePrompt.trim() || isGenerating}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg transition-colors font-medium flex items-center justify-center"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    'Generate Image'
                  )}
                </button>
                
                {/* Generated Image Display */}
                {generatedImageUrl && (
                  <div className="mt-4">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={generatedImageUrl} 
                        alt="Generated nail design" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = SAMPLE_NAIL_IMAGE;
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gradient Shapes Auto-Scroll - Only on landing page */}
      <GradientShapesScroll />
    </div>
  );
}