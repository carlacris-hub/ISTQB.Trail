import fs from 'fs';
let content = fs.readFileSync('src/utils/firestoreService.ts', 'utf8');
content = content.replace(
  "return users.map(u => ({",
  "return users.map(u => ({\n      weeklyXp: u.xp_total || 0,\n      rank: 0,\n      league: 'Bronze',\n      badgeCount: 0,"
);
fs.writeFileSync('src/utils/firestoreService.ts', content);
