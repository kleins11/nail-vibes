import React, { useEffect, useRef, useState } from 'react';
import { X, Minus, ArrowUp, RefreshCw } from 'lucide-react';
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

  // State to track the most recently used gradient shape
  const [lastUsedGradientShape, setLastUsedGradientShape] = useState<string>(GRADIENT_SHAPES[0]);
  
  // State to track when new images have loaded
  const [imageLoadStates, setImageLoadStates] = useState<Record<string, boolean>>({});
  const [pendingGradientUpdates, setPendingGradientUpdates] = useState<Record<string, string>>({});

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

  // Handle gradient shape updates when images load
  useEffect(() => {
    const systemMessages = chatMessages.filter(message => message.type === 'system');
    if (systemMessages.length > 0) {
      const lastSystemMessage = systemMessages[systemMessages.length - 1];
      const newShape = getRandomGradientShape(lastSystemMessage.id);
      
      // Check if this is a refinement completion (when isRefining becomes false and we have a refined image)
      const isRefinementComplete = !isRefining && refinedImageUrl;
      
      if (isRefinementComplete) {
        // Store the pending gradient update for this message
        setPendingGradientUpdates(prev => ({
          ...prev,
          [lastSystemMessage.id]: newShape
        }));
        
        // Check if the refined image has already loaded
        if (imageLoadStates[refinedImageUrl]) {
          // Image is already loaded, update immediately
          setLastUsedGradientShape(newShape);
          setPendingGradientUpdates(prev => {
            const updated = { ...prev };
            delete updated[lastSystemMessage.id];
            return updated;
          });
        }
      } else if (!refinedImageUrl) {
        // No refinement, update immediately (initial load)
        setLastUsedGradientShape(newShape);
      }
    }
  }, [chatMessages, isRefining, refinedImageUrl, imageLoadStates]);

  // Handle image load events
  const handleImageLoad = (imageUrl: string) => {
    setImageLoadStates(prev => ({
      ...prev,
      [imageUrl]: true
    }));

    // Check if there are any pending gradient updates that can now be applied
    const systemMessages = chatMessages.filter(message => message.type === 'system');
    if (systemMessages.length > 0) {
      const lastSystemMessage = systemMessages[systemMessages.length - 1];
      const pendingShape = pendingGradientUpdates[lastSystemMessage.id];
      
      if (pendingShape && imageUrl === refinedImageUrl) {
        // Apply the pending gradient update now that the image has loaded
        setLastUsedGradientShape(pendingShape);
        setPendingGradientUpdates(prev => {
          const updated = { ...prev };
          delete updated[lastSystemMessage.id];
          return updated;
        });
      }
    }
  };

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

  // Function to get the appropriate gradient shape for a message
  const getGradientShapeForMessage = (message: ChatMessage) => {
    // Check if there's a pending update for this message
    const pendingShape = pendingGradientUpdates[message.id];
    if (pendingShape && refinedImageUrl && !imageLoadStates[refinedImageUrl]) {
      return lastUsedGradientShape; // Keep showing the previous shape until image loads
    }
    
    // Otherwise, show the shape for this message
    return getRandomGradientShape(message.id);
  };

  // Get only user messages to determine the correct index for styling
  const userMessages = chatMessages.filter(message => message.type === 'user');

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: '#FFFAF4' }}>
      {/* Mobile/Tablet Header - Aligned like a proper header */}
      <div className="w-full px-6 lg:hidden flex-shrink-0">
        <div className="flex justify-between items-center pt-6 pb-4">
          <button 
            onClick={onLogoClick}
            className="text-2xl font-pilar font-bold text-blue-600 hover:text-blue-700 transition-colors focus-ring"
          >
            nv
          </button>
          
          {/* Mobile/Tablet New Vibe Button */}
          <button
            onClick={onLogoClick}
            className="flex items-center space-x-3 px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all duration-200 hover:scale-105 group focus-ring"
          >
            <div className="w-8 h-8 border-2 border-blue-600 rounded-full flex items-center justify-center group-hover:border-blue-700 transition-colors">
              <RefreshCw className="w-4 h-4 text-blue-600 group-hover:text-blue-700 transition-colors" />
            </div>
            <span className="text-blue-600 font-calling-code font-medium group-hover:text-blue-700 transition-colors">New vibe</span>
          </button>
        </div>
      </div>
      
      {/* Main Content - Two Column Layout for Desktop */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Layout: Two Columns */}
        <div className="hidden lg:flex w-full h-full">
          {/* Left Column: Chat - Narrower width */}
          <div className="w-1/4 flex flex-col h-full" style={{ backgroundColor: '#F5F1EC', borderRight: '1px solid #D9CFC3' }}>
            {/* Chat Messages - Scrollable with INCREASED TOP PADDING for visual balance */}
            <div 
              ref={desktopChatMessagesRef}
              className="flex-1 overflow-y-auto px-6 pt-20 pb-6 space-y-4"
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
                      <div className="flex space-x-2">
                        {/* FIXED: Gradient shape alignment - using flexbox alignment with text baseline */}
                        <div className="flex-shrink-0 flex items-start" style={{ width: '44px', paddingTop: '1px' }}>
                          <img 
                            src={getGradientShapeForMessage(message)}
                            alt="Gradient shape"
                            className="object-contain"
                            style={{ width: '44px', height: '44px' }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-calling-code text-sm text-[#3F3F3F] leading-relaxed break-words">{message.content}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Clean Loading State - ONLY bouncing dots + text, NO gradient shape */}
              {isRefining && (
                <div className="flex items-center space-x-3 justify-center py-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm text-gray-500 italic animate-pulse">Crafting your perfect design...</span>
                </div>
              )}
            </div>
            
            {/* Chat Input - Fixed at bottom with matching border */}
            <div className="p-6 flex-shrink-0" style={{ borderTop: '1px solid #D9CFC3' }}>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, false, true)}
                  placeholder="Keep vibing"
                  className="input-short flex-1 px-4 py-3 pr-12 rounded-full text-sm placeholder-calling-code textarea-calling-code"
                  style={{
                    boxShadow: '0 4px 8px 0 rgba(155, 155, 169, 0.25)',
                    color: '#3F3F3F'
                  }}
                  disabled={isRefining}
                />
                <button
                  onClick={onRefineSubmit}
                  disabled={!refinePrompt.trim() || isRefining}
                  className="input-button absolute right-1 mr-1 transform -translate-y-1/2 w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center z-10"
                >
                  {isRefining ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <ArrowUp className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Column: Image - 3/4 width */}
          <div className="w-3/4 flex flex-col h-full relative">
            {/* Desktop Header with Logo and New Vibe Button */}
            <div className="absolute top-6 left-6 right-6 z-10 flex justify-between items-center">
              {/* Logo - Left aligned */}
              <button 
                onClick={onLogoClick}
                className="text-2xl font-pilar font-bold text-blue-600 hover:text-blue-700 transition-colors focus-ring"
              >
                nv
              </button>
              
              {/* Desktop New Vibe Button - Right aligned */}
              <button
                onClick={onLogoClick}
                className="flex items-center space-x-3 px-5 py-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all duration-200 hover:scale-105 group shadow-sm focus-ring"
              >
                <div className="w-8 h-8 border-2 border-blue-600 rounded-full flex items-center justify-center group-hover:border-blue-700 transition-colors">
                  <RefreshCw className="w-4 h-4 text-blue-600 group-hover:text-blue-700 transition-colors" />
                </div>
                <span className="text-blue-600 font-calling-code font-medium group-hover:text-blue-700 transition-colors">New vibe</span>
              </button>
            </div>

            {/* Image Display - Centered vertically with title */}
            <div className="flex-1 flex flex-col justify-center items-center px-8 py-16">
              <div className="w-full max-w-lg">
                {/* Title positioned above image with proper spacing - LEFT ALIGNED */}
                <div className="mb-6">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="flex items-center justify-center" style={{ width: '48px', height: '48px' }}>
                      <img 
                        src={lastUsedGradientShape}
                        alt="Gradient shape"
                        className="object-contain"
                        style={{ width: '48px', height: '48px' }}
                      />
                    </div>
                    <h1 className="font-calling-code font-bold text-[#3F3F3F] text-xl leading-tight">
                      {currentVibe?.title || "Black French tips on short natural nails"}
                    </h1>
                  </div>
                </div>
                
                {/* Image - Smaller to prevent scrolling */}
                <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-lg max-h-[60vh]">
                  <img 
                    src={displayImageUrl} 
                    alt="Generated nail design" 
                    className="w-full h-full object-cover transition-all duration-300"
                    onLoad={() => handleImageLoad(displayImageUrl)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = SAMPLE_NAIL_IMAGE;
                      handleImageLoad(SAMPLE_NAIL_IMAGE);
                    }}
                  />
                  
                  {/* Magical Loading Overlay */}
                  <MagicalLoadingOverlay 
                    isVisible={isRefining} 
                    message="Refining your design"
                  />
                </div>
              </div>
            </div>

            {/* Footer in Image Section - Desktop Only with minimal styling */}
            <div className="flex-shrink-0">
              <Footer variant="minimal" />
            </div>
          </div>
        </div>
        
        {/* Mobile/Tablet Layout: Single Column with Modal Chat */}
        <div className="lg:hidden w-full flex flex-col">
          <div className="flex-1 flex flex-col justify-center px-6">
            <div className="max-w-md mx-auto w-full">
              {/* Image - Smaller to prevent scrolling */}
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-6 max-h-[50vh]">
                <img 
                  src={displayImageUrl} 
                  alt="Generated nail design" 
                  className="w-full h-full object-cover transition-all duration-300"
                  onLoad={() => handleImageLoad(displayImageUrl)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = SAMPLE_NAIL_IMAGE;
                    handleImageLoad(SAMPLE_NAIL_IMAGE);
                  }}
                />
                
                {/* Magical Loading Overlay for mobile */}
                <MagicalLoadingOverlay 
                  isVisible={isRefining} 
                  message="Refining your design"
                />
              </div>
              
              {/* Title positioned below image - LEFT ALIGNED - CLEAN VERSION */}
              <div className="mb-6">
                {currentVibe?.title && (
                  <h1 className="font-calling-code font-bold text-[#3F3F3F] mb-4 text-lg text-left">
                    {currentVibe.title}
                  </h1>
                )}
              </div>
              
              {/* Chat Trigger */}
              <div className="text-center">
                <button
                  onClick={onOpenChat}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg focus-ring"
                  disabled={isRefining}
                >
                  <span className="text-sm font-medium">
                    {isRefining ? 'Refining...' : 'Keep vibing'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer for Mobile/Tablet - Keep default styling */}
          <Footer />
        </div>
      </div>

      {/* Mobile Chat Drawer */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(63, 63, 63, 0.5)' }}
            onClick={onCloseChat}
          />
          
          {/* Chat Panel */}
          <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl max-h-[80vh] flex flex-col animate-slide-up" style={{ backgroundColor: '#F5F1EC' }}>
            {/* Header */}
            <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid #D9CFC3' }}>
              <button
                onClick={onCloseChat}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors focus-ring"
              >
                <Minus className="w-6 h-6 text-gray-400" />
              </button>
              <button
                onClick={onCloseChat}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors focus-ring"
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
                      <div className="flex space-x-2">
                        {/* FIXED: Gradient shape alignment for mobile - using flexbox alignment with text baseline */}
                        <div className="flex-shrink-0 flex items-start" style={{ width: '44px', paddingTop: '1px' }}>
                          <img 
                            src={getGradientShapeForMessage(message)}
                            alt="Gradient shape"
                            className="object-contain"
                            style={{ width: '44px', height: '44px' }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-calling-code text-sm text-[#3F3F3F] break-words">{message.content}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Clean Loading State for Mobile - ONLY bouncing dots + text, NO gradient shape */}
              {isRefining && (
                <div className="flex items-center space-x-3 justify-center py-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm text-gray-500 italic animate-pulse">Crafting your perfect design...</span>
                </div>
              )}
            </div>
            
            {/* Input Area */}
            <div className="p-4" style={{ borderTop: '1px solid #D9CFC3' }}>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, false, true)}
                  onFocus={onChatInputFocus}
                  onBlur={onChatInputBlur}
                  placeholder="make it chrome, add glitter, more pink..."
                  className="input-short flex-1 px-4 py-3 pr-12 rounded-lg text-sm placeholder-calling-code textarea-calling-code"
                  style={{
                    boxShadow: '0 4px 8px 0 rgba(155, 155, 169, 0.25)',
                    color: '#3F3F3F'
                  }}
                  disabled={isRefining}
                />
                <button
                  onClick={onRefineSubmit}
                  disabled={!refinePrompt.trim() || isRefining}
                  className="input-button absolute right-1 mr-1 transform -translate-y-1/2 w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center z-10"
                >
                  {isRefining ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <ArrowUp className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Typing Indicator */}
            {isTyping && !isRefining && (
              <div className="p-4 pt-0">
                <div className="text-xs text-gray-500 italic animate-pulse">
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