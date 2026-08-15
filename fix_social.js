import fs from 'fs';
let content = fs.readFileSync('src/utils/socialStorage.ts', 'utf8');
content = content.replace(
  "updateUserFollowersInFirestore(targetUserId, newTargetFollowersCount);",
  "updateUserFollowersInFirestore(targetUserId, newTargetFollowersCount, []);"
);
fs.writeFileSync('src/utils/socialStorage.ts', content);
