export function formatCurrency(value: number, locale = 'tr-TR', currency = 'TRY') {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
  } catch {
    return `${value.toFixed(2)} ₺`;
  }
}
