import React from 'react';
import { X, Minus, ArrowUp, Maximize2, RotateCcw } from 'lucide-react';
import { VibeMatchData } from '../services/vibeService';

interface ChatMessage {
  id: string;
  type: 'user' | 'system';
  content: string;
  timestamp: Date;
}

interface ResultPageProps {
  currentVibe: VibeMatchData | null;
  matchInfo: {
    primaryTags: string[];
    modifierTags: string[];
    matchedConcept: string | null;
    searchStrategy: string;
  } | null;
  refinedImageUrl: string;
  isRefining: boolean;
  refinePrompt: string;
  setRefinePrompt: (prompt: string) => void;
  chatMessages: ChatMessage[];
  isChatOpen: boolean;
  isTyping: boolean;
  prompt: string;
  onLogoClick: () => void;
  onRefineSubmit: () => void;
  onOpenChat: () => void;
  onCloseChat: () => void;
  onChatInputFocus: () => void;
  onChatInputBlur: () => void;
  handleKeyPress: (e: React.KeyboardEvent, isChat?: boolean, isRefine?: boolean, isGenerate?: boolean) => void;
}

const SAMPLE_NAIL_IMAGE = "https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=800";

export default function ResultPage({
  currentVibe,
  matchInfo,
  refinedImageUrl,
  isRefining,
  refinePrompt,
  setRefinePrompt,
  chatMessages,
  isChatOpen,
  isTyping,
  prompt,
  onLogoClick,
  onRefineSubmit,
  onOpenChat,
  onCloseChat,
  onChatInputFocus,
  onChatInputBlur,
  handleKeyPress
}: ResultPageProps) {
  const imageUrl = currentVibe?.image_url || SAMPLE_NAIL_IMAGE;
  const displayImageUrl = refinedImageUrl || imageUrl;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="flex justify-start pt-8 pb-4">
          <button 
            onClick={onLogoClick}
            className="text-2xl font-pilar font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            nv
          </button>
        </div>
      </div>
      
      {/* Main Content - Two Column Layout for Desktop */}
      <div className="flex-1 flex">
        {/* Desktop Layout: Two Columns */}
        <div className="hidden lg:flex w-full">
          {/* Left Column: Chat */}
          <div className="w-1/2 flex flex-col border-r border-gray-200" style={{ backgroundColor: '#F5F1EC' }}>
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  {prompt}
                </span>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className="space-y-2">
                  {message.type === 'user' ? (
                    <div className="bg-blue-100 text-blue-800 p-4 rounded-2xl max-w-xs ml-auto">
                      <p className="text-sm font-calling-code">{message.content}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">🤖</span>
                        </div>
                      </div>
                      <p className="font-calling-code text-xl lg:text-xl text-[#3F3F3F] leading-relaxed">{message.content}</p>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isRefining && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🤖</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                    <span className="text-sm text-gray-500 italic">Refining your design...</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Chat Input */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, false, true)}
                  placeholder="Keep vibing"
                  className="flex-1 px-4 py-3 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-calling-code textarea-calling-code"
                  disabled={isRefining}
                />
                <button
                  onClick={onRefineSubmit}
                  disabled={!refinePrompt.trim() || isRefining}
                  className="px-4 py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-full transition-colors text-sm font-medium"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Column: Image */}
          <div className="w-1/2 flex flex-col">
            {/* Image Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">💅</span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {currentVibe?.title || "Black French tips on short natural nails"}
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Maximize2 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <RotateCcw className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Image Display */}
            <div className="flex-1 p-6 flex items-center justify-center">
              <div className="relative max-w-md w-full">
                <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src={displayImageUrl} 
                    alt="Generated nail design" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = SAMPLE_NAIL_IMAGE;
                    }}
                  />
                  
                  {/* Refining indicator */}
                  {isRefining && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                        <p className="text-sm">Refining design...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile/Tablet Layout: Single Column with Modal Chat */}
        <div className="lg:hidden w-full flex flex-col justify-center">
          <div className="m3-grid-container">
            <div className="m3-grid">
              <div className="m3-content-area">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-6 relative">
                  <img 
                    src={displayImageUrl} 
                    alt="Generated nail design" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = SAMPLE_NAIL_IMAGE;
                    }}
                  />
                  
                  {/* Refining indicator */}
                  {isRefining && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                        <p className="text-sm">Refining design...</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Enhanced Vibe Info */}
                {currentVibe && (
                  <div className="mb-4 text-center">
                    {currentVibe.title && (
                      <h2 className="text-lg font-semibold text-gray-800 mb-2">
                        {currentVibe.title}
                      </h2>
                    )}
                    
                    {/* Match Type and Score Display */}
                    <div className="mb-3 space-y-2">
                      {matchInfo?.matchedConcept && (
                        <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                          ✨ {matchInfo.matchedConcept} inspired
                        </div>
                      )}
                      
                      {currentVibe.match_type === 'all_primary' && (
                        <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full ml-2">
                          🎯 Perfect match
                        </div>
                      )}
                      
                      {currentVibe.match_type === 'some_primary' && (
                        <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full ml-2">
                          ✅ Great match
                        </div>
                      )}
                      
                      {currentVibe.primary_matches > 0 && (
                        <div className="text-xs text-gray-600 mt-1">
                          {currentVibe.primary_matches} core match{currentVibe.primary_matches > 1 ? 'es' : ''}
                          {currentVibe.modifier_matches > 0 && ` + ${currentVibe.modifier_matches} style match${currentVibe.modifier_matches > 1 ? 'es' : ''}`}
                        </div>
                      )}
                    </div>
                    
                    {/* Tags Display */}
                    {currentVibe.tags && currentVibe.tags.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2 mb-2">
                        {currentVibe.tags.slice(0, 6).map((tag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {currentVibe.tags.length > 6 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{currentVibe.tags.length - 6} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Chat Trigger */}
                <div className="text-center">
                  <button
                    onClick={onOpenChat}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <span className="text-sm font-medium">Keep vibing</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Chat Drawer */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onCloseChat}
          />
          
          {/* Chat Panel */}
          <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl max-h-[80vh] flex flex-col animate-slide-up" style={{ backgroundColor: '#F5F1EC' }}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <button
                onClick={onCloseChat}
                className="w-8 h-8 flex items-center justify-center"
              >
                <Minus className="w-6 h-6 text-gray-400" />
              </button>
              <button
                onClick={onCloseChat}
                className="w-8 h-8 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className="space-y-2">
                  {message.type === 'user' ? (
                    <div className="bg-red-100 text-red-800 p-3 rounded-lg max-w-xs ml-auto">
                      <p className="text-sm">{message.content}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="font-calling-code text-base sm:text-xl text-[#3F3F3F]">{message.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, false, true)}
                  onFocus={onChatInputFocus}
                  onBlur={onChatInputBlur}
                  placeholder="make it chrome, add glitter, more pink..."
                  className="flex-1 px-4 py-3 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-calling-code textarea-calling-code"
                  disabled={isRefining}
                />
                <button
                  onClick={onRefineSubmit}
                  disabled={!refinePrompt.trim() || isRefining}
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 rounded-lg flex items-center justify-center transition-colors"
                >
                  {isRefining ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <ArrowUp className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Typing Indicator */}
            {isTyping && !isRefining && (
              <div className="p-4 pt-0">
                <div className="text-xs text-gray-500 italic">
                  Typing...
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}