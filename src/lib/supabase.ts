import { createClient } from '@supabase/supabase-js';

// Configuration lue depuis les variables d'environnement (voir .env.example).
// Sans configuration, l'interface reste navigable en mode démo (données locales).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key';

if (!import.meta.env.VITE_SUPABASE_URL) {
  console.warn('[SmartEdu] VITE_SUPABASE_URL non défini : mode démo sans backend.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
