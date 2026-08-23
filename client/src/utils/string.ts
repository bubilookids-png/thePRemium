export function normalizeTerm(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
}

export function isLikelyValidTerm(term: string): boolean {
  // Allow letters, spaces, apostrophes, hyphens. Keep it friendly but safe.
  // 1-40 chars, 1-3 tokens.
  if (term.length < 1 || term.length > 40) return false;

  const tokens = term.split(' ').filter(Boolean);
  if (tokens.length > 3) return false;

  return /^[a-zA-Z][a-zA-Z'\- ]*$/.test(term);
}

export function slugId(prefix: string, index: number): string {
  return `${prefix}-${index}-${Math.random().toString(16).slice(2)}`;
}
