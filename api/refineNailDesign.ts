import Replicate from 'replicate';

interface RefineRequest {
  baseImageUrl: string;
  refinementPrompt: string;
}

interface RefineResponse {
  imageUrl?: string;
  error?: string;
}

/**
 * Refines a nail design using Replicate's Flux model
 * @param request - POST request with baseImageUrl and refinementPrompt
 * @returns JSON response with refined image URL or error
 */
export default async function refineNailDesign(request: Request): Promise<Response> {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    // Parse request body
    const body: RefineRequest = await request.json();
    
    // Validate required fields
    if (!body.baseImageUrl || !body.refinementPrompt) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: baseImageUrl and refinementPrompt are required' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate that baseImageUrl is a valid URL
    try {
      new URL(body.baseImageUrl);
    } catch {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid baseImageUrl: must be a valid URL' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get Replicate API token from environment
    const replicateToken = process.env.REPLICATE_API_TOKEN;
    if (!replicateToken) {
      console.error('REPLICATE_API_TOKEN environment variable not set');
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error: missing API token' 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Replicate client
    const replicate = new Replicate({
      auth: replicateToken,
    });

    console.log('🎨 Starting nail design refinement...');
    console.log('Base image URL:', body.baseImageUrl);
    console.log('Refinement prompt:', body.refinementPrompt);

    // Call Replicate model
    const output = await replicate.run(
      "black-forest-labs/flux-1.1-pro",
      {
        input: {
          image: body.baseImageUrl,
          prompt: body.refinementPrompt,
          // Add some sensible defaults for nail art refinement
          guidance_scale: 7.5,
          num_inference_steps: 50,
          seed: Math.floor(Math.random() * 1000000)
        }
      }
    );

    // Check if output is valid and contains images
    if (!output || !Array.isArray(output) || output.length === 0) {
      console.error('No output received from Replicate model');
      return new Response(
        JSON.stringify({ 
          error: 'No refined image was generated. Please try a different prompt.' 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const refinedImageUrl = output[0];
    
    console.log('✅ Nail design refinement completed successfully');
    console.log('Refined image URL:', refinedImageUrl);

    // Return success response
    const response: RefineResponse = {
      imageUrl: refinedImageUrl
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in refineNailDesign:', error);
    
    // Handle specific Replicate errors
    if (error instanceof Error) {
      if (error.message.includes('authentication')) {
        return new Response(
          JSON.stringify({ 
            error: 'Authentication failed with Replicate API' 
          }),
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      if (error.message.includes('rate limit')) {
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded. Please try again later.' 
          }),
          { 
            status: 429,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Generic error response
    return new Response(
      JSON.stringify({ 
        error: 'Failed to refine nail design. Please try again.' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}