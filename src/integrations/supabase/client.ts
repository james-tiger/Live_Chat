// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://godtfmgxorgrtmbzwzeu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvZHRmbWd4b3JncnRtYnp3emV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyODQ3NjgsImV4cCI6MjA2Njg2MDc2OH0.2OfL_XiM4bbm_DCsjOmSstXSKCr2Mo2SWsDsfuVmZOQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});