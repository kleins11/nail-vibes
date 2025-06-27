/**
 * Test Edge Function
 * 
 * Simple test endpoint that returns "hello world"
 * Available at /api/testEdgeFunction
 */
export default async function testEdgeFunction(request: Request): Promise<Response> {
  return new Response(
    "hello world",
    {
      status: 200,
      headers: {
        'Content-Type': 'text/plain'
      }
    }
  );
}