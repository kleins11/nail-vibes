/**
 * Backend Tag Extraction Function
 * 
 * Extracts tags from user prompts by first identifying pop culture concepts
 * or aesthetic archetypes, then processing remaining text for modifiers.
 */

// Custom mapping of concepts to primary vibe tags
const customMap: Record<string, string[]> = {
  // ✨ Pop Culture & Aesthetic Cues
  "harry potter": ["witchy", "dark", "mystical"],
  "barbie": ["pink", "glam", "girly", "playful"],
  "bridgerton": ["romantic", "floral", "pastel", "elegant"],
  "euphoria": ["sparkle", "neon", "experimental", "bold"],
  "twilight": ["moody", "vampy", "mysterious", "dark"],
  "coastal grandma": ["neutral", "clean", "soft", "natural"],
  "dark academia": ["matte", "moody", "scholarly", "vintage"],
  "cottagecore": ["floral", "pastel", "nature", "whimsical"],
  "clean girl": ["neutral", "minimal", "glossy", "natural"],
  "hot girl walk": ["bold", "confident", "fun", "vibrant"],
  "old money": ["classic", "neutral", "elegant", "timeless"],
  "mob wife": ["bold", "red", "luxury", "dramatic"],
  "balletcore": ["pink", "sheer", "delicate", "graceful"],
  "mermaidcore": ["pool","pearl","iridescent", "aqua", "shimmer", "oceanic"],
  "quiet luxury": ["minimal", "neutral", "elegant", "sophisticated"],

  // 🌿 Seasonal & Occasion Vibes
  "summer vacation": ["bright", "playful", "tropical", "vibrant"],
  "europe trip": ["chic", "neutral", "effortless", "sophisticated"],
  "napa weekend": ["wine", "earthy", "warm", "rustic"],
  "fall vibes": ["burnt orange", "matte", "cozy", "warm"],
  "holiday party": ["red", "sparkle", "glam", "festive"],
  "wedding guest": ["elegant", "simple", "neutral", "refined"],
  "spider webs": ['matte', 'badass', 'goth', 'detailed'],

  // 🎨 Color-Specific But Vibe-First
  "match my olive dress": ["olive", "earthy", "neutral", "muted"],
  "go with silver jewelry": ["silver", "cool tone", "clean", "metallic"],
  "complement red lipstick": ["bold", "classic", "elegant", "striking"],
  "pair with white linen": ["minimal", "neutral", "clean", "fresh"],
  "accent my tan skin": ["bronze", "warm", "shimmer", "golden"],
  "plain": ['minimal', 'easy', 'gloss', 'skin'],

  // 🎀 Mood-Based Prompts
  "feeling flirty": ["pink", "playful", "glossy", "cute"],
  "want to feel powerful": ["bold", "sharp", "luxury", "confident"],
  "need something low effort": ["neutral", "minimal", "clean", "simple"],
  "trying something edgy": ["black", "matte", "punk", "dramatic"],
  "feeling soft": ["sheer", "pastel", "delicate", "gentle"],
  'test': ['art deco', 'stained glass', 'complex', 'punk'],
  "fuck": ['fire', 'goth', 'anger', 'metal'],

  // 🎭 Additional Pop Culture References
  "disney princess": ["pastel", "glittery", "whimsical", "dreamy"],
  "gothic": ["black", "dark", "dramatic", "mysterious"],
  "boho": ["earthy", "natural", "free-spirited", "textured"],
  "minimalist": ["clean", "simple", "neutral", "understated"],
  "maximalist": ["bold", "colorful", "ornate", "dramatic"],
  "vintage": ["retro", "classic", "muted", "nostalgic"],
  "futuristic": ["metallic", "holographic", "geometric", "sleek"],
};

