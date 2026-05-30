/**
 * Format an ISO date string to a relative "hace X" string.
 */
export function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `Hace ${diffMins} minutos`;
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
  return `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;
}

/**
 * Format ISO date to YYYY-MM-DD
 */
export function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toISOString().slice(0, 10);
}
