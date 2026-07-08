export function nowISO() {
  return new Date().toISOString();
}

export function formatDate(value) {
  if (!value) return 'Never';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export function isToday(value) {
  if (!value) return false;
  const d = new Date(value);
  const today = new Date();
  return d.toDateString() === today.toDateString();
}
