import fs from 'fs';
let content = fs.readFileSync('src/utils/firestoreService.ts', 'utf8');
content = content.replace(
  /export async function saveUserProgressToFirestore[\s\S]*?\}\n/,
  "export async function saveUserProgressToFirestore(uid: string, data: any): Promise<void> {}\n"
);
fs.writeFileSync('src/utils/firestoreService.ts', content);
