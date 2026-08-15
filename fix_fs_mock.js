import fs from 'fs';
let content = fs.readFileSync('src/utils/firestoreService.ts', 'utf8');
content = content.replace(
  "total_questions: result.totalQuestions,",
  "total_questions: 40,"
);
fs.writeFileSync('src/utils/firestoreService.ts', content);
