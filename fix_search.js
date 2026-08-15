import fs from 'fs';
let content = fs.readFileSync('src/components/UserSearchModal.tsx', 'utf8');
content = content.replace(
  "searchFirestoreUsers(clean, currentUser.id).then",
  "searchFirestoreUsers(clean).then"
);
fs.writeFileSync('src/components/UserSearchModal.tsx', content);
