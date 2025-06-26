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

// Hardcoded list of known database tags that might not be in TAG_KEYWORDS
// These are tags that exist in the vibe_ideas.tags field in the database
const DATABASE_TAGS = [
  // Additional style tags
  'goth', 'gothic', 'punk', 'grunge', 'boho', 'bohemian', 'vintage', 'retro',
  'modern', 'contemporary', 'classic', 'traditional', 'trendy', 'chic',
  
  // Theme tags
  'fruit', 'citrus', 'tropical', 'nature', 'animal', 'abstract', 'artistic',
  'music', 'sports', 'travel', 'food', 'holiday', 'seasonal', 'winter', 'spring',
  'summer', 'fall', 'autumn', 'christmas', 'halloween', 'valentine',
  
  // Texture/finish tags
  'textured', 'smooth', 'rough', 'bumpy', 'raised', 'embossed', 'foil',
  'velvet', 'satin', 'pearl', 'iridescent', 'neon', 'pastel',
  
  // Pattern tags
  'stripes', 'dots', 'polka', 'chevron', 'zigzag', 'plaid', 'checkered',
  'leopard', 'zebra', 'snake', 'tie-dye', 'galaxy', 'space', 'stars',
  
  // Cultural/themed tags
  'japanese', 'korean', 'chinese', 'indian', 'mexican', 'african', 'tribal',
  'mandala', 'henna', 'paisley', 'damask', 'baroque', 'art-deco',
  
  // Occasion-specific
  'prom', 'graduation', 'anniversary', 'engagement', 'baby-shower',
  'bachelorette', 'girls-night', 'spa-day', 'vacation', 'cruise',
  
  // Mood/vibe tags
  'fierce', 'soft', 'dreamy', 'mysterious', 'bold', 'subtle', 'dramatic',
  'romantic', 'edgy', 'sweet', 'sassy', 'classy', 'funky', 'wild'
];

// Combine all known tags (from categories and database) for comprehensive matching
const ALL_POSSIBLE_TAGS = [...ALL_KNOWN_TAGS, ...DATABASE_TAGS.map(tag => tag.toLowerCase())];

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

  // Step 4: DATABASE TAG FALLBACK - Check for exact matches against known database tags
  promptWords.forEach(word => {
    // Normalize the word and check if it exists in our database tags list
    const normalizedWord = word.toLowerCase();
    if (DATABASE_TAGS.includes(normalizedWord) && !extractedTags.includes(normalizedWord)) {
      extractedTags.push(normalizedWord);
    }
  });

  // Step 5: Additional fallback for single-word prompts against database tags
  if (promptWords.length === 1) {
    const singleWord = promptWords[0].toLowerCase();
    if (DATABASE_TAGS.includes(singleWord) && !extractedTags.includes(singleWord)) {
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

  // Also check for database tag matches
  const promptWords = lowerPrompt.split(/\s+/).map(word => 
    word.replace(/[.,!?;:"'()[\]{}]/g, '')
  ).filter(word => word.length > 0);

  const databaseTagMatches = promptWords.filter(word => 
    DATABASE_TAGS.includes(word.toLowerCase())
  );

  return {
    prompt,
    extractedTags,
    matchedKeywords,
    databaseTagMatches,
    allPossibleTags: ALL_POSSIBLE_TAGS.length
  };
}