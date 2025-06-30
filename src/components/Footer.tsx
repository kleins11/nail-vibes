import React from 'react';

interface FooterProps {
  variant?: 'default' | 'minimal';
}

export default function Footer({ variant = 'default' }: FooterProps) {
  const isMinimal = variant === 'minimal';
  
  return (
    <footer className={`w-full py-6 px-4 md:px-8 lg:px-12 ${isMinimal ? '' : 'border-t border-gray-100 bg-white/50 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left side - Small logo image */}
        <div className="flex-shrink-0">
          <img 
            src="https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//white_circle_360x360.png"
            alt="NailVibes logo"
            className="w-8 h-8 md:w-10 md:h-10 object-contain opacity-60 hover:opacity-80 transition-opacity duration-200"
          />
        </div>

        {/* Right side - Creator credits */}
        <div className="text-xs md:text-sm font-calling-code text-gray-500">
          Created by{' '}
          <a 
            href="https://www.linkedin.com/in/sarahforimpact/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 transition-colors duration-200 underline decoration-1 underline-offset-2 hover:decoration-2"
          >
            Sarah
          </a>
          {' '}and{' '}
          <a 
            href="https://www.linkedin.com/in/nikolai-tangdit/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 transition-colors duration-200 underline decoration-1 underline-offset-2 hover:decoration-2"
          >
            Nikolai
          </a>
        </div>
      </div>
    </footer>
  );
}