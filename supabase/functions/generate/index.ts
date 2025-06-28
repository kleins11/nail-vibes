const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface GenerateRequest {
  prompt: string;
}

interface GenerateResponse {
  image?: {
    url: string;
  };
  error?: string;
}

Deno.serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }

  try {
    // Parse request body
    const body: GenerateRequest = await req.json()
    
    // Validate required fields
    if (!body.prompt) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required field: prompt is required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get Replicate API token from environment
    const replicateToken = Deno.env.get('REPLICATE_API_TOKEN')
    if (!replicateToken) {
      console.error('REPLICATE_API_TOKEN environment variable not set')
      
      // Return a more helpful error message for development
      return new Response(
        JSON.stringify({ 
          error: 'Image generation is not configured. Please set up the REPLICATE_API_TOKEN in your Supabase project secrets. Go to your Supabase dashboard > Edge Functions > Secrets and add REPLICATE_API_TOKEN with your API key from replicate.com'
        }),
        { 
          status: 503, // Service Unavailable instead of 500
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('🎨 Starting image generation...')
    console.log('Prompt:', body.prompt)

    // Call Replicate API for image generation
    const replicateResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${replicateToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
        input: {
          prompt: `Beautiful nail art design: ${body.prompt}. High quality, detailed, professional nail photography.`,
          negative_prompt: 'blurry, low quality, distorted, ugly, bad anatomy',
          width: 1024,
          height: 1024,
          num_inference_steps: 50,
          guidance_scale: 7.5,
          seed: Math.floor(Math.random() * 1000000)
        }
      })
    })

    if (!replicateResponse.ok) {
      const errorText = await replicateResponse.text()
      console.error('Replicate API error:', errorText)
      
      // Handle specific Replicate API errors
      if (replicateResponse.status === 401) {
        return new Response(
          JSON.stringify({ 
            error: 'Invalid Replicate API token. Please check your API key configuration.' 
          }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to process image generation request. Please try again later.' 
        }),
        { 
          status: 502, // Bad Gateway for external API errors
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const prediction = await replicateResponse.json()
    console.log('Replicate prediction created:', prediction.id)

    // Poll for completion (Replicate predictions are async)
    let result = prediction
    const maxAttempts = 60 // 5 minutes max wait time
    let attempts = 0

    while (result.status === 'starting' || result.status === 'processing') {
      if (attempts >= maxAttempts) {
        return new Response(
          JSON.stringify({ 
            error: 'Image generation timed out. Please try again with a simpler prompt.' 
          }),
          { 
            status: 408, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Wait 5 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 5000))
      attempts++

      // Check prediction status
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: {
          'Authorization': `Token ${replicateToken}`,
        }
      })

      if (!statusResponse.ok) {
        console.error('Failed to check prediction status')
        return new Response(
          JSON.stringify({ 
            error: 'Failed to check generation status. Please try again.' 
          }),
          { 
            status: 502, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      result = await statusResponse.json()
      console.log(`Prediction status (attempt ${attempts}):`, result.status)
    }

    // Check if the prediction succeeded
    if (result.status === 'succeeded' && result.output && result.output.length > 0) {
      const imageUrl = result.output[0] // Get the first image from output
      
      console.log('✅ Image generation completed successfully')
      console.log('Generated image URL:', imageUrl)

      const response: GenerateResponse = {
        image: {
          url: imageUrl
        }
      }

      return new Response(
        JSON.stringify(response),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } else if (result.status === 'failed') {
      console.error('Replicate prediction failed:', result.error)
      return new Response(
        JSON.stringify({ 
          error: `Image generation failed: ${result.error || 'Unknown error'}. Please try a different prompt.` 
        }),
        { 
          status: 422, // Unprocessable Entity for failed generation
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } else {
      console.error('Unexpected prediction result:', result)
      return new Response(
        JSON.stringify({ 
          error: 'Unexpected error during image generation. Please try again.' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

  } catch (error) {
    console.error('Error in generate function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error. Please try again later.' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})