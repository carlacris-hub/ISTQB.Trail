import fs from 'fs';
let content = fs.readFileSync('src/utils/firestoreService.ts', 'utf8');
content = content.replace(
  "mockExamsUsedThisMonth: 0,\n    badges: []",
  "mockExamsUsedThisMonth: 0"
);
fs.writeFileSync('src/utils/firestoreService.ts', content);
