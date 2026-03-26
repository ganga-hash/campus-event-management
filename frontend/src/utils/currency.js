export const formatRupees = (value) => {
  if (value === null || value === undefined) return value;

  const raw = String(value).trim();
  if (!raw || raw.toUpperCase() === 'N/A') return raw;

  if (raw.includes('₹')) return raw;

  if (raw.includes('$')) {
    return raw.replace(/\$/g, '₹');
  }

  const hasDigit = /\d/.test(raw);
  if (!hasDigit) return raw;

  const numeric = Number(raw.replace(/,/g, ''));
  if (!Number.isNaN(numeric)) {
    return `₹${numeric.toLocaleString('en-IN')}`;
  }

  return `₹${raw}`;
};
