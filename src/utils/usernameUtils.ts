/**
 * Utility functions for username formatting, validation, generation, and uniqueness checks.
 * Usernames must be strictly alphanumeric (letters and numbers only, no spaces, no special characters).
 */

export const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]+$/;

/**
 * Strips all non-alphanumeric characters and converts string to lowercase.
 */
export function sanitizeToAlphanumeric(raw: string): string {
  if (!raw) return '';
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-zA-Z0-9]/g, '')   // keep only letters and numbers
    .toLowerCase();
}

/**
 * Validates a username string.
 */
export function validateUsername(username: string, lang: 'pt' | 'en' = 'pt'): { isValid: boolean; error?: string } {
  const trimmed = username ? username.trim() : '';

  if (!trimmed) {
    return {
      isValid: false,
      error: lang === 'en' ? 'Username cannot be empty.' : 'O nome de usuário não pode ficar em branco.',
    };
  }

  if (trimmed.length < 3) {
    return {
      isValid: false,
      error: lang === 'en' ? 'Username must have at least 3 characters.' : 'O nome de usuário deve ter pelo menos 3 caracteres.',
    };
  }

  if (trimmed.length > 20) {
    return {
      isValid: false,
      error: lang === 'en' ? 'Username must be at most 20 characters.' : 'O nome de usuário pode ter no máximo 20 caracteres.',
    };
  }

  if (!ALPHANUMERIC_REGEX.test(trimmed)) {
    return {
      isValid: false,
      error: lang === 'en' 
        ? 'Only letters and numbers are allowed (no spaces or special characters).' 
        : 'Apenas letras e números são permitidos (sem espaços ou caracteres especiais).',
    };
  }

  return { isValid: true };
}

/**
 * Generates a clean base username from full name or email address.
 */
export function generateBaseUsername(nameOrEmail?: string): string {
  if (!nameOrEmail) return 'candidato' + Math.floor(1000 + Math.random() * 9000);

  let clean = nameOrEmail;
  if (clean.includes('@')) {
    clean = clean.split('@')[0];
  }

  clean = sanitizeToAlphanumeric(clean);

  if (clean.length < 3) {
    clean = 'qa' + clean + Math.floor(100 + Math.random() * 900);
  }

  return clean.slice(0, 16);
}

/**
 * Generates a guaranteed unique username given a list of existing usernames.
 */
export function generateUniqueUsername(
  nameOrEmail?: string,
  existingUsernames: string[] = []
): string {
  const base = generateBaseUsername(nameOrEmail);
  const normalizedList = existingUsernames.map(u => u.toLowerCase());

  if (!normalizedList.includes(base.toLowerCase())) {
    return base;
  }

  // Try appending numbers until a unique one is found
  let counter = 1;
  let candidate = `${base}${counter}`;
  while (normalizedList.includes(candidate.toLowerCase())) {
    counter++;
    const randomSuffix = Math.floor(10 + Math.random() * 90);
    candidate = `${base.slice(0, 14)}${randomSuffix}`;
  }

  return candidate;
}
