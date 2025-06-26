import { supabase, VibeIdea, UserPrompt } from '../lib/supabase';
import { extractTags, calculateMatchScore } from './tagExtractor';

/**
 * Vibe Service
 * 
 * Handles all backend logic for finding and matching nail vibe ideas
 * based on user prompts and tag extraction.
 */

export interface VibeMatchResult {
  success: boolean;
  data?: {
    vibe: VibeIdea;
    matchScore: number;
    extractedTags: string[];
  };
  error?: string;
}

/**
 * Finds the best matching vibe idea for a user prompt
 * @param prompt - User's natural language prompt
 * @returns Promise with match result
 */
export async function findBestVibeMatch(prompt: string): Promise<VibeMatchResult> {
  try {
    // Step 1: Extract tags from the user prompt
    const extractedTags = extractTags(prompt);
    
    console.log('🏷️ Extracted tags:', extractedTags);
    
    if (extractedTags.length === 0) {
      return {
        success: false,
        error: 'Could not extract any tags from the prompt. Please try being more specific about the style, colors, or occasion.'
      };
    }

    // Step 2: Query all vibe ideas from Supabase
    const { data: vibeIdeas, error: queryError } = await supabase
      .from('vibe_ideas')
      .select('*');

    if (queryError) {
      console.error('❌ Supabase query error:', queryError);
      return {
        success: false,
        error: 'Failed to fetch vibe ideas from database'
      };
    }

    if (!vibeIdeas || vibeIdeas.length === 0) {
      return {
        success: false,
        error: 'No vibe ideas found in database'
      };
    }

    console.log(`📊 Found ${vibeIdeas.length} vibe ideas in database`);

    // Step 3: Calculate match scores for each vibe idea
    const scoredVibes = vibeIdeas.map(vibe => ({
      vibe,
      matchScore: calculateMatchScore(extractedTags, vibe.tags || [])
    }));

    // Step 4: Sort by match score (highest first)
    scoredVibes.sort((a, b) => b.matchScore - a.matchScore);

    console.log('🎯 Top 3 matches:', scoredVibes.slice(0, 3).map(sv => ({
      id: sv.vibe.id,
      tags: sv.vibe.tags,
      score: sv.matchScore
    })));

    // Step 5: Return the best match
    const bestMatch = scoredVibes[0];
    
    
  if (bestMatch.matchScore === 0) {
      return {
        success: false,
        error: `No matching vibes found for tags: ${extractedTags.join(', ')}. Try different keywords or styles.`
      };
    }

    // Step 6: Save the user prompt to database for analytics
    await saveUserPrompt(prompt, bestMatch.vibe.id);

    return {
      success: true,
      data: {
        vibe: bestMatch.vibe,
        matchScore: bestMatch.matchScore,
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
  
  const extractedTags = extractTags(prompt);
  console.log('🏷️ Debug: Extracted tags:', extractedTags);
  
  const result = await findBestVibeMatch(prompt);
  console.log('🎯 Debug: Match result:', result);
  
  return {
    prompt,
    extractedTags,
    result
  };
}