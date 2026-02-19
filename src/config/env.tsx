function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

export const SUPABASE_URL = required("REACT_APP_SUPABASE_URL");
export const SUPABASE_ANON_KEY = required("REACT_APP_SUPABASE_ANON_KEY");
export const SUPABASE_PUBLISHABLE_KEY = required("REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY");