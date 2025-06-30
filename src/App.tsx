import React, { useState } from 'react';
import { findBestVibeMatch, VibeMatchResult, VibeMatchData, fetchBestMatchingDesign } from './services/vibeService';
import { extractTagsFromPrompt } from './services/extractTagsFromPrompt';
import { generateTitle } from './services/titleGenerator';
import LandingPage from './components/LandingPage';
import ResultPage from './components/ResultPage';
import LoadingPage from './components/LoadingPage';
import TransitionPage from './components/TransitionPage';

interface ChatMessage {
  id: string;
  type: 'user' | 'system';
  content: string;
  timestamp: Date;
}

type AppState = 'landing' | 'result' | 'loading' | 'transitioning';

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [prompt, setPrompt] = useState('');
  const [refinePrompt, setRefinePrompt] = useState('');
  const [refinedImageUrl, setRefinedImageUrl] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [currentVibe, setCurrentVibe] = useState<VibeMatchData | null>(null);
  const [matchInfo, setMatchInfo] = useState<{
    primaryTags: string[];
    modifierTags: string[];
    matchedConcept: string | null;
    searchStrategy: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // New state for image generation
  const [generatePrompt, setGeneratePrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const handleLogoClick = () => {
    // Start the elegant transition
    setAppState('transitioning');
    
    // After transition completes, reset everything and go to landing
    setTimeout(() => {
      setPrompt('');
      setRefinePrompt('');
      setRefinedImageUrl('');
      setChatMessages([]);
      setChatInput('');
      setIsChatOpen(false);
      setIsTyping(false);
      setIsRefining(false);
      setCurrentVibe(null);
      setMatchInfo(null);
      setError(null);
      setGeneratePrompt('');
      setGeneratedImageUrl('');
      setIsGenerating(false);
      setGenerateError(null);
      
      setAppState('landing');
    }, 1200); // Match the transition duration
  };

  // Image generation function with improved error handling
  const handleGenerateImage = async () => {
    if (!generatePrompt.trim()) return;
    
    setIsGenerating(true);
    setGenerateError(null);
    setGeneratedImageUrl('');
    
    try {
      console.log('🎨 Generating image with prompt:', generatePrompt);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/replicate-api/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: generatePrompt
        })
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ Generation failed with status:', response.status);
        console.error('❌ Error response:', result);
        
        // Handle different error types with user-friendly messages
        if (response.status === 503) {
          setGenerateError('Image generation service is not configured. Please contact support.');
        } else if (response.status === 401) {
          setGenerateError('Authentication error. Please contact support.');
        } else if (response.status === 408) {
          setGenerateError('Generation timed out. Please try a simpler prompt.');
        } else if (response.status === 422) {
          setGenerateError(result.error || 'Generation failed. Please try a different prompt.');
        } else {
          setGenerateError(result.error || `Server error (${response.status}). Please try again later.`);
        }
        return;
      }
      
      if (result.error) {
        console.error('❌ Generation error:', result.error);
        setGenerateError(result.error);
      } else if (result.image) {
        console.log('✅ Image generated successfully:', result.image);
        setGeneratedImageUrl(result.image);
      } else {
        setGenerateError('No image URL returned from the server');
      }
      
    } catch (error) {
      console.error('❌ Error generating image:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setGenerateError('Network error. Please check your connection and try again.');
      } else {
        setGenerateError(error instanceof Error ? error.message : 'Failed to generate image');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Example usage of fetchBestMatchingDesign function
  const handleInitialSubmitWithRPC = async () => {
    if (!prompt.trim()) return;
    
    setError(null);
    setAppState('loading');
    
    try {
      console.log('🚀 Using RPC function to search for best match with prompt:', prompt);
      
      // Extract tags from prompt
      const tagExtraction = extractTagsFromPrompt(prompt);
      console.log('🏷️ Extracted tags:', tagExtraction.combinedTags);
      
      // Call the new RPC function
      const result = await fetchBestMatchingDesign(tagExtraction.combinedTags);
      
      if (result.message) {
        // Handle error case
        console.error('❌ RPC function returned error:', result.message);
        setError(result.message);
        setAppState('landing');
        return;
      }
      
      if (result.data) {
        console.log('✅ Found design via RPC:', result.data);
        
        // Generate dynamic title based on user prompt
        const dynamicTitle = generateTitle(prompt, tagExtraction.matchedConcept);
        console.log('🏷️ Generated title:', dynamicTitle);
        
        // Create a mock vibe object that matches our interface
        const mockVibe: VibeMatchData = {
          id: result.data.id,
          image_url: result.data.image_url,
          title: dynamicTitle, // Use the generated title instead of database title
          tags: result.data.tags || [],
          description: result.data.description,
          source_url: result.data.source_url,
          match_score: result.data.match_score || 1,
          primary_matches: result.data.primary_matches || 0,
          modifier_matches: result.data.modifier_matches || 0,
          match_type: 'all_primary' as const
        };
        
        setCurrentVibe(mockVibe);
        setMatchInfo({
          primaryTags: tagExtraction.primaryTags,
          modifierTags: tagExtraction.modifierTags,
          matchedConcept: tagExtraction.matchedConcept,
          searchStrategy: 'rpc_function'
        });
        
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
          content: result.data.description || "Here's a perfect nail design that matches your vibe! ✨",
          timestamp: new Date()
        };
        
        setChatMessages([userMessage, systemMessage]);
        setAppState('result');
      }
    } catch (error) {
      console.error('❌ Error in handleInitialSubmitWithRPC:', error);
      setError('An unexpected error occurred. Please try again.');
      setAppState('landing');
    }
  };

  const handleGenerateImageWithImage = async () => {
    if (!generatePrompt.trim()) return;
    
    setIsGenerating(true);
    setGenerateError(null);
    setGeneratedImageUrl('');

    const promptWithContext = `Adjust only the nails in the image and make the nails ${refinePrompt} keeping the background, hands, and fingers unchanged.`
    
    try {
      console.log('🎨 Generating image with prompt:', generatePrompt);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/replicate-api/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_prompt: refinedImageUrl,
          prompt: promptWithContext
        })
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ Generation failed with status:', response.status);
        console.error('❌ Error response:', result);
        
        // Handle different error types with user-friendly messages
        if (response.status === 503) {
          setGenerateError('Image generation service is not configured. Please contact support.');
        } else if (response.status === 401) {
          setGenerateError('Authentication error. Please contact support.');
        } else if (response.status === 408) {
          setGenerateError('Generation timed out. Please try a simpler prompt.');
        } else if (response.status === 422) {
          setGenerateError(result.error || 'Generation failed. Please try a different prompt.');
        } else {
          setGenerateError(result.error || `Server error (${response.status}). Please try again later.`);
        }
        return;
      }
      
      if (result.error) {
        console.error('❌ Generation error:', result.error);
        setGenerateError(result.error);
      } else if (result.image) {
        console.log('✅ Image generated successfully:', result.image);
        setGeneratedImageUrl(result.image);
      } else {
        setGenerateError('No image URL returned from the server');
      }
      
    } catch (error) {
      console.error('❌ Error generating image:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setGenerateError('Network error. Please check your connection and try again.');
      } else {
        setGenerateError(error instanceof Error ? error.message : 'Failed to generate image');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInitialSubmit = async () => {
    if (!prompt.trim()) return;
    
    setError(null);
    setAppState('loading');
    
    try {
      console.log('🚀 Searching for best vibe match with prompt:', prompt);
      
      // Call the enhanced backend service
      const result: VibeMatchResult = await findBestVibeMatch(prompt);
      
      if (result.success && result.data) {
        const { vibe, primaryTags, modifierTags, matchedConcept, searchStrategy } = result.data;
        
        console.log('✅ Found best matching vibe:', vibe);
        console.log('🎯 Match details:', {
          concept: matchedConcept,
          primaryTags,
          modifierTags,
          strategy: searchStrategy,
          matchType: vibe.match_type,
          score: vibe.match_score
        });
        
        // Generate dynamic title based on user prompt
        const dynamicTitle = generateTitle(prompt, matchedConcept);
        console.log('🏷️ Generated title:', dynamicTitle);
        
        // Update the vibe with the dynamic title
        const updatedVibe = {
          ...vibe,
          title: dynamicTitle
        };
        
        // Set the current vibe and match info for display
        setCurrentVibe(updatedVibe);
        setMatchInfo({
          primaryTags,
          modifierTags,
          matchedConcept,
          searchStrategy
        });
        
        // Create chat messages with enhanced match information
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'user',
          content: prompt,
          timestamp: new Date()
        };
        
        // Create a more informative system message
        let systemMessageContent = "Here's a perfect nail design that matches your vibe! ✨";
        
        if (matchedConcept) {
          systemMessageContent = `Perfect! I found a ${matchedConcept} inspired design that matches your vibe! ✨`;
        }
        
        if (vibe.match_type === 'all_primary') {
          systemMessageContent += ` This design matches all your core style elements.`;
        } else if (vibe.match_type === 'some_primary') {
          systemMessageContent += ` This design captures the essence of your style.`;
        }
        
        const systemMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'system',
          content: vibe.description || systemMessageContent,
          timestamp: new Date()
        };
        
        setChatMessages([userMessage, systemMessage]);
        setAppState('result');
      } else {
        // Handle error case
        console.error('❌ Failed to find best vibe match:', result.error);
        setError(result.error || 'Failed to find a matching vibe');
        setAppState('landing');
      }
    } catch (error) {
      console.error('❌ Error in handleInitialSubmit:', error);
      setError('An unexpected error occurred. Please try again.');
      setAppState('landing');
    }
  };

  // NIKO CREATED FUNCTION
  const handleRefineSubmit = async () => {
    if (!refinePrompt.trim() || !currentVibe?.image_url) {
      console.log('⚠️ Missing refine prompt or base image URL');
      return;
    }
    
    setIsRefining(true);
    console.log('🎨 Refining design with prompt:', refinePrompt);
    const promptWithContext = `Adjust only the nails in the image and make the nails ${refinePrompt} keeping the background, hands, and fingers unchanged.`
    
    try {
      // Make POST request to the refine nail design endpoint
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/replicate-api/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: currentVibe.image_url,
          mask: currentVibe.mask_url,
          prompt: promptWithContext
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.error) {
        console.error('❌ Refinement error:', result.error);
        // Add error message to chat
        const errorMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'system',
          content: `Sorry, I couldn't refine the design: ${result.error}`,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, errorMessage]);
      } else if (result.image) {
        console.log('✅ Refinement successful:', result.image);
        
        // Set the refined image URL
        setRefinedImageUrl(result.image);
        
        // Generate updated title that incorporates the refinement
        const originalPrompt = prompt;
        const refinementPrompt = refinePrompt;
        const combinedPrompt = `${originalPrompt} ${refinementPrompt}`;
        const updatedTitle = generateTitle(combinedPrompt, matchInfo?.matchedConcept);
        
        // Update the current vibe with the new title
        if (currentVibe) {
          setCurrentVibe({
            ...currentVibe,
            title: updatedTitle
          });
        }
        
        // Add success message to chat
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'user',
          content: refinePrompt,
          timestamp: new Date()
        };
        
        const systemMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'system',
          content: "Perfect! I've refined your design with your requested changes. Check out the updated image above! ✨",
          timestamp: new Date()
        };
        
        setChatMessages(prev => [...prev, userMessage, systemMessage]);
      }
      
      // Clear the refine prompt after submission
      setRefinePrompt('');
      
    } catch (error) {
      console.error('❌ Error in handleRefineSubmit:', error);
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'system',
        content: "Sorry, there was an error refining your design. Please try again!",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsRefining(false);
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

  const handleKeyPress = (e: React.KeyboardEvent, isChat: boolean = false, isRefine: boolean = false, isGenerate: boolean = false) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isGenerate) {
        handleGenerateImage();
      } else if (isRefine) {
        handleRefineSubmit();
      } else if (isChat) {
        handleChatSubmit();
      } else {
        handleInitialSubmit();
      }
    }
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

  // Transition Screen
  if (appState === 'transitioning') {
    return <TransitionPage currentVibe={currentVibe} />;
  }

  // Loading Screen
  if (appState === 'loading') {
    return <LoadingPage onLogoClick={handleLogoClick} />;
  }

  // Landing Screen
  if (appState === 'landing') {
    return (
      <LandingPage
        prompt={prompt}
        setPrompt={setPrompt}
        generatePrompt={generatePrompt}
        setGeneratePrompt={setGeneratePrompt}
        generatedImageUrl={generatedImageUrl}
        isGenerating={isGenerating}
        generateError={generateError}
        error={error}
        onInitialSubmit={handleInitialSubmit}
        onGenerateImage={handleGenerateImage}
        onLogoClick={handleLogoClick}
        handleKeyPress={handleKeyPress}
      />
    );
  }

  // Result Screen
  if (appState === 'result') {
    return (
      <ResultPage
        currentVibe={currentVibe}
        matchInfo={matchInfo}
        refinedImageUrl={refinedImageUrl}
        isRefining={isRefining}
        refinePrompt={refinePrompt}
        setRefinePrompt={setRefinePrompt}
        chatMessages={chatMessages}
        isChatOpen={isChatOpen}
        isTyping={isTyping}
        prompt={prompt}
        onLogoClick={handleLogoClick}
        onRefineSubmit={handleRefineSubmit}
        onOpenChat={openChat}
        onCloseChat={closeChat}
        onChatInputFocus={handleChatInputFocus}
        onChatInputBlur={handleChatInputBlur}
        handleKeyPress={handleKeyPress}
      />
    );
  }

  return null;
}

export default App;