import React, { useEffect, useRef } from 'react';
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

// Chat bubble color styles that rotate
const CHAT_BUBBLE_STYLES = [
  {
    backgroundColor: '#F9D9D9',
    borderColor: '#DC9090'
  },
  {
    backgroundColor: '#E6EEFF',
    borderColor: '#92B5FA'
  },
  {
    backgroundColor: '#ECE0FE',
    borderColor: '#B796E8'
  }
];

// Gradient shapes from Supabase bucket
const GRADIENT_SHAPES = [
  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-11-Col2%201.png",
  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-12-Col4%201.png",
  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-1-Col3%201.png",
  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-2-Col5%201.png",
  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-4-Col8%201.png",
  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-5-Col10%201.png",
  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-5-Col1%201.png",
  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-6-Col4%201.png",
  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-7-Col9%201.png",
  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-8-Col2%201.png"
];

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

  // Refs for auto-scrolling
  const desktopChatMessagesRef = useRef<HTMLDivElement>(null);
  const mobileChatMessagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    // Scroll desktop chat to bottom
    if (desktopChatMessagesRef.current) {
      desktopChatMessagesRef.current.scrollTop = desktopChatMessagesRef.current.scrollHeight;
    }
    
    // Scroll mobile chat to bottom
    if (mobileChatMessagesRef.current) {
      mobileChatMessagesRef.current.scrollTop = mobileChatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages, isRefining]); // Trigger on message changes and refining state

  // Function to get chat bubble style based on user message index
  const getChatBubbleStyle = (messageIndex: number) => {
    return CHAT_BUBBLE_STYLES[messageIndex % CHAT_BUBBLE_STYLES.length];
  };

  // Function to determine bubble width class based on content length
  const getBubbleWidthClass = (content: string) => {
    const length = content.length;
    if (length <= 30) return 'lg:max-w-[200px]'; // Short messages
    if (length <= 60) return 'lg:max-w-[280px]'; // Medium messages  
    if (length <= 100) return 'lg:max-w-[360px]'; // Long messages
    return 'lg:max-w-[400px]'; // Very long messages
  };

  // Function to get a random gradient shape for system messages
  const getRandomGradientShape = (messageId: string) => {
    // Use message ID to ensure consistent shape for each message
    const hash = messageId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const index = Math.abs(hash) % GRADIENT_SHAPES.length;
    return GRADIENT_SHAPES[index];
  };

  // Get only user messages to determine the correct index for styling
  const userMessages = chatMessages.filter(message => message.type === 'user');

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: '#FFFAF4' }}>
      {/* Header - Only for mobile/tablet */}
      <div className="w-full px-4 md:px-8 lg:hidden flex-shrink-0">
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
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Layout: Two Columns */}
        <div className="hidden lg:flex w-full h-full">
          {/* Left Column: Chat - Narrower width to match Figma */}
          <div className="w-1/4 flex flex-col border-r border-gray-200 h-full" style={{ backgroundColor: '#F5F1EC' }}>
            {/* Logo in Chat Section - Desktop Only with bottom border */}
            <div className="p-6 flex-shrink-0" style={{ borderBottom: '1px solid #D9CFC3' }}>
              <button 
                onClick={onLogoClick}
                className="text-2xl font-pilar font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                nv
              </button>
            </div>
            
            {/* Chat Messages - Scrollable with 30px bottom margin */}
            <div 
              ref={desktopChatMessagesRef}
              className="flex-1 overflow-y-auto p-6 space-y-4"
              style={{ marginBottom: '30px' }}
            >
              {chatMessages.map((message, index) => {
                // Find the index of this user message among all user messages
                const userMessageIndex = message.type === 'user' 
                  ? userMessages.findIndex(userMsg => userMsg.id === message.id)
                  : -1;
                
                const bubbleStyle = userMessageIndex >= 0 ? getChatBubbleStyle(userMessageIndex) : null;
                
                return (
                  <div key={message.id} className="space-y-2">
                    {message.type === 'user' ? (
                      <div 
                        className={`p-4 ml-auto border max-w-xs ${getBubbleWidthClass(message.content)} break-words overflow-wrap-anywhere`}
                        style={{ 
                          borderRadius: '24px 24px 0px 24px',
                          borderWidth: '1px',
                          backgroundColor: bubbleStyle?.backgroundColor,
                          borderColor: bubbleStyle?.borderColor,
                          color: '#3F3F3F',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          hyphens: 'auto'
                        }}
                      >
                        <p className="text-sm font-calling-code break-words">{message.content}</p>
                      </div>
                    ) : (
                      <div className="flex items-start space-x-2">
                        <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 mt-1">
                          <img 
                            src={getRandomGradientShape(message.id)}
                            alt="Gradient shape"
                            className="w-7 h-7 object-contain"
                          />
                        </div>
                        <p className="font-calling-code text-sm text-[#3F3F3F] leading-relaxed break-words flex-1">{message.content}</p>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Typing Indicator */}
              {isRefining && (
                <div className="flex items-start space-x-2">
                  <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 mt-1">
                    <img 
                      src={GRADIENT_SHAPES[0]}
                      alt="Gradient shape"
                      className="w-7 h-7 object-contain opacity-50"
                    />
                  </div>
                  <div className="flex items-center space-x-2 flex-1">
                    <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                    <span className="text-sm text-gray-500 italic">Refining your design...</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Chat Input - Fixed at bottom with shadow and proper spacing */}
            <div className="p-6 border-t border-gray-200 flex-shrink-0">
              <div className="relative">
                <input
                  type="text"
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, false, true)}
                  placeholder="Keep vibing"
                  className="w-full px-4 py-3 pr-12 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-calling-code textarea-calling-code"
                  style={{
                    boxShadow: '0 4px 8px 0 rgba(155, 155, 169, 0.25)'
                  }}
                  disabled={isRefining}
                />
                <button
                  onClick={onRefineSubmit}
                  disabled={!refinePrompt.trim() || isRefining}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  {isRefining ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <ArrowUp className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Column: Image - 3/4 width to match the narrower chat */}
          <div className="w-3/4 flex flex-col h-full relative">
            {/* Image Display - Takes up most of the space with title positioned around the image */}
            <div className="flex-1 p-8 flex flex-col justify-center overflow-hidden">
              <div className="relative w-full max-w-2xl mx-auto">
                {/* Title positioned to align with left edge of image - matching Figma */}
                <div className="mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">💅</span>
                    </div>
                    <h1 className="font-calling-code font-bold text-[#3F3F3F] text-xl">
                      {currentVibe?.title || "Black French tips on short natural nails"}
                    </h1>
                  </div>
                </div>
                
                {/* Image */}
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
            
            {/* Action buttons at bottom right - subtle positioning */}
            <div className="absolute bottom-8 right-8 flex items-center space-x-2">
              <button className="p-3 hover:bg-gray-100 rounded-full transition-colors bg-white shadow-sm">
                <Maximize2 className="w-5 h-5 text-gray-500" />
              </button>
              <button className="p-3 hover:bg-gray-100 rounded-full transition-colors bg-white shadow-sm">
                <RotateCcw className="w-5 h-5 text-gray-500" />
              </button>
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
                      <h1 className="font-calling-code font-bold text-[#3F3F3F] mb-2 text-lg">
                        {currentVibe.title}
                      </h1>
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
            <div 
              ref={mobileChatMessagesRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {chatMessages.map((message, index) => {
                // Find the index of this user message among all user messages
                const userMessageIndex = message.type === 'user' 
                  ? userMessages.findIndex(userMsg => userMsg.id === message.id)
                  : -1;
                
                const bubbleStyle = userMessageIndex >= 0 ? getChatBubbleStyle(userMessageIndex) : null;
                
                return (
                  <div key={message.id} className="space-y-2">
                    {message.type === 'user' ? (
                      <div 
                        className="p-3 max-w-xs ml-auto border break-words overflow-wrap-anywhere"
                        style={{ 
                          borderRadius: '24px 24px 0px 24px',
                          borderWidth: '1px',
                          backgroundColor: bubbleStyle?.backgroundColor,
                          borderColor: bubbleStyle?.borderColor,
                          color: '#3F3F3F',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          hyphens: 'auto'
                        }}
                      >
                        <p className="text-sm font-calling-code break-words">{message.content}</p>
                      </div>
                    ) : (
                      <div className="flex items-start space-x-2">
                        <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 mt-1">
                          <img 
                            src={getRandomGradientShape(message.id)}
                            alt="Gradient shape"
                            className="w-7 h-7 object-contain"
                          />
                        </div>
                        <p className="font-calling-code text-sm text-[#3F3F3F] break-words flex-1">{message.content}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Input Area with shadow and proper spacing */}
            <div className="p-4 border-t" style={{ marginTop: '30px' }}>
              <div className="relative">
                <input
                  type="text"
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, false, true)}
                  onFocus={onChatInputFocus}
                  onBlur={onChatInputBlur}
                  placeholder="make it chrome, add glitter, more pink..."
                  className="w-full px-4 py-3 pr-12 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-calling-code textarea-calling-code"
                  style={{
                    boxShadow: '0 4px 8px 0 rgba(155, 155, 169, 0.25)'
                  }}
                  disabled={isRefining}
                />
                <button
                  onClick={onRefineSubmit}
                  disabled={!refinePrompt.trim() || isRefining}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  {isRefining ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <ArrowUp className="w-4 h-4" />
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