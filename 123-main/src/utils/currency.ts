// Utility for formatting currency values in multiple currencies

export function formatCurrency(value: number, currency: string = 'ZAR', locale: string = 'en-ZA'): string {
  if (isNaN(value)) return '';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (e) {
    // Fallback for unsupported currency codes
    return `${currency} ${value.toFixed(2)}`;
  }
}

// Example usage:
// formatCurrency(1234.56, 'USD') => $1,234.56
// formatCurrency(1234.56, 'EUR', 'de-DE') => 1.234,56 €
// formatCurrency(1234.56, 'ZAR') => R 1 234,56
