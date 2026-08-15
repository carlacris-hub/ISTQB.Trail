import fs from 'fs';
let content = fs.readFileSync('src/utils/firestoreService.ts', 'utf8');
content = content.replace(
  "timeSpentSeconds: d.time_spent_seconds",
  "timeSpentSeconds: d.time_spent_seconds,\n        percentage: Math.round((d.score / (d.total_questions || 40)) * 100),\n        answers: []"
);
fs.writeFileSync('src/utils/firestoreService.ts', content);
