import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on your schema
export interface VibeIdea {
  id: string;
  image_url: string;
  title?: string;
  tags: string[];
  description?: string;
  source_url?: string;
  mask_url?: string;
}

export interface UserPrompt {
  id: string;
  prompt_text: string;
  created_at?: string;
  matched_vibe_id?: string;
}

export interface RefinedImage {
  id: string;
  original_vibe_id?: string;
  user_prompt_id?: string;
  refined_prompt: string;
  refined_image_url: string;
  created_at?: string;
}