/**
 * Enhanced Title Generator Service
 * 
 * Generates natural, conversational titles for nail designs based on user prompts
 */

/**
 * Enhanced function to generate more natural-sounding titles
 * @param prompt - The user's original prompt
 * @param matchedConcept - The matched concept from tag extraction (if any)
 * @returns A natural, conversational title suitable for display
 */
export function generateTitle(prompt: string, matchedConcept?: string | null): string {
  if (!prompt || typeof prompt !== 'string') {
    return 'Custom nail design';
  }

  const lowerPrompt = prompt.toLowerCase().trim();
  
  // Enhanced natural language patterns for better titles
  const naturalPatterns = {
    // Pop culture and aesthetic concepts with natural phrasing
    concepts: {
      "harry potter": ["Magical witchy", "Enchanted dark", "Mystical Harry Potter-inspired"],
      "barbie": ["Barbie pink glam", "Pretty in pink Barbie", "Glamorous Barbie-inspired"],
      "bridgerton": ["Romantic Bridgerton", "Elegant period drama", "Regency-inspired romantic"],
      "euphoria": ["Bold Euphoria-style", "Sparkly experimental", "Euphoria glam"],
      "twilight": ["Moody vampire", "Dark romantic", "Twilight-inspired mysterious"],
      "coastal grandma": ["Soft coastal", "Natural beachy", "Effortless coastal"],
      "dark academia": ["Scholarly dark", "Moody academic", "Dark academia aesthetic"],
      "cottagecore": ["Whimsical cottage", "Dreamy floral", "Cottagecore romantic"],
      "clean girl": ["Effortless clean", "Natural minimalist", "Clean girl aesthetic"],
      "old money": ["Timeless elegant", "Classic sophisticated", "Old money chic"],
      "mob wife": ["Bold dramatic", "Luxury statement", "Fierce mob wife"],
      "balletcore": ["Delicate ballet", "Soft ballerina", "Ballet-inspired feminine"],
      "mermaidcore": ["Iridescent mermaid", "Ocean-inspired shimmer", "Magical mermaid"],
      "quiet luxury": ["Understated elegant", "Sophisticated minimal", "Quiet luxury chic"]
    },
    
    // Natural descriptive words that flow better
    descriptors: {
      "matte": ["with a matte finish", "in matte", "matte"],
      "glossy": ["with a glossy shine", "high-gloss", "glossy"],
      "metallic": ["with metallic accents", "metallic", "shimmery metallic"],
      "glitter": ["with sparkly glitter", "glittery", "sparkling"],
      "holographic": ["with holographic shine", "iridescent", "rainbow holographic"],
      "chrome": ["chrome mirror", "reflective chrome", "liquid chrome"],
      "neutral": ["in neutral tones", "neutral", "soft neutral"],
      "bold": ["bold statement", "striking", "dramatic"],
      "cute": ["adorably cute", "sweet", "playfully cute"],
      "elegant": ["elegantly styled", "sophisticated", "refined"],
      "edgy": ["edgy and bold", "fierce", "dramatically edgy"],
      "minimal": ["minimalist", "clean and simple", "understated"],
      "romantic": ["romantically soft", "dreamy romantic", "sweetly romantic"],
      "vintage": ["vintage-inspired", "retro chic", "classic vintage"],
      "modern": ["modern chic", "contemporary", "sleek modern"]
    },
    
    // Color combinations that sound natural
    colors: {
      "red": ["classic red", "bold crimson", "rich red"],
      "pink": ["pretty pink", "soft blush", "vibrant pink"],
      "black": ["sleek black", "dramatic black", "classic black"],
      "white": ["crisp white", "pure white", "elegant white"],
      "blue": ["beautiful blue", "ocean blue", "sky blue"],
      "green": ["fresh green", "sage green", "emerald green"],
      "purple": ["royal purple", "lavender purple", "deep purple"],
      "gold": ["luxe gold", "golden", "metallic gold"],
      "silver": ["shimmery silver", "cool silver", "metallic silver"],
      "nude": ["natural nude", "soft nude", "perfect nude"]
    }
  };

  // Step 1: Handle concept-based titles with natural phrasing
  if (matchedConcept && naturalPatterns.concepts[matchedConcept]) {
    const conceptPhrases = naturalPatterns.concepts[matchedConcept];
    const selectedPhrase = conceptPhrases[Math.floor(Math.random() * conceptPhrases.length)];
    
    // Extract additional descriptors from the remaining prompt
    let remainingPrompt = lowerPrompt.replace(matchedConcept.toLowerCase(), '').trim();
    remainingPrompt = cleanPrompt(remainingPrompt);
    
    // Add natural descriptors if found
    const additionalDescriptors = extractNaturalDescriptors(remainingPrompt, naturalPatterns);
    
    if (additionalDescriptors.length > 0) {
      // Combine concept with descriptors naturally
      const descriptor = additionalDescriptors[0]; // Use the first/most relevant descriptor
      return `${selectedPhrase} ${descriptor} nails`;
    } else {
      return `${selectedPhrase} nails`;
    }
  }

  // Step 2: Handle non-concept prompts with natural language flow
  const cleanedPrompt = cleanPrompt(lowerPrompt);
  const descriptors = extractNaturalDescriptors(cleanedPrompt, naturalPatterns);
  
  if (descriptors.length > 0) {
    // Create natural combinations
    if (descriptors.length === 1) {
      return capitalizeFirst(`${descriptors[0]} nails`);
    } else if (descriptors.length === 2) {
      return capitalizeFirst(`${descriptors[0]} ${descriptors[1]} nails`);
    } else {
      // For 3+ descriptors, pick the most important ones
      const primary = descriptors[0];
      const secondary = descriptors[1];
      return capitalizeFirst(`${primary} ${secondary} nails`);
    }
  }

  // Step 3: Fallback to cleaned prompt with natural flow
  if (cleanedPrompt && cleanedPrompt.length > 2) {
    // Make it sound more natural
    let naturalTitle = cleanedPrompt;
    
    // Add "nails" if not present
    if (!naturalTitle.includes('nail')) {
      naturalTitle = `${naturalTitle} nails`;
    }
    
    // Clean up common awkward phrases
    naturalTitle = naturalTitle
      .replace(/\bnails nails\b/g, 'nails')
      .replace(/\bvery\s+/g, '')
      .replace(/\breally\s+/g, '')
      .replace(/\bsuper\s+/g, '')
      .replace(/\bkind of\s+/g, '')
      .replace(/\bsort of\s+/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    return capitalizeFirst(naturalTitle);
  }

  // Final fallback
  return 'Custom nail design';
}

/**
 * Cleans the prompt by removing filler words and phrases
 */
function cleanPrompt(prompt: string): string {
  const fillerWords = [
    'make it', 'make them', 'make the', 'make my', 'make me',
    'i want', 'i need', 'i would like', 'i\'d like',
    'can you', 'could you', 'please', 'thanks',
    'look like', 'looks like', 'looking like',
    'style', 'styled', 'design', 'designed',
    'nail art', 'nail design', 'nail polish',
    'something', 'anything', 'that', 'this',
    'with', 'and', 'but', 'or', 'the', 'a', 'an',
    'very', 'really', 'super', 'so', 'quite',
    'kind of', 'sort of', 'type of', 'like',
    'give me', 'show me', 'do', 'create',
    'for', 'to', 'in', 'on', 'at', 'by'
  ];

  let cleaned = prompt.toLowerCase();
  
  // Remove filler words/phrases
  fillerWords.forEach(filler => {
    const regex = new RegExp(`\\b${filler.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    cleaned = cleaned.replace(regex, ' ');
  });

  // Clean up extra spaces and punctuation
  cleaned = cleaned
    .replace(/[.,!?;:"'()[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned;
}

/**
 * Extracts natural descriptors from the prompt
 */
function extractNaturalDescriptors(prompt: string, patterns: any): string[] {
  const descriptors: string[] = [];
  const words = prompt.split(/\s+/).filter(word => word.length > 0);

  // Check for color matches
  Object.entries(patterns.colors).forEach(([color, phrases]) => {
    if (words.includes(color) || prompt.includes(color)) {
      const colorPhrases = phrases as string[];
      descriptors.push(colorPhrases[Math.floor(Math.random() * colorPhrases.length)]);
    }
  });

  // Check for descriptor matches
  Object.entries(patterns.descriptors).forEach(([descriptor, phrases]) => {
    if (words.includes(descriptor) || prompt.includes(descriptor)) {
      const descriptorPhrases = phrases as string[];
      descriptors.push(descriptorPhrases[Math.floor(Math.random() * descriptorPhrases.length)]);
    }
  });

  // Add any remaining meaningful words that aren't already covered
  const meaningfulWords = words.filter(word => {
    return word.length > 2 && 
           !Object.keys(patterns.colors).includes(word) &&
           !Object.keys(patterns.descriptors).includes(word) &&
           !['nails', 'nail', 'design', 'art', 'polish'].includes(word);
  });

  // Add up to 2 meaningful words
  meaningfulWords.slice(0, 2).forEach(word => {
    if (!descriptors.some(desc => desc.includes(word))) {
      descriptors.push(word);
    }
  });

  return descriptors.slice(0, 3); // Limit to 3 descriptors max
}

/**
 * Capitalizes the first letter of a string
 */
function capitalizeFirst(str: string): string {
  if (!str || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Test cases for the enhanced title generator
 */
export function testEnhancedTitleGenerator() {
  const testCases = [
    { prompt: "make it look like minimalist fruit nails", expected: "minimalist fruit nails" },
    { prompt: "harry potter chic", expected: "Magical witchy chic nails" },
    { prompt: "I want something elegant and sophisticated", expected: "elegantly styled sophisticated nails" },
    { prompt: "barbie pink glam", expected: "Barbie pink glam nails" },
    { prompt: "make them dark academia style", expected: "Scholarly dark nails" },
    { prompt: "can you do bridgerton romantic vibes", expected: "Romantic Bridgerton nails" },
    { prompt: "chrome metallic", expected: "chrome mirror nails" },
    { prompt: "fruit", expected: "fruit nails" },
    { prompt: "elegant", expected: "elegantly styled nails" },
    { prompt: "matte black edgy", expected: "sleek black with a matte finish nails" },
    { prompt: "glossy red bold", expected: "bold crimson with a glossy shine nails" },
    { prompt: "cute pink minimal", expected: "adorably cute pretty pink nails" }
  ];

  console.log('🧪 Testing enhanced title generator...');
  testCases.forEach(({ prompt, expected }) => {
    const result = generateTitle(prompt);
    console.log(`"${prompt}" → "${result}"`);
  });
}

// Run tests in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  // Uncomment to run tests in browser console
  // testEnhancedTitleGenerator();
}