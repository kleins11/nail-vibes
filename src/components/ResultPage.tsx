import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, RefreshCw } from 'lucide-react';
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

  // NEW: Enhanced state for ultra-smooth drag handling
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragCurrentY, setDragCurrentY] = useState(0);
  const [dragVelocity, setDragVelocity] = useState(0);
  const [lastDragTime, setLastDragTime] = useState(0);

  // NEW: Animation state for ultra-smooth transitions
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'opening' | 'closing' | 'idle'>('idle');

  // Refs for auto-scrolling and input focus
  const desktopChatMessagesRef = useRef<HTMLDivElement>(null);
  const mobileChatMessagesRef = useRef<HTMLDivElement>(null);
  const mobileExpandedInputRef = useRef<HTMLTextAreaElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

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

  // NEW: Enhanced auto-focus with smooth timing
  useEffect(() => {
    if (isChatOpen && isMobileDevice && mobileExpandedInputRef.current && !isAnimating) {
      // Smooth delay to ensure the drawer animation completes perfectly
      const timer = setTimeout(() => {
        mobileExpandedInputRef.current?.focus();
      }, 400); // Slightly longer for ultra-smooth experience

      return () => clearTimeout(timer);
    }
  }, [isChatOpen, isMobileDevice, isAnimating]);

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

  // NEW: Ultra-smooth mobile chat opening with perfect timing
  const handleMobileChatOpen = () => {
    setIsAnimating(true);
    setAnimationPhase('opening');
    onOpenChat();
    
    // Reset animation state after opening completes
    setTimeout(() => {
      setIsAnimating(false);
      setAnimationPhase('idle');
    }, 400);
  };

  // NEW: Ultra-smooth mobile chat closing with perfect timing
  const handleMobileChatClose = () => {
    setIsAnimating(true);
    setAnimationPhase('closing');
    
    // Small delay before actually closing to allow for smooth animation start
    setTimeout(() => {
      onCloseChat();
    }, 50);
    
    // Reset animation state after closing completes
    setTimeout(() => {
      setIsAnimating(false);
      setAnimationPhase('idle');
    }, 400);
  };

  // NEW: Handle closed drawer input focus with ultra-smooth keyboard activation
  const handleClosedDrawerInputFocus = () => {
    // Always open the chat first with smooth animation
    handleMobileChatOpen();
  };

  // NEW: Enhanced drag handlers with velocity tracking for ultra-smooth motion
  const handleDragStart = (clientY: number) => {
    setIsDragging(true);
    setDragStartY(clientY);
    setDragCurrentY(clientY);
    setDragVelocity(0);
    setLastDragTime(Date.now());
  };

  const handleDragMove = (clientY: number) => {
    if (!isDragging) return;
    
    const now = Date.now();
    const timeDelta = now - lastDragTime;
    const positionDelta = clientY - dragCurrentY;
    
    // Calculate velocity for smooth momentum
    if (timeDelta > 0) {
      setDragVelocity(positionDelta / timeDelta);
    }
    
    setDragCurrentY(clientY);
    setLastDragTime(now);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    const dragDistance = dragCurrentY - dragStartY;
    const threshold = 80; // Slightly higher threshold for more intentional gestures
    const velocityThreshold = 0.5; // Velocity threshold for quick swipes
    
    // Enhanced logic: consider both distance and velocity
    const shouldClose = dragDistance > threshold || 
                       (dragDistance > 30 && dragVelocity > velocityThreshold);
    
    if (shouldClose) {
      handleMobileChatClose();
    }
    
    // Reset drag state
    setIsDragging(false);
    setDragStartY(0);
    setDragCurrentY(0);
    setDragVelocity(0);
    setLastDragTime(0);
  };

  // NEW: Enhanced mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleDragMove(e.clientY);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // NEW: Enhanced touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleDragStart(touch.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handleDragMove(touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // NEW: Enhanced global event listeners for ultra-smooth drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, dragStartY, dragCurrentY]);

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
          <div className="flex-1 flex flex-col justify-center px-6" style={{ paddingBottom: '30vh' }}>
            <div className="max-w-md mx-auto w-full">
              {/* UPDATED: Title positioned above image with gradient shape - Mobile Version */}
              {currentVibe?.title && (
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    {/* NEW: Gradient shape for mobile - smaller size than desktop */}
                    <div className="flex items-center justify-center flex-shrink-0" style={{ width: '36px', height: '36px' }}>
                      <img 
                        src={lastUsedGradientShape}
                        alt="Gradient shape"
                        className="object-contain"
                        style={{ width: '36px', height: '36px' }}
                      />
                    </div>
                    {/* Title with proper spacing */}
                    <h1 className="font-calling-code font-bold text-[#3F3F3F] text-lg leading-tight flex-1">
                      {currentVibe.title}
                    </h1>
                  </div>
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

          {/* Bottom Chat Drawer - Collapsed State with ULTRA-SMOOTH ANIMATIONS */}
          {!isChatOpen && (
            <div 
              className="fixed left-0 right-0 z-40 ultra-smooth-drawer"
              style={{ 
                bottom: 'max(0px, env(safe-area-inset-bottom))',
                paddingBottom: 'env(safe-area-inset-bottom)'
              }}
            >
              {/* Chat Drawer Container with ultra-smooth hover effects */}
              <div 
                className="cursor-pointer relative ultra-smooth-container"
                onClick={handleMobileChatOpen}
                style={{ 
                  backgroundColor: '#F5F1EC', 
                  borderRadius: '32px 32px 0px 0px',
                  height: '28vh',
                  minHeight: '200px',
                  border: '1px solid #D9CFC3',
                  borderBottom: 'none',
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transform: 'translateY(0)',
                  willChange: 'transform, box-shadow'
                }}
              >
                {/* Drawer Pull Handle with enhanced hover effects */}
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                  <div 
                    className="bg-gray-400 rounded-full ultra-smooth-handle"
                    style={{ 
                      width: '36px', 
                      height: '4px',
                      transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      willChange: 'background-color, transform'
                    }}
                  />
                </div>

                {/* Chat Content with smooth fade transitions */}
                <div className="px-4 pt-8 pb-6 h-full flex flex-col ultra-smooth-content">
                  {/* CONDITIONAL CONTENT with smooth transitions */}
                  {isRefining ? (
                    <div className="flex items-center space-x-3 justify-center py-8 flex-1 ultra-smooth-fade-in">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-sm text-gray-500 italic animate-pulse">Crafting your perfect design...</span>
                    </div>
                  ) : (
                    lastSystemMessage && (
                      <div className="flex space-x-2 mb-6 flex-shrink-0 ultra-smooth-fade-in">
                        <div className="flex-shrink-0" style={{ width: '32px' }}>
                          <img 
                            src={getGradientShapeForMessage(lastSystemMessage)}
                            alt="Gradient shape"
                            className="object-contain ultra-smooth-image"
                            style={{ 
                              width: '32px', 
                              height: '32px',
                              marginTop: '-1px',
                              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
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

                  {/* Input Field Preview with ultra-smooth interactions */}
                  {!isRefining && (
                    <div className="mt-auto ultra-smooth-fade-in">
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={refinePrompt}
                          onChange={(e) => setRefinePrompt(e.target.value)}
                          onFocus={handleClosedDrawerInputFocus}
                          placeholder="Keep vibing"
                          className="input-short flex-1 px-4 py-3 pr-12 rounded-full text-sm placeholder-calling-code textarea-calling-code ultra-smooth-input"
                          style={{
                            boxShadow: '0 4px 8px 0 rgba(155, 155, 169, 0.25)',
                            color: '#3F3F3F',
                            transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                            willChange: 'transform, box-shadow'
                          }}
                          disabled={isRefining}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRefineSubmit();
                          }}
                          disabled={!refinePrompt.trim() || isRefining}
                          className="input-button absolute right-1 mr-1 transform -translate-y-1/2 w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center z-10 ultra-smooth-button"
                          style={{
                            transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                            willChange: 'transform, background-color'
                          }}
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
            </div>
          )}
        </div>
      </div>

      {/* Mobile Chat Drawer - Expanded State with ULTRA-SMOOTH ANIMATIONS */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop with ultra-smooth fade */}
          <div 
            className="absolute inset-0 backdrop-blur-sm ultra-smooth-backdrop"
            style={{ 
              backgroundColor: 'rgba(63, 63, 63, 0.5)',
              transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              willChange: 'opacity, backdrop-filter'
            }}
            onClick={handleMobileChatClose}
          />
          
          {/* Chat Panel with ULTRA-SMOOTH MOTION */}
          <div 
            ref={drawerRef}
            className="absolute bottom-0 left-0 right-0 rounded-t-2xl flex flex-col ultra-smooth-expanded-drawer" 
            style={{ 
              backgroundColor: '#F5F1EC',
              maxHeight: isKeyboardActive ? '80vh' : '80vh',
              height: isKeyboardActive ? '80vh' : '80vh',
              // ULTRA-SMOOTH: Enhanced drag transform with momentum
              transform: isDragging 
                ? `translateY(${Math.max(0, dragCurrentY - dragStartY)}px)` 
                : animationPhase === 'opening' 
                  ? 'translateY(0)' 
                  : animationPhase === 'closing'
                    ? 'translateY(100%)'
                    : 'translateY(0)',
              // ULTRA-SMOOTH: Dynamic transition based on state
              transition: isDragging 
                ? 'none' 
                : animationPhase === 'opening'
                  ? 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  : animationPhase === 'closing'
                    ? 'all 0.35s cubic-bezier(0.55, 0.085, 0.68, 0.53)'
                    : 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              paddingBottom: 'env(safe-area-inset-bottom)',
              marginBottom: 'env(safe-area-inset-bottom)',
              willChange: 'transform, opacity',
              // ULTRA-SMOOTH: Add subtle shadow that responds to drag
              boxShadow: isDragging 
                ? `0 ${Math.max(8, 20 - (dragCurrentY - dragStartY) * 0.2)}px ${Math.max(16, 40 - (dragCurrentY - dragStartY) * 0.4)}px rgba(0, 0, 0, ${Math.max(0.1, 0.15 - (dragCurrentY - dragStartY) * 0.001)})` 
                : '0 -8px 32px rgba(0, 0, 0, 0.12)'
            }}
          >
            {/* ULTRA-SMOOTH: Enhanced header with draggable handle */}
            <div 
              className="flex items-center justify-center p-4 cursor-grab active:cursor-grabbing ultra-smooth-header"
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onClick={handleMobileChatClose}
              style={{
                transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                willChange: 'transform'
              }}
            >
              {/* ULTRA-SMOOTH: Enhanced drawer pull handle */}
              <div 
                className="bg-gray-400 rounded-full ultra-smooth-expanded-handle"
                style={{ 
                  width: '36px', 
                  height: '4px',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  willChange: 'background-color, transform, width',
                  // ULTRA-SMOOTH: Handle responds to drag state
                  backgroundColor: isDragging ? '#6B7280' : '#9CA3AF',
                  width: isDragging ? '48px' : '36px'
                }}
              />
            </div>
            
            {/* ULTRA-SMOOTH: Messages with enhanced scrolling */}
            <div 
              ref={mobileChatMessagesRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth ultra-smooth-messages"
              style={{
                minHeight: 0,
                scrollBehavior: 'smooth',
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            >
              {chatMessages.map((message, index) => {
                const userMessageIndex = message.type === 'user' 
                  ? userMessages.findIndex(userMsg => userMsg.id === message.id)
                  : -1;
                
                const bubbleStyle = userMessageIndex >= 0 ? getChatBubbleStyle(userMessageIndex) : null;
                
                return (
                  <div key={message.id} className="space-y-2 ultra-smooth-message">
                    {message.type === 'user' ? (
                      <div 
                        className="p-3 max-w-xs ml-auto border break-words overflow-wrap-anywhere ultra-smooth-bubble"
                        style={{ 
                          borderRadius: '24px 24px 0px 24px',
                          borderWidth: '1px',
                          backgroundColor: bubbleStyle?.backgroundColor,
                          borderColor: bubbleStyle?.borderColor,
                          color: '#3F3F3F',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          hyphens: 'auto',
                          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                          willChange: 'transform, box-shadow'
                        }}
                      >
                        <p className="text-sm font-calling-code break-words">{message.content}</p>
                      </div>
                    ) : (
                      <div className="flex space-x-2 ultra-smooth-system-message">
                        <div className="flex-shrink-0" style={{ width: '44px' }}>
                          <img 
                            src={getGradientShapeForMessage(message)}
                            alt="Gradient shape"
                            className="object-contain ultra-smooth-system-image"
                            style={{ 
                              width: '44px', 
                              height: '44px',
                              marginTop: '-2px',
                              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                              willChange: 'transform, opacity'
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
              
              {/* ULTRA-SMOOTH: Enhanced loading state */}
              {isRefining && (
                <div className="flex items-center space-x-3 justify-center py-4 ultra-smooth-loading">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm text-gray-500 italic animate-pulse">Crafting your perfect design...</span>
                </div>
              )}
            </div>
            
            {/* ULTRA-SMOOTH: Enhanced input area */}
            <div className="flex-shrink-0 ultra-smooth-input-area" style={{ borderTop: '1px solid #D9CFC3' }}>
              <div className="p-4">
                <div className="relative">
                  <textarea
                    ref={mobileExpandedInputRef}
                    value={refinePrompt}
                    onChange={(e) => setRefinePrompt(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, false, true)}
                    onFocus={onChatInputFocus}
                    onBlur={onChatInputBlur}
                    placeholder="Keep vibing"
                    rows={1}
                    className="input-short w-full px-4 py-3 pr-12 rounded-full text-sm placeholder-calling-code textarea-calling-code resize-none overflow-hidden ultra-smooth-expanded-input"
                    style={{
                      boxShadow: '0 4px 8px 0 rgba(155, 155, 169, 0.25)',
                      color: '#3F3F3F',
                      minHeight: '48px',
                      maxHeight: '120px',
                      lineHeight: '1.5',
                      transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      willChange: 'transform, box-shadow, height'
                    }}
                    disabled={isRefining}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                    }}
                  />
                  <button
                    onClick={onRefineSubmit}
                    disabled={!refinePrompt.trim() || isRefining}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center z-10 flex-shrink-0 ultra-smooth-expanded-button"
                    style={{
                      marginRight: '4px',
                      transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      willChange: 'transform, background-color, box-shadow'
                    }}
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
          </div>
        </div>
      )}

      {/* ULTRA-SMOOTH: Enhanced CSS for premium animations */}
      <style jsx>{`
        /* ULTRA-SMOOTH: Line clamp utilities */
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
        
        /* ULTRA-SMOOTH: Enhanced slide-up animation */
        @keyframes ultraSmoothSlideUp {
          0% {
            transform: translateY(100%);
            opacity: 0;
            filter: blur(2px);
          }
          50% {
            opacity: 0.8;
            filter: blur(1px);
          }
          100% {
            transform: translateY(0);
            opacity: 1;
            filter: blur(0px);
          }
        }
        
        /* ULTRA-SMOOTH: Enhanced fade-in animation */
        @keyframes ultraSmoothFadeIn {
          0% {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        /* ULTRA-SMOOTH: Drawer container hover effects */
        .ultra-smooth-container:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        }
        
        .ultra-smooth-container:hover .ultra-smooth-handle {
          background-color: #6B7280;
          transform: scaleX(1.1);
        }
        
        /* ULTRA-SMOOTH: Content fade-in effects */
        .ultra-smooth-fade-in {
          animation: ultraSmoothFadeIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        /* ULTRA-SMOOTH: Input hover effects */
        .ultra-smooth-input:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px 0 rgba(155, 155, 169, 0.3);
        }
        
        .ultra-smooth-input:focus {
          transform: translateY(-1px) scale(1.01);
          box-shadow: 0 8px 24px 0 rgba(59, 130, 246, 0.2);
        }
        
        /* ULTRA-SMOOTH: Button hover effects */
        .ultra-smooth-button:hover:not(:disabled) {
          transform: scale(1.1);
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
        }
        
        .ultra-smooth-button:active:not(:disabled) {
          transform: scale(0.95);
        }
        
        /* ULTRA-SMOOTH: Expanded drawer animations */
        .ultra-smooth-expanded-drawer {
          animation: ultraSmoothSlideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        /* ULTRA-SMOOTH: Message bubble hover effects */
        .ultra-smooth-bubble:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        /* ULTRA-SMOOTH: System message image hover effects */
        .ultra-smooth-system-image:hover {
          transform: scale(1.05) rotate(2deg);
        }
        
        /* ULTRA-SMOOTH: Expanded input hover effects */
        .ultra-smooth-expanded-input:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px 0 rgba(155, 155, 169, 0.3);
        }
        
        .ultra-smooth-expanded-input:focus {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 8px 32px 0 rgba(59, 130, 246, 0.25);
        }
        
        /* ULTRA-SMOOTH: Expanded button hover effects */
        .ultra-smooth-expanded-button:hover:not(:disabled) {
          transform: translateY(-50%) scale(1.15);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }
        
        .ultra-smooth-expanded-button:active:not(:disabled) {
          transform: translateY(-50%) scale(0.9);
        }
        
        /* ULTRA-SMOOTH: Backdrop animation */
        .ultra-smooth-backdrop {
          animation: ultraSmoothFadeIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        /* ULTRA-SMOOTH: Header hover effects */
        .ultra-smooth-header:hover {
          transform: translateY(-1px);
        }
        
        .ultra-smooth-header:hover .ultra-smooth-expanded-handle {
          background-color: #4B5563;
          width: 48px;
        }
        
        /* ULTRA-SMOOTH: Scroll behavior */
        .scroll-smooth {
          scroll-behavior: smooth;
        }
        
        /* ULTRA-SMOOTH: Focus states */
        .focus-ring:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        /* ULTRA-SMOOTH: Hardware acceleration for all elements */
        .ultra-smooth-drawer,
        .ultra-smooth-container,
        .ultra-smooth-handle,
        .ultra-smooth-content,
        .ultra-smooth-fade-in,
        .ultra-smooth-input,
        .ultra-smooth-button,
        .ultra-smooth-expanded-drawer,
        .ultra-smooth-backdrop,
        .ultra-smooth-header,
        .ultra-smooth-expanded-handle,
        .ultra-smooth-messages,
        .ultra-smooth-message,
        .ultra-smooth-bubble,
        .ultra-smooth-system-message,
        .ultra-smooth-system-image,
        .ultra-smooth-loading,
        .ultra-smooth-input-area,
        .ultra-smooth-expanded-input,
        .ultra-smooth-expanded-button {
          will-change: transform, opacity, filter, box-shadow;
          backface-visibility: hidden;
          perspective: 1000px;
          transform-style: preserve-3d;
        }
        
        /* ULTRA-SMOOTH: Safe area support */
        @supports (padding: max(0px)) {
          .safe-area-bottom {
            padding-bottom: max(16px, env(safe-area-inset-bottom));
          }
        }
        
        /* ULTRA-SMOOTH: Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .ultra-smooth-drawer,
          .ultra-smooth-container,
          .ultra-smooth-expanded-drawer,
          .ultra-smooth-backdrop,
          .ultra-smooth-fade-in {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}