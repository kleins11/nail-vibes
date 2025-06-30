import React from 'react';
import { MessageCircle, X, ArrowUp } from 'lucide-react';
import { VibeMatchData } from '../services/vibeService';
import MagicalLoadingOverlay from './MagicalLoadingOverlay';
import Footer from './Footer';

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
  handleKeyPress: (e: React.KeyboardEvent, isChat?: boolean, isRefine?: boolean) => void;
}

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
  if (!currentVibe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">No vibe data available</p>
      </div>
    );
  }

  // Use refined image if available, otherwise use original
  const displayImageUrl = refinedImageUrl || currentVibe.image_url;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="w-full bg-white border-b border-gray-100 px-4 md:px-8 lg:px-12">
        <div className="flex justify-between items-center py-4">
          {/* Logo - Updated to use PNG image */}
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

          {/* Chat Toggle Button */}
          <button
            onClick={isChatOpen ? onCloseChat : onOpenChat}
            className="lg:hidden p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            {isChatOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Side - Image and Controls */}
        <div className="flex-1 p-4 md:p-8 lg:p-12">
          <div className="max-w-2xl mx-auto">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
              {currentVibe.title || 'Your Perfect Nail Vibe'}
            </h1>

            {/* Image Container with Loading Overlay */}
            <div className="relative mb-8">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg bg-gray-100">
                <img 
                  src={displayImageUrl} 
                  alt={currentVibe.title || 'Nail design'} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Magical Loading Overlay */}
              <MagicalLoadingOverlay 
                isVisible={isRefining} 
                message="Refining your design..."
              />
            </div>

            {/* Refine Input */}
            <div className="relative mb-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, false, true)}
                  placeholder="Make it more sparkly, change the color, add flowers..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-short font-calling-code"
                  disabled={isRefining}
                />
                <button
                  onClick={onRefineSubmit}
                  disabled={!refinePrompt.trim() || isRefining}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors input-button"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Match Info - Debug Information */}
            {matchInfo && (
              <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Match Details</h3>
                <div className="space-y-1 text-sm text-gray-600 font-calling-code">
                  {matchInfo.matchedConcept && (
                    <p><span className="font-medium">Concept:</span> {matchInfo.matchedConcept}</p>
                  )}
                  {matchInfo.primaryTags.length > 0 && (
                    <p><span className="font-medium">Primary tags:</span> {matchInfo.primaryTags.join(', ')}</p>
                  )}
                  {matchInfo.modifierTags.length > 0 && (
                    <p><span className="font-medium">Modifiers:</span> {matchInfo.modifierTags.join(', ')}</p>
                  )}
                  <p><span className="font-medium">Strategy:</span> {matchInfo.searchStrategy}</p>
                  {currentVibe.match_score !== undefined && (
                    <p><span className="font-medium">Score:</span> {currentVibe.match_score.toFixed(2)}</p>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {currentVibe.tags && currentVibe.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {currentVibe.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-calling-code"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {currentVibe.description && (
              <p className="text-gray-600 text-center font-calling-code">
                {currentVibe.description}
              </p>
            )}
          </div>
        </div>

        {/* Right Side - Chat Panel (Desktop) */}
        <div className={`hidden lg:flex lg:w-96 bg-white border-l border-gray-200 flex-col ${isChatOpen ? 'flex' : 'hidden'}`}>
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Chat</h2>
              <button
                onClick={onCloseChat}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg font-calling-code text-sm ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask for changes..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-short font-calling-code text-sm"
                onFocus={onChatInputFocus}
                onBlur={onChatInputBlur}
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors input-button">
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Chat Overlay */}
      {isChatOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-2xl max-h-[80vh] flex flex-col animate-slide-up">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Chat</h2>
              <button
                onClick={onCloseChat}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg font-calling-code text-sm ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask for changes..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-short font-calling-code text-sm"
                  onFocus={onChatInputFocus}
                  onBlur={onChatInputBlur}
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors input-button">
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}