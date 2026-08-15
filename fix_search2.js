import fs from 'fs';
let content = fs.readFileSync('src/components/UserSearchModal.tsx', 'utf8');
content = content.replace(
  /searchFirestoreUsers\(clean,\s*currentUser\.id\)/,
  "searchFirestoreUsers(clean)"
);
fs.writeFileSync('src/components/UserSearchModal.tsx', content);
