import React from 'react';

interface LoadingPageProps {
  onLogoClick: () => void;
}

export default function LoadingPage({ onLogoClick }: LoadingPageProps) {
  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: '#F5F1EC' }}>
      {/* Header */}
      <div className="w-full px-4 md:px-8 lg:px-12">
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
      <div className="flex-1 flex flex-col justify-center">
        <div className="m3-grid-container">
          <div className="m3-grid">
            <div className="m3-content-area text-center">
              
              {/* Simple elegant spinner */}
              <div className="mb-6 flex justify-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>

              {/* Clean loading text */}
              <p className="text-gray-600 font-calling-code">Finding your perfect vibe...</p>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}