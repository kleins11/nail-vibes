/**
 * Tag Extraction Service
 * 
 * This service extracts relevant tags from user prompts using keyword matching.
 * The logic can be customized later to use more sophisticated NLP or AI-based extraction.
 */

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

/**
 * Extracts tags from a user prompt using keyword matching
 * @param prompt - The user's natural language prompt
 * @returns Array of extracted tags
 */
export function extractTags(prompt: string): string[] {
  if (!prompt || typeof prompt !== 'string') {
    return [];
  }

  // Convert prompt to lowercase for case-insensitive matching
  const lowerPrompt = prompt.toLowerCase().trim();
  const extractedTags: string[] = [];

  // Step 1: Check each tag category for keyword matches
  Object.entries(TAG_KEYWORDS).forEach(([tag, keywords]) => {
    const hasMatch = keywords.some(keyword => 
      lowerPrompt.includes(keyword.toLowerCase())
    );
    
    if (hasMatch) {
      extractedTags.push(tag);
    }
  });

  // Step 2: Direct tag matching - check if any word in the prompt exactly matches a known tag
  const promptWords = lowerPrompt.split(/\s+/).map(word => 
    // Remove common punctuation from words
    word.replace(/[.,!?;:"'()[\]{}]/g, '')
  ).filter(word => word.length > 0);

  promptWords.forEach(word => {
    // Check if this word is exactly a known tag
    if (ALL_KNOWN_TAGS.includes(word) && !extractedTags.includes(word)) {
      extractedTags.push(word);
    }
  });

  // Step 3: Single word prompt handling - if the entire prompt is one word and matches a tag
  if (promptWords.length === 1) {
    const singleWord = promptWords[0];
    if (ALL_KNOWN_TAGS.includes(singleWord) && !extractedTags.includes(singleWord)) {
      extractedTags.push(singleWord);
    }
  }

  // Remove duplicates and return
  return [...new Set(extractedTags)];
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

  // Count matching tags
  const matchingTags = extractedTags.filter(tag => 
    vibeIdeaTags.includes(tag)
  );

  // Calculate score based on percentage of extracted tags that match
  // and bonus for having more matches
  const baseScore = matchingTags.length / extractedTags.length;
  const bonusScore = Math.min(matchingTags.length * 0.1, 0.3); // Up to 30% bonus
  
  return Math.min(baseScore + bonusScore, 1);
}

/**
 * Debug function to show tag extraction results
 * @param prompt - The user prompt
 * @returns Object with prompt, extracted tags, and matched keywords
 */
export function debugTagExtraction(prompt: string) {
  const extractedTags = extractTags(prompt);
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

  return {
    prompt,
    extractedTags,
    matchedKeywords,
  };
}