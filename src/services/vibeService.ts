import { supabase, VibeIdea, UserPrompt } from '../lib/supabase';
import { extractTags } from './tagExtractor';

/**
 * Vibe Service
 * 
 * Handles all backend logic for finding and matching nail vibe ideas
 * based on user prompts using Supabase RPC functions.
 */

// Extended interface to include match_count from the new RPC function
export interface VibeMatchData extends VibeIdea {
  match_count: number;
}

export interface VibeMatchResult {
  success: boolean;
  data?: {
    vibe: VibeMatchData;
    extractedTags: string[];
  };
  error?: string;
}

/**
 * Finds the best matching vibe idea for a user prompt using Supabase RPC
 * @param prompt - User's natural language prompt
 * @returns Promise with match result including match count
 */
export async function findBestVibeMatch(prompt: string): Promise<VibeMatchResult> {
  try {
    // Step 1: Extract tags from the user prompt
    const extractedTags = await extractTags(prompt);
    
    console.log('🏷️ Extracted tags:', extractedTags);
    
    if (extractedTags.length === 0) {
      return {
        success: false,
        error: 'Could not extract any tags from the prompt. Please try being more specific about the style, colors, or occasion.'
      };
    }

    // Step 2: Call Supabase RPC function to get the best matching design
    console.log('🎯 Calling get_best_matching_design with tags:', extractedTags);
    
    const { data, error } = await supabase.rpc('get_best_matching_design', {
      tags_input: extractedTags
    });

    if (error) {
      console.error('❌ Supabase RPC error:', error);
      return {
        success: false,
        error: 'Failed to fetch matching designs from database'
      };
    }

    if (!data || data.length === 0) {
      return {
        success: false,
        error: `No matching designs found for tags: ${extractedTags.join(', ')}. Try different keywords or styles.`
      };
    }

    // Step 3: Get the first (and should be only) result
    const matchedVibe = data[0] as VibeMatchData;
    
    console.log('✅ Found best matching vibe via RPC:', {
      id: matchedVibe.id,
      title: matchedVibe.title,
      tags: matchedVibe.tags,
      match_count: matchedVibe.match_count
    });

    // Step 4: Save the user prompt to database for analytics
    await saveUserPrompt(prompt, matchedVibe.id);

    return {
      success: true,
      data: {
        vibe: matchedVibe,
        extractedTags
      }
    };

  } catch (error) {
    console.error('❌ Error in findBestVibeMatch:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while finding vibe matches'
    };
  }
}

/**
 * Saves a user prompt to the database for analytics and future improvements
 * @param promptText - The user's prompt
 * @param matchedVibeId - ID of the matched vibe idea
 */
async function saveUserPrompt(promptText: string, matchedVibeId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('user_prompts')
      .insert({
        prompt_text: promptText,
        matched_vibe_id: matchedVibeId
      });

    if (error) {
      console.error('⚠️ Failed to save user prompt:', error);
      // Don't throw error - this is not critical for user experience
    } else {
      console.log('✅ User prompt saved successfully');
    }
  } catch (error) {
    console.error('⚠️ Error saving user prompt:', error);
    // Don't throw error - this is not critical for user experience
  }
}

/**
 * Gets random vibe ideas for testing or fallback scenarios
 * @param limit - Number of random vibes to return
 * @returns Promise with random vibe ideas
 */
export async function getRandomVibes(limit: number = 5): Promise<VibeIdea[]> {
  try {
    const { data, error } = await supabase
      .from('vibe_ideas')
      .select('*')
      .limit(limit);

    if (error) {
      console.error('❌ Error fetching random vibes:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('❌ Error in getRandomVibes:', error);
    return [];
  }
}

/**
 * Debug function to test the entire vibe matching pipeline
 * @param prompt - Test prompt
 * @returns Detailed debug information
 */
export async function debugVibeMatching(prompt: string) {
  console.log('🔍 Debug: Starting vibe matching for prompt:', prompt);
  
  const extractedTags = await extractTags(prompt);
  console.log('🏷️ Debug: Extracted tags:', extractedTags);
  
  const result = await findBestVibeMatch(prompt);
  console.log('🎯 Debug: Match result:', result);
  
  return {
    prompt,
    extractedTags,
    result
  };
}