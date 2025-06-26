import { supabase, VibeIdea, UserPrompt } from '../lib/supabase';
import { extractTagsFromPrompt } from './extractTagsFromPrompt';
import { findPrioritizedVibeMatch, PrioritizedVibeResult } from './prioritizedVibeSearch';

/**
 * Vibe Service
 * 
 * Updated to use the new prioritized search logic with primary and modifier tags
 */

// Extended interface to include match information from prioritized search
export interface VibeMatchData extends PrioritizedVibeResult {
  // Inherits all properties from PrioritizedVibeResult
}

export interface VibeMatchResult {
  success: boolean;
  data?: {
    vibe: VibeMatchData;
    extractedTags: string[];
    primaryTags: string[];
    modifierTags: string[];
    matchedConcept: string | null;
    searchStrategy: string;
  };
  error?: string;
}

/**
 * Finds the best matching vibe idea using prioritized search
 * @param prompt - User's natural language prompt
 * @returns Promise with match result including detailed tag information
 */
export async function findBestVibeMatch(prompt: string): Promise<VibeMatchResult> {
  try {
    console.log('🚀 Starting enhanced vibe matching for prompt:', prompt);

    // Step 1: Extract tags using the new concept-based extraction
    const tagExtraction = extractTagsFromPrompt(prompt);
    
    console.log('🏷️ Tag extraction results:');
    console.log('  - Matched concept:', tagExtraction.matchedConcept);
    console.log('  - Primary tags:', tagExtraction.primaryTags);
    console.log('  - Modifier tags:', tagExtraction.modifierTags);
    console.log('  - Combined tags:', tagExtraction.combinedTags);
    
    if (tagExtraction.combinedTags.length === 0) {
      return {
        success: false,
        error: 'Could not extract any tags from the prompt. Please try being more specific about the style, colors, or occasion.'
      };
    }

    // Step 2: Use prioritized search with primary and modifier tags
    console.log('🎯 Starting prioritized search...');
    
    const searchResult = await findPrioritizedVibeMatch(
      tagExtraction.primaryTags,
      tagExtraction.modifierTags
    );

    if (!searchResult.success || !searchResult.data) {
      return {
        success: false,
        error: searchResult.error || `No matching designs found. Try different keywords or styles.`
      };
    }

    const matchedVibe = searchResult.data;
    
    console.log('✅ Found best matching vibe via prioritized search:');
    console.log('  - Design ID:', matchedVibe.id);
    console.log('  - Title:', matchedVibe.title);
    console.log('  - Tags:', matchedVibe.tags);
    console.log('  - Match type:', matchedVibe.match_type);
    console.log('  - Match score:', matchedVibe.match_score);
    console.log('  - Primary matches:', matchedVibe.primary_matches);
    console.log('  - Modifier matches:', matchedVibe.modifier_matches);
    console.log('  - Search strategy:', searchResult.searchStrategy);

    // Step 3: Save the user prompt to database for analytics
    await saveUserPrompt(prompt, matchedVibe.id);

    return {
      success: true,
      data: {
        vibe: matchedVibe,
        extractedTags: tagExtraction.combinedTags,
        primaryTags: tagExtraction.primaryTags,
        modifierTags: tagExtraction.modifierTags,
        matchedConcept: tagExtraction.matchedConcept,
        searchStrategy: searchResult.searchStrategy
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
 * Debug function to test the entire enhanced vibe matching pipeline
 * @param prompt - Test prompt
 * @returns Detailed debug information
 */
export async function debugVibeMatching(prompt: string) {
  console.log('🔍 Debug: Starting enhanced vibe matching for prompt:', prompt);
  
  const tagExtraction = extractTagsFromPrompt(prompt);
  console.log('🏷️ Debug: Tag extraction:', tagExtraction);
  
  const result = await findBestVibeMatch(prompt);
  console.log('🎯 Debug: Final match result:', result);
  
  return {
    prompt,
    tagExtraction,
    result
  };
}