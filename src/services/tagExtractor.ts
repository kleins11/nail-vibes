/**
 * Tag Extraction Service
 * 
 * This service extracts relevant tags from user prompts using keyword matching.
 * The logic can be customized later to use more sophisticated NLP or AI-based extraction.
 */

import { supabase } from '../lib/supabase';

// Predefined tag categories with associated keywords
const TAG_KEYWORDS = {
  // Style categories
  elegant: ['elegant', 'classy', 'sophisticated', 'refined', 'graceful', 'chic'],
  edgy: ['edgy', 'bold', 'dramatic', 'fierce', 'punk', 'rock', 'gothic', 'dark'],
  minimalist: ['minimalist', 'simple', 'clean', 'subtle', 'understated', 'basic'],
  maximalist: ['maximalist', '3d', 'elaborate', 'ornate', 'detailed', 'complex', 'busy'],
  cute: ['cute', 'adorable', 'sweet', 'kawaii', 'playful', 'fun'],
  glamorous: ['glamorous', 'glam', 'sparkly', 'glittery', 'shiny', 'luxurious'],
  
  // Color categories
  neutral: ['neutral', 'nude', 'beige', 'natural', 'brown', 'tan'],
  pink: ['pink', 'rose', 'blush', 'coral', 'salmon'],
  red: ['red', 'crimson', 'burgundy', 'wine', 'cherry'],
  black: ['black', 'dark', 'midnight', 'charcoal'],
  white: ['white', 'ivory', 'cream', 'pearl'],
  blue: ['blue', 'navy', 'teal', 'turquoise', 'aqua'],
  green: ['green', 'mint', 'sage', 'emerald', 'forest'],
  purple: ['purple', 'lavender', 'violet', 'plum'],
  gold: ['gold', 'golden', 'metallic', 'bronze'],
  silver: ['silver', 'chrome', 'platinum'],
  
  // Occasion categories
  wedding: ['wedding', 'bridal', 'bride', 'ceremony', 'marriage'],
  party: ['party', 'celebration', 'festive', 'birthday'],
  beach: ['beach', 'summer', 'vacation', 'tropical', 'ocean'],
  work: ['work', 'office', 'professional', 'business', 'corporate'],
  date: ['date', 'romantic', 'dinner', 'evening'],
  casual: ['casual', 'everyday', 'daily', 'relaxed'],
  
  // Design elements
  floral: ['floral', 'flower', 'flowers', 'botanical', 'garden', 'rose', 'daisy'],
  geometric: ['geometric', 'lines', 'shapes', 'triangles', 'squares'],
  french: ['french', 'tips', 'classic'],
  ombre: ['ombre', 'gradient', 'fade', 'blend'],
  marble: ['marble', 'marbled', 'stone'],
  glitter: ['glitter', 'sparkle', 'shimmer', 'holographic'],
  matte: ['matte', 'flat', 'non-glossy'],
  
  // Nail shapes
  coffin: ['coffin', 'ballerina'],
  almond: ['almond', 'pointed'],
  square: ['square', 'squared'],
  round: ['round', 'rounded'],
  oval: ['oval'],
  stiletto: ['stiletto', 'sharp'],
  
  // Length
  short: ['short', 'small', 'tiny'],
  medium: ['medium', 'mid-length'],
  long: ['long', 'extended'],
  
  // Finish
  glossy: ['glossy', 'shiny', 'high-gloss'],
  chrome: ['chrome', 'mirror', 'metallic'],
  holographic: ['holographic', 'holo', 'rainbow'],
};

// Create a flat list of all known tags for direct matching
const ALL_KNOWN_TAGS = Object.keys(TAG_KEYWORDS);

// Cache for database tags to avoid repeated queries
let cachedDatabaseTags: string[] | null = null;
let tagsFetchPromise: Promise<string[]> | null = null;

/**
 * Fetches all distinct tags from the vibe_ideas table in Supabase
 * Uses caching to avoid repeated database queries
 * @returns Promise<string[]> - Array of all unique tags from the database
 */
export async function getKnownTags(): Promise<string[]> {
  // Return cached tags if available
  if (cachedDatabaseTags !== null) {
    console.log('🏷️ Using cached database tags:', cachedDatabaseTags.length, 'tags');
    return cachedDatabaseTags;
  }

  // If a fetch is already in progress, return that promise
  if (tagsFetchPromise !== null) {
    console.log('🏷️ Fetch already in progress, waiting...');
    return tagsFetchPromise;
  }

  // Start a new fetch
  console.log('🏷️ Fetching tags from Supabase...');
  tagsFetchPromise = fetchTagsFromDatabase();
  
  try {
    const tags = await tagsFetchPromise;
    cachedDatabaseTags = tags;
    tagsFetchPromise = null;
    console.log('✅ Successfully cached', tags.length, 'database tags');
    return tags;
  } catch (error) {
    tagsFetchPromise = null;
    throw error;
  }
}

/**
 * Fetches tags from Supabase by querying all vibe_ideas and extracting tags client-side
 */
async function fetchTagsFromDatabase(): Promise<string[]> {
  try {
    const { data: vibeIdeas, error } = await supabase
      .from('vibe_ideas')
      .select('tags');

    if (error) {
      console.error('❌ Query failed:', error);
      return [];
    }

    if (!vibeIdeas || vibeIdeas.length === 0) {
      console.warn('⚠️ No vibe ideas found in database');
      return [];
    }

    // Extract all tags from all records
    const allTags: string[] = [];
    vibeIdeas.forEach(vibe => {
      if (vibe.tags && Array.isArray(vibe.tags)) {
        vibe.tags.forEach(tag => {
          if (tag && typeof tag === 'string' && tag.trim().length > 0) {
            allTags.push(tag.toLowerCase().trim());
          }
        });
      }
    });

    // Remove duplicates
    const uniqueTags = [...new Set(allTags)];
    
    console.log('📊 Extracted', uniqueTags.length, 'unique tags from', vibeIdeas.length, 'vibe ideas');
    return uniqueTags;

  } catch (error) {
    console.error('❌ Tag extraction failed:', error);
    return [];
  }
}

