/**
 * Prioritized Vibe Search Service
 * 
 * Searches for nail designs with prioritized matching:
 * 1. First tries to match ALL primary tags (core concept)
 * 2. Optionally boosts results that also match modifier tags
 * 3. Falls back to ANY primary or modifier tag matches
 */

import { supabase, VibeIdea } from '../lib/supabase';

export interface PrioritizedVibeResult extends VibeIdea {
  match_score: number;
  primary_matches: number;
  modifier_matches: number;
  match_type: 'all_primary' | 'some_primary' | 'any_tags' | 'fallback';
}

export interface SearchResult {
  success: boolean;
  data?: PrioritizedVibeResult;
  error?: string;
  searchStrategy: string;
}

/**
 * Main search function that prioritizes primary tags over modifier tags
 * @param primaryTags - Core concept tags that should be prioritized
 * @param modifierTags - Optional modifier tags for enhancement
 * @returns Promise with the best matching design
 */
export async function findPrioritizedVibeMatch(
  primaryTags: string[], 
  modifierTags: string[] = []
): Promise<SearchResult> {
  try {
    console.log('🎯 Starting prioritized search...');
    console.log('  Primary tags:', primaryTags);
    console.log('  Modifier tags:', modifierTags);

    if (primaryTags.length === 0 && modifierTags.length === 0) {
      return {
        success: false,
        error: 'No tags provided for search',
        searchStrategy: 'none'
      };
    }

    // Strategy 1: Find designs that match ALL primary tags
    if (primaryTags.length > 0) {
      console.log('🔍 Strategy 1: Looking for designs with ALL primary tags...');
      const allPrimaryMatches = await findDesignsWithAllTags(primaryTags);
      
      if (allPrimaryMatches.length > 0) {
        console.log(`✅ Found ${allPrimaryMatches.length} designs matching all primary tags`);
        
        // Boost results that also have modifier tags
        const boostedResults = boostWithModifierTags(allPrimaryMatches, modifierTags);
        const bestMatch = selectRandomWeightedResult(boostedResults);
        
        return {
          success: true,
          data: {
            ...bestMatch,
            match_type: 'all_primary'
          },
          searchStrategy: 'all_primary_tags'
        };
      }
    }

    // Strategy 2: Find designs that match SOME primary tags
    if (primaryTags.length > 0) {
      console.log('🔍 Strategy 2: Looking for designs with SOME primary tags...');
      const somePrimaryMatches = await findDesignsWithSomeTags(primaryTags);
      
      if (somePrimaryMatches.length > 0) {
        console.log(`✅ Found ${somePrimaryMatches.length} designs matching some primary tags`);
        
        // Boost results that also have modifier tags
        const boostedResults = boostWithModifierTags(somePrimaryMatches, modifierTags);
        const bestMatch = selectRandomWeightedResult(boostedResults);
        
        return {
          success: true,
          data: {
            ...bestMatch,
            match_type: 'some_primary'
          },
          searchStrategy: 'some_primary_tags'
        };
      }
    }

    // Strategy 3: Find designs that match ANY tags (primary or modifier)
    const allTags = [...primaryTags, ...modifierTags];
    if (allTags.length > 0) {
      console.log('🔍 Strategy 3: Looking for designs with ANY tags...');
      const anyTagMatches = await findDesignsWithSomeTags(allTags);
      
      if (anyTagMatches.length > 0) {
        console.log(`✅ Found ${anyTagMatches.length} designs matching any tags`);
        
        const scoredResults = scoreResults(anyTagMatches, primaryTags, modifierTags);
        const bestMatch = selectRandomWeightedResult(scoredResults);
        
        return {
          success: true,
          data: {
            ...bestMatch,
            match_type: 'any_tags'
          },
          searchStrategy: 'any_tags'
        };
      }
    }

    // Strategy 4: Fallback to random design
    console.log('🔍 Strategy 4: Fallback to random design...');
    const randomDesign = await getRandomDesign();
    
    if (randomDesign) {
      console.log('✅ Returning random fallback design');
      return {
        success: true,
        data: {
          ...randomDesign,
          match_score: 0,
          primary_matches: 0,
          modifier_matches: 0,
          match_type: 'fallback'
        },
        searchStrategy: 'random_fallback'
      };
    }

    return {
      success: false,
      error: 'No designs found in database',
      searchStrategy: 'failed'
    };

  } catch (error) {
    console.error('❌ Error in findPrioritizedVibeMatch:', error);
    return {
      success: false,
      error: 'Database search failed',
      searchStrategy: 'error'
    };
  }
}

/**
 * Finds designs that contain ALL specified tags
 * @param tags - Array of tags that must all be present
 * @returns Promise with matching designs
 */
