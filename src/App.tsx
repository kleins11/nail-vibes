import React, { useState } from 'react';
import { ArrowUp, X, Minus } from 'lucide-react';
import { findBestVibeMatch, VibeMatchResult } from './services/vibeService';
import { VibeIdea } from './lib/supabase';

// Sample nail image URL (fallback)
const SAMPLE_NAIL_IMAGE = "https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=800";

interface ChatMessage {
  id: string;
  type: 'user' | 'system';
  content: string;
  timestamp: Date;
}

type AppState = 'input' | 'result' | 'chat' | 'loading';

function App() {
  const [appState, setAppState] = useState<AppState>('input');
  const [prompt, setPrompt] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentVibe, setCurrentVibe] = useState<VibeIdea | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogoClick = () => {
    setAppState('input');
    setPrompt('');
    setChatMessages([]);
    setChatInput('');
    setIsChatOpen(false);
    setIsTyping(false);
    setCurrentVibe(null);
    setError(null);
  };

  const handleInitialSubmit = async () => {
    if (!prompt.trim()) return;
    
    setError(null);
    setAppState('loading');
    
    try {
      console.log('🚀 Searching for vibe match with prompt:', prompt);
      
      // Call the backend service to find the best match
      const result: VibeMatchResult = await findBestVibeMatch(prompt);
      
      if (result.success && result.data) {
        const { vibe, extractedTags } = result.data;
        
        console.log('✅ Found matching vibe:', vibe);
        console.log('🏷️ Extracted tags:', extractedTags);
        
        // Set the current vibe for display
        setCurrentVibe(vibe);
        
        // Create chat messages
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'user',
          content: prompt,
          timestamp: new Date()
        };
        
        const systemMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'system',
          content: vibe.description || "Here's a perfect nail design that matches your vibe! ✨",
          timestamp: new Date()
        };
        
        setChatMessages([userMessage, systemMessage]);
        setAppState('result');
      } else {
        // Handle error case
        console.error('❌ Failed to find vibe match:', result.error);
        setError(result.error || 'Failed to find a matching vibe');
        setAppState('input');
      }
    } catch (error) {
      console.error('❌ Error in handleInitialSubmit:', error);
      setError('An unexpected error occurred. Please try again.');
      setAppState('input');
    }
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    };
    
    const systemMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'system',
      content: "Great suggestion! Here's a refined version that incorporates your feedback.",
      timestamp: new Date()
    };
    
    setChatMessages([...chatMessages, userMessage, systemMessage]);
    setChatInput('');
    setIsTyping(false);
  };

  const openChat = () => {
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setIsTyping(false);
  };

  const handleChatInputFocus = () => {
    setIsTyping(true);
  };

  const handleChatInputBlur = () => {
    setTimeout(() => setIsTyping(false), 100);
  };

  // Loading Screen
  if (appState === 'loading') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex justify-center pt-8 pb-4">
          <button 
            onClick={handleLogoClick}
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            nv
          </button>
        </div>
        
        {/* Loading Content */}
        <div className="flex-1 flex flex-col justify-center px-6">
          <div className="max-w-sm mx-auto w-full text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Finding your perfect vibe...</p>
          </div>
        </div>
      </div>
    );
  }

  // Initial Input Screen
  if (appState === 'input') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex justify-center pt-8 pb-4">
          <button 
            onClick={handleLogoClick}
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            nv
          </button>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center px-6 pb-20">
          <div className="max-w-sm mx-auto w-full">
            <h1 className="text-4xl font-bold text-blue-600 mb-8 leading-tight">
              What's your nail vibe?
            </h1>
            
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Maximalist 3D design for Beatles-themed wedding in London on coffin shape"
                className="w-full h-24 p-4 text-sm text-gray-600 placeholder-gray-400 border-0 resize-none focus:outline-none bg-gray-50 rounded-lg"
                style={{ fontFamily: 'ui-monospace, monospace' }}
              />
              
              <button
                onClick={handleInitialSubmit}
                disabled={!prompt.trim()}
                className="absolute bottom-3 right-3 w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
              >
                <ArrowUp className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Result Screen with Image
  if (appState === 'result') {
    const imageUrl = currentVibe?.image_url || SAMPLE_NAIL_IMAGE;
    
    return (
      <>
        <div className="min-h-screen bg-white flex flex-col">
          {/* Header */}
          <div className="flex justify-center pt-8 pb-4">
            <button 
              onClick={handleLogoClick}
              className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              nv
            </button>
          </div>
          
          {/* Image Result */}
          <div className="flex-1 flex flex-col justify-center px-6">
            <div className="max-w-sm mx-auto w-full">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-6">
                <img 
                  src={imageUrl} 
                  alt="Generated nail design" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to sample image if the URL fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = SAMPLE_NAIL_IMAGE;
                  }}
                />
              </div>
              
              {/* Vibe Info */}
              {currentVibe && (
                <div className="mb-4 text-center">
                  {currentVibe.title && (
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                      {currentVibe.title}
                    </h2>
                  )}
                  {currentVibe.tags && currentVibe.tags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mb-2">
                      {currentVibe.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Chat Trigger */}
              <div className="text-center">
                <button
                  onClick={openChat}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <span className="text-sm font-medium">Keep vibing</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Drawer */}
        {isChatOpen && (
          <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={closeChat}
            />
            
            {/* Chat Panel */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] flex flex-col animate-slide-up">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <button
                  onClick={closeChat}
                  className="w-8 h-8 flex items-center justify-center"
                >
                  <Minus className="w-6 h-6 text-gray-400" />
                </button>
                <button
                  onClick={closeChat}
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
                        <p className="text-sm text-gray-700">{message.content}</p>
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
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onFocus={handleChatInputFocus}
                    onBlur={handleChatInputBlur}
                    placeholder="Keep vibing"
                    className="flex-1 px-4 py-3 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleChatSubmit}
                    disabled={!chatInput.trim()}
                    className="w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <ArrowUp className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="p-4 pt-0">
                  <div className="text-xs text-gray-500 italic">
                    Typing...
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}

export default App;