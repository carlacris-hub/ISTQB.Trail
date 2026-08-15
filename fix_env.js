import fs from 'fs';
let content = fs.readFileSync('src/lib/supabase.ts', 'utf8');
content = content.replace(
  "import.meta.env.VITE_SUPABASE_URL",
  "(import.meta as any).env.VITE_SUPABASE_URL"
);
content = content.replace(
  "import.meta.env.VITE_SUPABASE_ANON_KEY",
  "(import.meta as any).env.VITE_SUPABASE_ANON_KEY"
);
fs.writeFileSync('src/lib/supabase.ts', content);