async function findDesignsWithAllTags(tags: string[]): Promise<VibeIdea[]> {
  try {
    const { data, error } = await supabase
      .from('vibe_ideas')
      .select('*')
      .contains('tags', tags); // PostgreSQL array contains operator

    if (error) {
      console.error('❌ Error in findDesignsWithAllTags:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('❌ Exception in findDesignsWithAllTags:', error);
    return [];
  }
}

/**
 * Finds designs that contain ANY of the specified tags
 * @param tags - Array of tags to search for
 * @returns Promise with matching designs
 */
async function findDesignsWithSomeTags(tags: string[]): Promise<VibeIdea[]> {
  try {
    const { data, error } = await supabase
      .from('vibe_ideas')
      .select('*')
      .overlaps('tags', tags); // PostgreSQL array overlap operator

    if (error) {
      console.error('❌ Error in findDesignsWithSomeTags:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('❌ Exception in findDesignsWithSomeTags:', error);
    return [];
  }
}

/**
 * Gets a random design as fallback
 * @returns Promise with random design or null
 */
async function getRandomDesign(): Promise<VibeIdea | null> {
  try {
    const { data, error } = await supabase
      .from('vibe_ideas')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error in getRandomDesign:', error);
      return null;
    }

    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('❌ Exception in getRandomDesign:', error);
    return null;
  }
}

/**
 * Boosts results that also match modifier tags
 * @param designs - Base designs to boost
 * @param modifierTags - Tags to check for boosting
 * @returns Scored results with boost applied
 */
function boostWithModifierTags(designs: VibeIdea[], modifierTags: string[]): PrioritizedVibeResult[] {
  return designs.map(design => {
    const primaryMatches = design.tags.length; // Assuming all matched since they came from primary search
    const modifierMatches = modifierTags.filter(tag => 
      design.tags.some(designTag => designTag.toLowerCase() === tag.toLowerCase())
    ).length;

    // Base score for primary matches + bonus for modifier matches
    const matchScore = primaryMatches + (modifierMatches * 0.5);

    return {
      ...design,
      match_score: matchScore,
      primary_matches: primaryMatches,
      modifier_matches: modifierMatches,
      match_type: 'all_primary' as const
    };
  });
}

/**
 * Scores results based on primary and modifier tag matches
 * @param designs - Designs to score
 * @param primaryTags - Primary tags for scoring
 * @param modifierTags - Modifier tags for scoring
 * @returns Scored results
 */
function scoreResults(
  designs: VibeIdea[], 
  primaryTags: string[], 
  modifierTags: string[]
): PrioritizedVibeResult[] {
  return designs.map(design => {
    const primaryMatches = primaryTags.filter(tag => 
      design.tags.some(designTag => designTag.toLowerCase() === tag.toLowerCase())
    ).length;

    const modifierMatches = modifierTags.filter(tag => 
      design.tags.some(designTag => designTag.toLowerCase() === tag.toLowerCase())
    ).length;

    // Weight primary matches more heavily than modifier matches
    const matchScore = (primaryMatches * 2) + (modifierMatches * 1);

    return {
      ...design,
      match_score: matchScore,
      primary_matches: primaryMatches,
      modifier_matches: modifierMatches,
      match_type: 'any_tags' as const
    };
  });
}

/**
 * Selects a random result weighted by match score
 * @param results - Scored results to choose from
 * @returns Single best result
 */
function selectRandomWeightedResult(results: PrioritizedVibeResult[]): PrioritizedVibeResult {
  if (results.length === 0) {
    throw new Error('No results to select from');
  }

  if (results.length === 1) {
    return results[0];
  }

  // Sort by match score (highest first) and take top results
  const sortedResults = results.sort((a, b) => b.match_score - a.match_score);
  
  
  // Return random result from the top-scoring group
  const randomIndex = Math.floor(Math.random() * sortedResults.length);
  return sortedResults[randomIndex];
}

/**
 * Debug function to test the prioritized search
 * @param primaryTags - Primary tags to test
 * @param modifierTags - Modifier tags to test
 * @returns Detailed search results
 */
export async function debugPrioritizedSearch(primaryTags: string[], modifierTags: string[] = []) {
  console.log('🔍 Debug: Testing prioritized search...');
  console.log('  Primary tags:', primaryTags);
  console.log('  Modifier tags:', modifierTags);
  
  const result = await findPrioritizedVibeMatch(primaryTags, modifierTags);
  
  console.log('📊 Debug Results:');
  console.log('  - Success:', result.success);
  console.log('  - Strategy:', result.searchStrategy);
  console.log('  - Error:', result.error);
  
  if (result.data) {
    console.log('  - Match Type:', result.data.match_type);
    console.log('  - Match Score:', result.data.match_score);
    console.log('  - Primary Matches:', result.data.primary_matches);
    console.log('  - Modifier Matches:', result.data.modifier_matches);
    console.log('  - Design ID:', result.data.id);
    console.log('  - Design Tags:', result.data.tags);
  }
  
  return result;
}