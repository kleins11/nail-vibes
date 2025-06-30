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

  // State to track if mobile keyboard is active
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);

  // NEW: State to track if device is mobile (has touch capability)
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Refs for auto-scrolling and input focus
  const desktopChatMessagesRef = useRef<HTMLDivElement>(null);
  const mobileChatMessagesRef = useRef<HTMLDivElement>(null);
  const mobileExpandedInputRef = useRef<HTMLInputElement>(null);

  // NEW: Detect if device is mobile (has touch capability)
  useEffect(() => {
    const checkMobileDevice = () => {
      // Check for touch capability and mobile user agents
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      setIsMobileDevice(hasTouchScreen || isMobileUserAgent);
    };

    checkMobileDevice();
  }, []);

  // Detect mobile keyboard activation
  useEffect(() => {
    const handleResize = () => {
      // Only apply keyboard detection on mobile devices
      if (window.innerWidth < 1024) { // lg breakpoint
        const viewportHeight = window.visualViewport?.height || window.innerHeight;
        const windowHeight = window.innerHeight;
        
        // If viewport height is significantly smaller than window height, keyboard is likely active
        const keyboardThreshold = 150; // pixels
        const isKeyboardOpen = (windowHeight - viewportHeight) > keyboardThreshold;
        
        setIsKeyboardActive(isKeyboardOpen);
      } else {
        setIsKeyboardActive(false);
      }
    };

    // Listen for viewport changes (keyboard show/hide)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    } else {
      // Fallback for browsers without visualViewport support
      window.addEventListener('resize', handleResize);
    }

    // Initial check
    handleResize();

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      } else {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // NEW: Auto-focus input when chat opens on mobile
  useEffect(() => {
    if (isChatOpen && isMobileDevice && mobileExpandedInputRef.current) {
      // Small delay to ensure the drawer animation completes
      const timer = setTimeout(() => {
        mobileExpandedInputRef.current?.focus();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isChatOpen, isMobileDevice]);

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

  // NEW: Enhanced mobile chat opening with automatic keyboard activation
  const handleMobileChatOpen = () => {
    onOpenChat();
    
    // On mobile devices, automatically focus the input to trigger keyboard
    if (isMobileDevice && window.innerWidth < 1024) {
      // Small delay to ensure the drawer opens first
      setTimeout(() => {
        if (mobileExpandedInputRef.current) {
          mobileExpandedInputRef.current.focus();
        }
      }, 350); // Slightly longer delay for smooth animation
    }
  };

  // NEW: Handle closed drawer input focus with mobile keyboard activation
  const handleClosedDrawerInputFocus = () => {
    // Always open the chat first
    onOpenChat();
    
    // On mobile devices, focus the expanded input to trigger keyboard
    if (isMobileDevice && window.innerWidth < 1024) {
      setTimeout(() => {
        if (mobileExpandedInputRef.current) {
          mobileExpandedInputRef.current.focus();
        }
      }, 350);
    }
    // On desktop/non-mobile, just focus normally (handled by onOpenChat)
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

  // Get the last system message for the collapsed chat drawer
  const lastSystemMessage = chatMessages.filter(message => message.type === 'system').pop();

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
                        {/* FIXED: Perfect gradient shape alignment with text baseline */}
                        <div className="flex-shrink-0" style={{ width: '44px' }}>
                          <img 
                            src={getGradientShapeForMessage(message)}
                            alt="Gradient shape"
                            className="object-contain"
                            style={{ 
                              width: '44px', 
                              height: '44px',
                              // CRITICAL: Align the shape with the text baseline, not center
                              marginTop: '-2px' // Fine-tune to match text baseline perfectly
                            }}
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
              {/* Logo - MOVED RIGHT to align with footer image */}
              <div className="pl-4">
                <button 
                  onClick={onLogoClick}
                  className="text-2xl font-pilar font-bold text-blue-600 hover:text-blue-700 transition-colors focus-ring"
                >
                  nv
                </button>
              </div>
              
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
        
        {/* Mobile/Tablet Layout: Single Column with Bottom Chat Drawer */}
        <div className="lg:hidden w-full flex flex-col relative">
          <div className="flex-1 flex flex-col justify-center px-6" style={{ paddingBottom: '25vh' }}>
            <div className="max-w-md mx-auto w-full">
              {/* Title positioned above image - Mobile Only */}
              {currentVibe?.title && (
                <div className="mb-6">
                  <h1 className="font-calling-code font-bold text-[#3F3F3F] text-lg text-left">
                    {currentVibe.title}
                  </h1>
                </div>
              )}
              
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
            </div>
          </div>

          {/* Bottom Chat Drawer - Collapsed State */}
          {!isChatOpen && (
            <div className="fixed bottom-0 left-0 right-0 z-40">
              {/* Chat Drawer Container with rounded top corners and 25% viewport height */}
              <div 
                className="cursor-pointer relative"
                onClick={handleMobileChatOpen} // UPDATED: Use enhanced mobile chat opening
                style={{ 
                  backgroundColor: '#F5F1EC', 
                  borderRadius: '32px 32px 0px 0px',
                  height: '25vh', // Changed from 230px to 25% of viewport height
                  border: '1px solid #D9CFC3',
                  borderBottom: 'none'
                }}
              >
                {/* Drawer Pull Handle - Positioned at the top center */}
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                  <div 
                    className="bg-gray-400 rounded-full"
                    style={{ 
                      width: '36px', 
                      height: '4px' 
                    }}
                  />
                </div>

                {/* Chat Content - Moved down to accommodate drawer pull */}
                <div className="px-4 pt-8 pb-6 h-full flex flex-col">
                  {/* CONDITIONAL CONTENT: Show loading state when refining, otherwise show last message */}
                  {isRefining ? (
                    /* NEW: Loading State in Closed Drawer - Matches desktop loading state exactly */
                    <div className="flex items-center space-x-3 justify-center py-8 flex-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-sm text-gray-500 italic animate-pulse">Crafting your perfect design...</span>
                    </div>
                  ) : (
                    /* Last System Message Preview - Only shown when NOT refining */
                    lastSystemMessage && (
                      <div className="flex space-x-2 mb-6 flex-shrink-0">
                        <div className="flex-shrink-0" style={{ width: '32px' }}>
                          <img 
                            src={getGradientShapeForMessage(lastSystemMessage)}
                            alt="Gradient shape"
                            className="object-contain"
                            style={{ 
                              width: '32px', 
                              height: '32px',
                              // CRITICAL: Align with text baseline for mobile too
                              marginTop: '-1px' // Slightly less offset for smaller mobile text
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-calling-code text-sm text-[#3F3F3F] leading-relaxed break-words line-clamp-3">
                            {lastSystemMessage.content}
                          </p>
                        </div>
                      </div>
                    )
                  )}

                  {/* Input Field Preview - Positioned at bottom - ONLY shown when NOT refining */}
                  {!isRefining && (
                    <div className="mt-auto">
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={refinePrompt}
                          onChange={(e) => setRefinePrompt(e.target.value)}
                          onFocus={handleClosedDrawerInputFocus} // UPDATED: Use enhanced input focus handler
                          placeholder="Keep vibing"
                          className="input-short flex-1 px-4 py-3 pr-12 rounded-full text-sm placeholder-calling-code textarea-calling-code"
                          style={{
                            boxShadow: '0 4px 8px 0 rgba(155, 155, 169, 0.25)',
                            color: '#3F3F3F'
                          }}
                          disabled={isRefining}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRefineSubmit();
                          }}
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
                  )}
                </div>
              </div>

              {/* NO FOOTER ON MOBILE - Completely hidden */}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Chat Drawer - Expanded State */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(63, 63, 63, 0.5)' }}
            onClick={onCloseChat}
          />
          
          {/* Chat Panel - DYNAMIC HEIGHT: 80vh when keyboard is active, 80vh default */}
          <div 
            className="absolute bottom-0 left-0 right-0 rounded-t-2xl flex flex-col animate-slide-up" 
            style={{ 
              backgroundColor: '#F5F1EC',
              // CRITICAL: Use 80vh when keyboard is active for optimal mobile experience
              maxHeight: isKeyboardActive ? '80vh' : '80vh',
              height: isKeyboardActive ? '80vh' : '80vh'
            }}
          >
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
            
            {/* Messages - FLEXIBLE HEIGHT: Adjusts based on keyboard state */}
            <div 
              ref={mobileChatMessagesRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{
                // CRITICAL: Ensure messages area takes remaining space after header and input
                minHeight: 0 // Allow flex-shrink
              }}
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
                        {/* FIXED: Perfect gradient shape alignment for mobile expanded chat */}
                        <div className="flex-shrink-0" style={{ width: '44px' }}>
                          <img 
                            src={getGradientShapeForMessage(message)}
                            alt="Gradient shape"
                            className="object-contain"
                            style={{ 
                              width: '44px', 
                              height: '44px',
                              // CRITICAL: Align with text baseline for mobile expanded chat
                              marginTop: '-2px' // Same as desktop for consistency
                            }}
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
            
            {/* Input Area - FIXED HEIGHT: Stays consistent regardless of keyboard */}
            <div className="p-4 flex-shrink-0" style={{ borderTop: '1px solid #D9CFC3' }}>
              <div className="relative flex items-center">
                <input
                  ref={mobileExpandedInputRef} // CRITICAL: Ref for auto-focus on mobile
                  type="text"
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, false, true)}
                  onFocus={onChatInputFocus}
                  onBlur={onChatInputBlur}
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
            
            {/* REMOVED: Typing Indicator - No longer needed */}
          </div>
        </div>
      )}

      {/* Add line-clamp utility for text truncation */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}