// Shared formatting helpers used by the admin and operator surfaces.

/**
 * Format a numeric amount as Argentine pesos.
 * @param {number|string} price
 * @returns {string}
 */
export function formatPrice(price) {
  const value = Number(price);
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

/**
 * Format an ISO date string as `dd/MM/yyyy`.
 * @param {string} dateString
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Map a reservation status to its Tailwind background class.
 * @param {string} status
 * @returns {string}
 */
export function statusColor(status) {
  switch (status) {
    case 'confirmada':
      return 'bg-green-600';
    case 'pendiente':
      return 'bg-yellow-600';
    case 'cancelada':
      return 'bg-red-600';
    case 'completada':
      return 'bg-blue-600';
    default:
      return 'bg-gray-600';
  }
}

export default { formatPrice, formatDate, statusColor };
