/**
 * Formats a number as a USD currency string (e.g., $1234.56).
 *
 * @param {number|string} amount The amount to format as USD.
 * @returns {string} The formatted USD currency string.
 */
export const formatUSD = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}; 