// Modifier keywords that can enhance or modify the primary concept
const modifierKeywords: Record<string, string[]> = {
  // Style modifiers
  "cutesy": ["cute", "playful", "sweet", "adorable"],
  "edgy": ["bold", "dramatic", "sharp", "striking"],
  "soft": ["gentle", "delicate", "subtle", "muted"],
  "bold": ["vibrant", "striking", "confident", "dramatic"],
  "subtle": ["understated", "minimal", "refined", "gentle"],
  "glamorous": ["sparkly", "luxurious", "shiny", "elegant"],
  "rustic": ["earthy", "natural", "textured", "organic"],
  "sleek": ["smooth", "modern", "clean", "polished"],
  "whimsical": ["playful", "dreamy", "fantastical", "imaginative"],
  "sophisticated": ["elegant", "refined", "classy", "polished"],

  // Color modifiers
  "pastel": ["soft", "muted", "gentle", "light"],
  "neon": ["bright", "vibrant", "electric", "fluorescent"],
  "muted": ["subtle", "understated", "soft", "toned-down"],
  "vibrant": ["bright", "bold", "saturated", "lively"],
  "monochrome": ["single-color", "tonal", "unified", "simple"],
  "rainbow": ["multicolor", "spectrum", "varied", "diverse"],

  // Texture/finish modifiers
  "matte": ["flat", "non-glossy", "velvety", "smooth"],
  "glossy": ["shiny", "reflective", "polished", "lustrous"],
  "metallic": ["shimmery", "reflective", "lustrous", "chrome"],
  "holographic": ["iridescent", "rainbow", "shifting", "prismatic"],
  "glittery": ["sparkly", "shimmery", "twinkling", "dazzling"],
  "textured": ["dimensional", "tactile", "varied", "interesting"],

  // Occasion modifiers
  "formal": ["elegant", "sophisticated", "refined", "classy"],
  "casual": ["relaxed", "everyday", "comfortable", "easy"],
  "festive": ["celebratory", "joyful", "party", "special"],
  "romantic": ["loving", "tender", "intimate", "dreamy"],
  "professional": ["polished", "appropriate", "clean", "refined"],
  "artistic": ["creative", "expressive", "unique", "imaginative"],

  // Basic style keywords
  "bridal": ["elegant", "white", "classic", "romantic"],
  "wedding": ["elegant", "formal", "classic", "refined"],
  "neutral": ["beige", "nude", "natural", "understated"],
  "elegant": ["sophisticated", "refined", "classy", "graceful"],
  "simple": ["minimal", "clean", "understated", "basic"],
  "classic": ["timeless", "traditional", "refined", "elegant"],
  "modern": ["contemporary", "sleek", "current", "fresh"],
  "chic": ["stylish", "fashionable", "sophisticated", "trendy"],
  "fruit": ["colorful", "bright", "playful", "fun"],
  "floral": ["botanical", "nature", "delicate", "feminine"],
  "geometric": ["structured", "modern", "clean", "angular"],
  "abstract": ["artistic", "creative", "unique", "expressive"],
};

// Comprehensive general keywords for fallback tag extraction
const TAG_KEYWORDS: Record<string, string[]> = {
  // Colors - Primary
  "red": ["red", "crimson", "scarlet", "burgundy", "cherry"],
  "pink": ["pink", "rose", "blush", "coral", "magenta"],
  "orange": ["orange", "peach", "tangerine", "coral", "apricot"],
  "yellow": ["yellow", "gold", "golden", "amber", "lemon"],
  "green": ["green", "emerald", "mint", "sage", "olive"],
  "blue": ["blue", "navy", "teal", "turquoise", "azure"],
  "purple": ["purple", "violet", "lavender", "plum", "lilac"],
  "brown": ["brown", "chocolate", "coffee", "mocha", "tan"],
  "black": ["black", "charcoal", "ebony", "onyx", "jet"],
  "white": ["white", "ivory", "cream", "pearl", "snow"],
  "gray": ["gray", "grey", "silver", "slate", "ash"],
  "nude": ["nude", "beige", "taupe", "sand", "champagne"],

  // Finishes & Textures
  "matte": ["matte", "flat", "velvet", "satin"],
  "glossy": ["glossy", "shiny", "gloss", "wet", "lacquer"],
  "metallic": ["metallic", "chrome", "foil", "mirror"],
  "glitter": ["glitter", "sparkle", "shimmer", "glittery"],
  "holographic": ["holographic", "holo", "iridescent", "rainbow"],
  "pearl": ["pearl", "pearlescent", "mother-of-pearl", "nacre"],
  "chrome": ["chrome", "mirror", "reflective", "liquid"],
  "textured": ["textured", "bumpy", "rough", "dimensional"],

  // Styles & Aesthetics
  "minimal": ["minimal", "minimalist", "simple", "clean"],
  "bold": ["bold", "dramatic", "striking", "statement"],
  "elegant": ["elegant", "sophisticated", "classy", "refined"],
  "cute": ["cute", "adorable", "sweet", "kawaii"],
  "edgy": ["edgy", "punk", "grunge", "alternative"],
  "romantic": ["romantic", "dreamy", "soft", "feminine"],
  "vintage": ["vintage", "retro", "classic", "old-school"],
  "modern": ["modern", "contemporary", "current", "trendy"],
  "gothic": ["gothic", "goth", "dark", "mysterious"],
  "boho": ["boho", "bohemian", "hippie", "free-spirit"],
  "chic": ["chic", "stylish", "fashionable", "trendy"],
  "glamorous": ["glamorous", "glam", "luxury", "fancy"],

  // Occasions & Moods
  "bridal": ["bridal", "wedding", "bride", "matrimony"],
  "party": ["party", "celebration", "festive", "fun"],
  "formal": ["formal", "professional", "business", "office"],
  "casual": ["casual", "everyday", "relaxed", "comfortable"],
  "date": ["date", "romantic", "dinner", "evening"],
  "summer": ["summer", "beach", "vacation", "tropical"],
  "winter": ["winter", "holiday", "festive", "cozy"],
  "spring": ["spring", "fresh", "bloom", "renewal"],
  "fall": ["fall", "autumn", "harvest", "warm"],

  // Nail-specific terms
  "nails": ["nails", "manicure", "polish", "lacquer"],
  "french": ["french", "tip", "classic", "traditional"],
  "ombre": ["ombre", "gradient", "fade", "blend"],
  "marble": ["marble", "swirl", "stone", "veined"],
  "floral": ["floral", "flower", "botanical", "bloom"],
  "geometric": ["geometric", "lines", "shapes", "angular"],
  "abstract": ["abstract", "art", "artistic", "creative"],

  // Intensity & Mood
  "bright": ["bright", "vibrant", "neon", "electric"],
  "dark": ["dark", "deep", "moody", "intense"],
  "light": ["light", "pale", "soft", "gentle"],
  "warm": ["warm", "cozy", "rich", "golden"],
  "cool": ["cool", "icy", "fresh", "crisp"],
  "neutral": ["neutral", "natural", "earthy", "balanced"],
  "pastel": ["pastel", "soft", "muted", "gentle"],
  "neon": ["neon", "fluorescent", "electric", "glow"],
};

