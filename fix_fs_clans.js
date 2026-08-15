import fs from 'fs';
let content = fs.readFileSync('src/utils/firestoreService.ts', 'utf8');
content = content.replace(
  /export async function fetchAllClansFromFirestore\(\): Promise<Clan\[\]> \{\n[\s\S]*?\}\n/,
  `export async function fetchAllClansFromFirestore(): Promise<Clan[]> {
  const { data, error } = await supabase.from('clans').select('*');
  if (error || !data) return [];
  return data.map(c => ({
    id: c.id,
    name: c.name,
    tag: c.tag || '',
    description: c.description,
    avatarUrl: c.avatar_url,
    leaderId: c.leader_id,
    leaderName: c.leader_name || 'Leader',
    members: [], 
    totalXp: c.total_xp,
    level: c.level || 1,
    joinType: c.join_type || 'open'
  }));
}\n`
);

content = content.replace(
  /export async function createClanInFirestore\(clan: Clan\): Promise<boolean> \{\n[\s\S]*?\}\n/,
  `export async function createClanInFirestore(clan: Clan): Promise<boolean> {
  const { error } = await supabase.from('clans').insert({
    id: clan.id,
    name: clan.name,
    tag: clan.tag,
    description: clan.description,
    avatar_url: clan.avatarUrl,
    leader_id: clan.leaderId,
    leader_name: clan.leaderName,
    total_xp: clan.totalXp || 0,
    level: clan.level || 1,
    join_type: clan.joinType || 'open'
  });
  return !error;
}\n`
);

content = content.replace(
  /export async function updateClanInFirestore\(clanId: string, updates: Partial<Clan>\): Promise<void> \{\n[\s\S]*?\}\n/,
  `export async function updateClanInFirestore(clanId: string, updates: Partial<Clan>): Promise<void> {
  const dbUpdates: any = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.tag !== undefined) dbUpdates.tag = updates.tag;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl;
  if (updates.totalXp !== undefined) dbUpdates.total_xp = updates.totalXp;
  if (updates.level !== undefined) dbUpdates.level = updates.level;
  if (updates.joinType !== undefined) dbUpdates.join_type = updates.joinType;
  
  await supabase.from('clans').update(dbUpdates).eq('id', clanId);
}\n`
);

fs.writeFileSync('src/utils/firestoreService.ts', content);
