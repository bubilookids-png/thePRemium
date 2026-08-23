export function normalizeTerm(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

// A conservative validator to reduce prompt injection surface and garbage.
export function isLikelyValidTerm(term: string): boolean {
  if (term.length < 1 || term.length > 40) return false;
  const tokens = term.split(' ').filter(Boolean);
  if (tokens.length > 3) return false;
  return /^[a-zA-Z][a-zA-Z'\- ]*$/.test(term);
}
