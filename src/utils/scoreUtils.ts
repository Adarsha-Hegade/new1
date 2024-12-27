export function getScoreColor(score: number): string {
  if (score >= 96) return 'text-green-600';
  if (score >= 86) return 'text-green-500';
  if (score >= 76) return 'text-lime-500';
  if (score >= 66) return 'text-yellow-500';
  if (score >= 51) return 'text-orange-500';
  if (score >= 26) return 'text-red-500';
  return 'text-red-700';
}

export function formatScore(score: number | null): string {
  if (score === null) return 'Pending';
  return `${score}/100`;
}