import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(url && key);

// A missing environment must not take the public pages (or the 404) offline.
// All data/auth requests are gated by isSupabaseConfigured in the application.
export const supabase = createClient(url || "https://preview.invalid", key || "preview-only", {
  auth: {
    persistSession: false,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
