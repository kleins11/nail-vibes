/**
 * Title Generator Service
 * 
 * Generates paraphrased titles for nail designs based on user prompts
 */

/**
 * Generates a paraphrased title from a user prompt
 * @param prompt - The user's original prompt
 * @param matchedConcept - The matched concept from tag extraction (if any)
 * @returns A paraphrased title suitable for display
 */
export function generateTitle(prompt: string, matchedConcept?: string | null): string {
  if (!prompt || typeof prompt !== 'string') {
    return 'Custom nail design';
  }

  const lowerPrompt = prompt.toLowerCase().trim();
  
  // Remove common filler words and phrases
  const fillerWords = [
    'make it', 'make them', 'make the', 'make my',
    'i want', 'i need', 'i would like',
    'can you', 'could you', 'please',
    'look like', 'looks like', 'looking like',
    'style', 'styled', 'design', 'designed',
    'nail art', 'nail design', 'nail polish',
    'something', 'anything', 'that',
    'with', 'and', 'but', 'or',
    'very', 'really', 'super', 'so',
    'kind of', 'sort of', 'type of'
  ];

  // Clean the prompt by removing filler words
  let cleanedPrompt = lowerPrompt;
  fillerWords.forEach(filler => {
    const regex = new RegExp(`\\b${filler.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    cleanedPrompt = cleanedPrompt.replace(regex, ' ');
  });

  // Clean up extra spaces
  cleanedPrompt = cleanedPrompt.replace(/\s+/g, ' ').trim();

  // If we have a matched concept, prioritize it
  if (matchedConcept) {
    // Check if the concept is already in the cleaned prompt
    if (!cleanedPrompt.includes(matchedConcept.toLowerCase())) {
      // Add the concept to the beginning
      cleanedPrompt = `${matchedConcept} ${cleanedPrompt}`.trim();
    }
  }

  // Ensure it ends with "nails" if it doesn't already
  if (!cleanedPrompt.includes('nail')) {
    cleanedPrompt = `${cleanedPrompt} nails`.trim();
  }

  // Capitalize first letter and return
  const title = cleanedPrompt.charAt(0).toUpperCase() + cleanedPrompt.slice(1);
  
  // Handle edge cases
  if (title.length < 3 || title === 'Nails') {
    return 'Custom nail design';
  }

  return title;
}

/**
 * Test cases for the title generator
 */
export function testTitleGenerator() {
  const testCases = [
    { prompt: "make it look like minimalist fruit nails", expected: "minimalist fruit nails" },
    { prompt: "harry potter chic", expected: "harry potter chic nails" },
    { prompt: "I want something elegant and sophisticated", expected: "elegant and sophisticated nails" },
    { prompt: "barbie pink glam", expected: "barbie pink glam nails" },
    { prompt: "make them dark academia style", expected: "dark academia nails" },
    { prompt: "can you do bridgerton romantic vibes", expected: "bridgerton romantic vibes nails" },
    { prompt: "chrome metallic", expected: "chrome metallic nails" },
    { prompt: "fruit", expected: "fruit nails" },
    { prompt: "elegant", expected: "elegant nails" }
  ];

  console.log('🧪 Testing title generator...');
  testCases.forEach(({ prompt, expected }) => {
    const result = generateTitle(prompt);
    const passed = result.toLowerCase().includes(expected.toLowerCase().replace(' nails', ''));
    console.log(`${passed ? '✅' : '❌'} "${prompt}" → "${result}" (expected: "${expected}")`);
  });
}

// Run tests in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  // Uncomment to run tests in browser console
  // testTitleGenerator();
}