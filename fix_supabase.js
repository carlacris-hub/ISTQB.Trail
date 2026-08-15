import fs from 'fs';
let content = fs.readFileSync('src/lib/supabase.ts', 'utf8');
content = content.replace(
  "export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');",
  "export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');"
);
fs.writeFileSync('src/lib/supabase.ts', content);
