export interface AvatarIconOption {
  id: string;
  name: string;
  iconType: 'bug' | 'jira' | 'shield' | 'terminal' | 'target' | 'flask';
}

export interface AvatarColorOption {
  id: string;
  name: string;
  bgHex: string;
  accentHex: string;
}

export const AVATAR_ICON_OPTIONS: AvatarIconOption[] = [
  { id: 'bug', name: 'Bug Hunter', iconType: 'bug' },
  { id: 'jira', name: 'Jira Ticket', iconType: 'jira' },
  { id: 'shield', name: 'Shield QA', iconType: 'shield' },
  { id: 'terminal', name: 'Automation', iconType: 'terminal' },
  { id: 'target', name: 'Target QA', iconType: 'target' },
  { id: 'flask', name: 'Test Lab', iconType: 'flask' },
];

export const AVATAR_COLOR_OPTIONS: AvatarColorOption[] = [
  { id: 'teal', name: 'Teal / Emerald', bgHex: '#0f766e', accentHex: '#2dd4bf' },
  { id: 'amber', name: 'Amber / Gold', bgHex: '#78350f', accentHex: '#fbbf24' },
  { id: 'cyan', name: 'Cyan / Sky', bgHex: '#075985', accentHex: '#38bdf8' },
  { id: 'rose', name: 'Rose / Crimson', bgHex: '#881337', accentHex: '#fb7185' },
  { id: 'purple', name: 'Purple / Violet', bgHex: '#581c87', accentHex: '#c084fc' },
  { id: 'slate', name: 'Dark Slate', bgHex: '#1e293b', accentHex: '#94a3b8' },
];

export function generateAvatarSvg(
  iconType: 'bug' | 'jira' | 'shield' | 'terminal' | 'target' | 'flask',
  bgHex: string = '#0f766e',
  accentHex: string = '#2dd4bf'
): string {
  let iconSvgPath = '';

  switch (iconType) {
    case 'bug':
      iconSvgPath = `
        <circle cx="256" cy="180" r="40" fill="${accentHex}" />
        <ellipse cx="256" cy="300" rx="70" ry="100" fill="${accentHex}" />
        <line x1="256" y1="210" x2="256" y2="400" stroke="#0f172a" stroke-width="16" />
        <line x1="180" y1="250" x2="100" y2="210" stroke="${accentHex}" stroke-width="20" stroke-linecap="round" />
        <line x1="332" y1="250" x2="412" y2="210" stroke="${accentHex}" stroke-width="20" stroke-linecap="round" />
        <line x1="180" y1="310" x2="90" y2="310" stroke="${accentHex}" stroke-width="20" stroke-linecap="round" />
        <line x1="332" y1="310" x2="422" y2="310" stroke="${accentHex}" stroke-width="20" stroke-linecap="round" />
        <line x1="180" y1="370" x2="100" y2="410" stroke="${accentHex}" stroke-width="20" stroke-linecap="round" />
        <line x1="332" y1="370" x2="412" y2="410" stroke="${accentHex}" stroke-width="20" stroke-linecap="round" />
      `;
      break;
    case 'jira':
      iconSvgPath = `
        <path d="M140 340 L256 224 L372 340 L256 456 Z" fill="${accentHex}" opacity="0.7" />
        <path d="M140 220 L256 104 L372 220 L256 336 Z" fill="${accentHex}" />
        <path d="M210 270 L256 224 L302 270 L256 316 Z" fill="#0f172a" />
      `;
      break;
    case 'shield':
      iconSvgPath = `
        <path d="M256 90 L380 140 V250 C380 340 320 410 256 430 C192 410 132 340 132 250 V140 L256 90 Z" fill="none" stroke="${accentHex}" stroke-width="28" stroke-linejoin="round" />
        <path d="M200 250 L240 290 L312 210" fill="none" stroke="${accentHex}" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" />
      `;
      break;
    case 'terminal':
      iconSvgPath = `
        <rect x="90" y="120" width="332" height="272" rx="28" fill="none" stroke="${accentHex}" stroke-width="24" />
        <path d="M150 190 L210 240 L150 290" fill="none" stroke="${accentHex}" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" />
        <line x1="240" y1="290" x2="330" y2="290" stroke="${accentHex}" stroke-width="24" stroke-linecap="round" />
      `;
      break;
    case 'target':
      iconSvgPath = `
        <circle cx="256" cy="256" r="140" fill="none" stroke="${accentHex}" stroke-width="24" />
        <circle cx="256" cy="256" r="80" fill="none" stroke="${accentHex}" stroke-width="24" />
        <circle cx="256" cy="256" r="28" fill="${accentHex}" />
        <line x1="256" y1="70" x2="256" y2="110" stroke="${accentHex}" stroke-width="20" stroke-linecap="round" />
        <line x1="256" y1="402" x2="256" y2="442" stroke="${accentHex}" stroke-width="20" stroke-linecap="round" />
        <line x1="70" y1="256" x2="110" y2="256" stroke="${accentHex}" stroke-width="20" stroke-linecap="round" />
        <line x1="402" y1="256" x2="442" y2="256" stroke="${accentHex}" stroke-width="20" stroke-linecap="round" />
      `;
      break;
    case 'flask':
      iconSvgPath = `
        <path d="M216 100 H296 V180 L380 340 C396 370 376 400 340 400 H172 C136 400 116 370 132 340 L216 180 Z" fill="none" stroke="${accentHex}" stroke-width="24" stroke-linejoin="round" />
        <path d="M162 310 Q 256 280 350 310 L336 340 H176 Z" fill="${accentHex}" opacity="0.6" />
        <circle cx="230" cy="240" r="14" fill="${accentHex}" />
        <circle cx="280" cy="210" r="10" fill="${accentHex}" />
      `;
      break;
  }

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%"><rect width="512" height="512" rx="128" fill="${bgHex}" />${iconSvgPath}</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
}

export const PRESET_AVATARS = [
  {
    id: 'av_bug_hunter',
    name: 'Bug Hunter',
    url: generateAvatarSvg('bug', '#0f766e', '#2dd4bf'),
  },
  {
    id: 'av_jira_master',
    name: 'Jira Specialist',
    url: generateAvatarSvg('jira', '#075985', '#38bdf8'),
  },
  {
    id: 'av_shield_qa',
    name: 'Shield QA',
    url: generateAvatarSvg('shield', '#78350f', '#fbbf24'),
  },
  {
    id: 'av_automation',
    name: 'Automation Engineer',
    url: generateAvatarSvg('terminal', '#581c87', '#c084fc'),
  },
  {
    id: 'av_target_qa',
    name: 'Target Tester',
    url: generateAvatarSvg('target', '#881337', '#fb7185'),
  },
  {
    id: 'av_test_lab',
    name: 'Test Lab',
    url: generateAvatarSvg('flask', '#1e293b', '#94a3b8'),
  },
];