/**
 * Maps general keywords to tags using the comprehensive TAG_KEYWORDS object
 * @param prompt - The prompt text to analyze
 * @returns Array of extracted tags
 */
function mapGeneralKeywordsToTags(prompt: string): string[] {
  if (!prompt || typeof prompt !== 'string') {
    return [];
  }

  const lowerPrompt = prompt.toLowerCase().trim();
  const extractedTags: string[] = [];

  // Check each tag category for keyword matches
  Object.entries(TAG_KEYWORDS).forEach(([tag, keywords]) => {
    const hasMatch = keywords.some(keyword => 
      lowerPrompt.includes(keyword.toLowerCase())
    ) || lowerPrompt.includes(tag.toLowerCase());
    
    if (hasMatch) {
      extractedTags.push(tag);
    }
  });

  // Remove duplicates and return
  return [...new Set(extractedTags)];
}

/**
 * Maps remaining keywords to modifier tags
 * @param remainingPrompt - The prompt text after concept removal
 * @returns Array of modifier tags
 */
function mapKeywordsToTags(remainingPrompt: string): string[] {
  if (!remainingPrompt || typeof remainingPrompt !== 'string') {
    return [];
  }

  const lowerPrompt = remainingPrompt.toLowerCase().trim();
  const extractedTags: string[] = [];

  // Check each modifier category for keyword matches
  Object.entries(modifierKeywords).forEach(([tag, keywords]) => {
    const hasMatch = keywords.some(keyword => 
      lowerPrompt.includes(keyword.toLowerCase())
    ) || lowerPrompt.includes(tag.toLowerCase());
    
    if (hasMatch) {
      extractedTags.push(tag);
    }
  });

  // Direct word matching for any remaining words
  const promptWords = lowerPrompt.split(/\s+/).map(word => 
    word.replace(/[.,!?;:"'()[\]{}]/g, '')
  ).filter(word => word.length > 0);

  promptWords.forEach(word => {
    // Check if this word is a known modifier
    if (Object.keys(modifierKeywords).includes(word) && !extractedTags.includes(word)) {
      extractedTags.push(word);
    }
  });

  return extractedTags;
}

/**
 * Main function to extract tags from a user prompt
 * @param prompt - The user's natural language prompt
 * @returns Object containing primary tags, modifier tags, matched concept, and combined tags
 */
export function extractTagsFromPrompt(prompt: string): {
  primaryTags: string[];
  modifierTags: string[];
  matchedConcept: string | null;
  combinedTags: string[];
  remainingPrompt: string;
} {
  if (!prompt || typeof prompt !== 'string') {
    return {
      primaryTags: [],
      modifierTags: [],
      matchedConcept: null,
      combinedTags: [],
      remainingPrompt: ''
    };
  }

  const lowerPrompt = prompt.toLowerCase().trim();
  let primaryTags: string[] = [];
  let modifierTags: string[] = [];
  let matchedConcept: string | null = null;
  let remainingPrompt = prompt;

  // Step 1: Check for concept matches
  for (const [concept, tags] of Object.entries(customMap)) {
    if (lowerPrompt.includes(concept.toLowerCase())) {
      primaryTags = [...tags]; // Copy the tags array
      matchedConcept = concept;
      
      // Remove the matched concept from the prompt (case-insensitive)
      const regex = new RegExp(concept.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      remainingPrompt = remainingPrompt.replace(regex, '').trim();
      
      // Clean up extra spaces
      remainingPrompt = remainingPrompt.replace(/\s+/g, ' ').trim();
      
      console.log(`🎯 Concept matched: "${concept}" → Primary tags:`, primaryTags);
      console.log(`📝 Remaining prompt: "${remainingPrompt}"`);
      
      // Extract modifier tags from remaining prompt
      modifierTags = mapKeywordsToTags(remainingPrompt);
      console.log(`🏷️ Modifier tags from "${remainingPrompt}":`, modifierTags);
      
      break; // Only match the first concept found
    }
  }

  // Step 2: If no concept was matched, use general keyword extraction
  if (primaryTags.length === 0) {
    console.log(`📝 No concept matched, checking for general keywords in: "${prompt}"`);
    
    // First try modifier keywords
    modifierTags = mapKeywordsToTags(prompt);
    
    // Then try general keywords
    const generalTags = mapGeneralKeywordsToTags(prompt);
    
    // Combine both sets of tags
    const allExtractedTags = [...new Set([...modifierTags, ...generalTags])];
    
    if (allExtractedTags.length > 0) {
      // Treat all extracted tags as primary tags
      primaryTags = allExtractedTags;
      modifierTags = []; // No separate modifiers when no concept is matched
      console.log(`🏷️ Primary tags from general prompt:`, primaryTags);
    } else {
      console.log(`⚠️ No tags extracted from prompt: "${prompt}"`);
    }
  }

  // Step 3: Combine tags (primary first, then modifiers)
  const combinedTags = [...primaryTags];
  
  // Add modifier tags that aren't already in primary tags
  modifierTags.forEach(tag => {
    if (!combinedTags.includes(tag)) {
      combinedTags.push(tag);
    }
  });

  console.log(`✅ Final result:`, {
    matchedConcept,
    primaryTags,
    modifierTags,
    combinedTags
  });

  return {
    primaryTags,
    modifierTags,
    matchedConcept,
    combinedTags,
    remainingPrompt
  };
}

/**
 * Simplified version that just returns the combined tags array
 * @param prompt - The user's natural language prompt
 * @returns Array of combined tags (primary + modifiers)
 */
export function getTagsFromPrompt(prompt: string): string[] {
  const result = extractTagsFromPrompt(prompt);
  return result.combinedTags;
}

/**
 * Debug function to show detailed extraction results
 * @param prompt - The user prompt to analyze
 * @returns Detailed breakdown of the extraction process
 */
export function debugTagExtraction(prompt: string) {
  console.log(`🔍 Debug: Analyzing prompt: "${prompt}"`);
  
  const result = extractTagsFromPrompt(prompt);
  
  console.log('📊 Debug Results:');
  console.log('  - Matched Concept:', result.matchedConcept);
  console.log('  - Primary Tags:', result.primaryTags);
  console.log('  - Remaining Prompt:', result.remainingPrompt);
  console.log('  - Modifier Tags:', result.modifierTags);
  console.log('  - Combined Tags:', result.combinedTags);
  
  return result;
}

// Example usage and test cases
if (typeof window === 'undefined') {
  // Only run tests in Node.js environment (not in browser)
  console.log('🧪 Running test cases...');
  
  const testCases = [
    "Harry Potter cutesy",
    "barbie glam metallic",
    "dark academia matte",
    "bridgerton romantic pastel",
    "minimalist clean",
    "gothic edgy black",
    "bridal elegant",
    "neutral simple nails",
    "fruit",
    "elegant",
    "romantic",
    "red nails",
    "matte finish",
    "blue glitter",
    "just some random words"
  ];
  
  testCases.forEach(testPrompt => {
    console.log(`\n--- Testing: "${testPrompt}" ---`);
    debugTagExtraction(testPrompt);
  });
}