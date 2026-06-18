import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://sjkdmekybmzilukwgpoz.supabase.co'; 
const supabaseAnonKey = 'sb_publishable_i3s9tXMXSj_XKjhHGIBQYQ_2H6RGhn9';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);