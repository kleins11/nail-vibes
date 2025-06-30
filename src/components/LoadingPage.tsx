import React from 'react';

interface LoadingPageProps {
  onLogoClick: () => void;
}

export default function LoadingPage({ onLogoClick }: LoadingPageProps) {
  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: '#F5F1EC' }}>
      {/* CLEAN LOADING STATE - NO HEADER, NO LOGO, NO PREMATURE ELEMENTS */}
      
      {/* Loading Content - Centered and minimal */}
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

      {/* NO FOOTER - Keep it completely clean */}
    </div>
  );
}