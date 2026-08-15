import fs from 'fs';
let content = fs.readFileSync('src/utils/firestoreService.ts', 'utf8');
content = content.replace(
  "function fromDbUser(dbUser: any, dbAdvances: any): UserProfile {\n  return {",
  "function fromDbUser(dbUser: any, dbAdvances: any): UserProfile {\n  return {"
);
content = content.replace(
  /mockExamsUsedThisMonth: 0\n\s*\};/,
  "mockExamsUsedThisMonth: 0\n  } as UserProfile;"
);
fs.writeFileSync('src/utils/firestoreService.ts', content);
