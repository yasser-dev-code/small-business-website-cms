export const CURRENCY_CODE = 'MAD';
export const CURRENCY_SYMBOL = 'DH';

export function formatPrice(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return `0 ${CURRENCY_SYMBOL}`;
  const rounded = Number.isInteger(amount) ? amount : amount.toFixed(2);
  return `${rounded} ${CURRENCY_SYMBOL}`;
}
