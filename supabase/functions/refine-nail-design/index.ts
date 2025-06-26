import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface RefineRequest {
  baseImageUrl: string;
  refinementPrompt: string;
}

interface RefineResponse {
  imageUrl?: string;
  error?: string;
}

serve(async (req: Request): Promise<Response> => {
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
    const body: RefineRequest = await req.json()
    
    // Validate required fields
    if (!body.baseImageUrl || !body.refinementPrompt) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: baseImageUrl and refinementPrompt are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate that baseImageUrl is a valid URL
    try {
      new URL(body.baseImageUrl)
    } catch {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid baseImageUrl: must be a valid URL' 
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
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error: missing API token' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('🎨 Starting nail design refinement...')
    console.log('Base image URL:', body.baseImageUrl)
    console.log('Refinement prompt:', body.refinementPrompt)

    // Call Replicate API
    const replicateResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${replicateToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'black-forest-labs/flux-1.1-pro',
        input: {
          image: body.baseImageUrl,
          prompt: body.refinementPrompt,
          // Add some sensible defaults for nail art refinement
          guidance_scale: 7.5,
          num_inference_steps: 50,
          seed: Math.floor(Math.random() * 1000000)
        }
      })
    })

    if (!replicateResponse.ok) {
      const errorText = await replicateResponse.text()
      console.error('Replicate API error:', errorText)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to process image refinement request' 
        }),
        { 
          status: 500, 
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
            error: 'Image refinement timed out. Please try again.' 
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
        break
      }

      result = await statusResponse.json()
      console.log(`Prediction status (attempt ${attempts}):`, result.status)
    }

    // Check if the prediction succeeded
    if (result.status === 'succeeded' && result.output && result.output.length > 0) {
      const refinedImageUrl = result.output[0] // Get the first image from output
      
      console.log('✅ Nail design refinement completed successfully')
      console.log('Refined image URL:', refinedImageUrl)

      return new Response(
        JSON.stringify({ 
          imageUrl: refinedImageUrl 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } else if (result.status === 'failed') {
      console.error('Replicate prediction failed:', result.error)
      return new Response(
        JSON.stringify({ 
          error: 'Image refinement failed. Please try a different prompt or image.' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } else {
      console.error('Unexpected prediction result:', result)
      return new Response(
        JSON.stringify({ 
          error: 'Unexpected error during image refinement' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

  } catch (error) {
    console.error('Error in refine-nail-design function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})