/**
 * Extracts tags from a user prompt using keyword matching and database tag matching
 * @param prompt - The user's natural language prompt
 * @returns Promise<string[]> - Array of extracted tags
 */
export async function extractTags(prompt: string): Promise<string[]> {
  if (!prompt || typeof prompt !== 'string') {
    return [];
  }

  // Convert prompt to lowercase for case-insensitive matching
  const lowerPrompt = prompt.toLowerCase().trim();
  const extractedTags: string[] = [];

  // Step 1: Check each tag category for keyword matches (existing logic)
  Object.entries(TAG_KEYWORDS).forEach(([tag, keywords]) => {
    const hasMatch = keywords.some(keyword => 
      lowerPrompt.includes(keyword.toLowerCase())
    );
    
    if (hasMatch) {
      extractedTags.push(tag);
    }
  });

  // Step 2: Direct tag matching - check if any word in the prompt exactly matches a known category tag
  const promptWords = lowerPrompt.split(/\s+/).map(word => 
    // Remove common punctuation from words
    word.replace(/[.,!?;:"'()[\]{}]/g, '')
  ).filter(word => word.length > 0);

  promptWords.forEach(word => {
    // Check if this word is exactly a known category tag
    if (ALL_KNOWN_TAGS.includes(word) && !extractedTags.includes(word)) {
      extractedTags.push(word);
    }
  });

  // Step 3: Database tag fallback - fetch known tags from database and check for matches
  try {
    const databaseTags = await getKnownTags();
    
    promptWords.forEach(word => {
      // Check if this word exists in the database tags
      if (databaseTags.includes(word.toLowerCase()) && !extractedTags.includes(word.toLowerCase())) {
        extractedTags.push(word.toLowerCase());
      }
    });

    // Step 4: Single word prompt handling - special case for one-word prompts
    if (promptWords.length === 1) {
      const singleWord = promptWords[0].toLowerCase();
      if (databaseTags.includes(singleWord) && !extractedTags.includes(singleWord)) {
        extractedTags.push(singleWord);
      }
    }

  } catch (error) {
    console.error('⚠️ Failed to fetch database tags, skipping database tag matching:', error);
    // Continue without database tag matching - the keyword matching will still work
  }

  // Remove duplicates and return
  const uniqueTags = [...new Set(extractedTags)];
  
  console.log('🏷️ Tag extraction results:', {
    prompt: prompt,
    extractedTags: uniqueTags,
    totalTags: uniqueTags.length
  });

  return uniqueTags;
}

/**
 * Calculates a match score between extracted tags and vibe idea tags
 * @param extractedTags - Tags extracted from user prompt
 * @param vibeIdeaTags - Tags from a vibe idea record
 * @returns Match score (0-1, where 1 is perfect match)
 */
export function calculateMatchScore(extractedTags: string[], vibeIdeaTags: string[]): number {
  if (!extractedTags.length || !vibeIdeaTags.length) {
    return 0;
  }

  // Normalize both arrays to lowercase for comparison
  const normalizedExtracted = extractedTags.map(tag => tag.toLowerCase());
  const normalizedVibeIdea = vibeIdeaTags.map(tag => tag.toLowerCase());

  // Count matching tags
  const matchingTags = normalizedExtracted.filter(tag => 
    normalizedVibeIdea.includes(tag)
  );

  // Calculate score based on percentage of extracted tags that match
  // and bonus for having more matches
  const baseScore = matchingTags.length / normalizedExtracted.length;
  const bonusScore = Math.min(matchingTags.length * 0.1, 0.3); // Up to 30% bonus
  
  return Math.min(baseScore + bonusScore, 1);
}

/**
 * Clears the cached database tags (useful for testing or when tags are updated)
 */
export function clearTagCache(): void {
  cachedDatabaseTags = null;
  tagsFetchPromise = null;
  console.log('🗑️ Tag cache cleared');
}

/**
 * Debug function to show tag extraction results
 * @param prompt - The user prompt
 * @returns Promise with detailed debug information
 */
export async function debugTagExtraction(prompt: string) {
  const extractedTags = await extractTags(prompt);
  const lowerPrompt = prompt.toLowerCase();
  
  const matchedKeywords: Record<string, string[]> = {};
  
  Object.entries(TAG_KEYWORDS).forEach(([tag, keywords]) => {
    const matches = keywords.filter(keyword => 
      lowerPrompt.includes(keyword.toLowerCase())
    );
    if (matches.length > 0) {
      matchedKeywords[tag] = matches;
    }
  });

  // Get database tags for debugging
  let databaseTags: string[] = [];
  let databaseTagMatches: string[] = [];
  
  try {
    databaseTags = await getKnownTags();
    const promptWords = lowerPrompt.split(/\s+/).map(word => 
      word.replace(/[.,!?;:"'()[\]{}]/g, '')
    ).filter(word => word.length > 0);

    databaseTagMatches = promptWords.filter(word => 
      databaseTags.includes(word.toLowerCase())
    );
  } catch (error) {
    console.error('Debug: Failed to fetch database tags:', error);
  }

  return {
    prompt,
    extractedTags,
    matchedKeywords,
    databaseTagMatches,
    totalDatabaseTags: databaseTags.length,
    cachedTagsAvailable: cachedDatabaseTags !== null
  };
}