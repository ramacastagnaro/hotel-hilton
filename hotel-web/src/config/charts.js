// Chart labels and color constants for the admin statistics page.
// Keeping them here avoids hardcoded arrays inside the chart components.

// Payment methods an operator can register when confirming a payment.
export const PAYMENT_METHOD_LABELS = [
  'Efectivo',
  'Tarjeta de Crédito',
  'Tarjeta de Débito',
  'Transferencia',
];

// Shared rgba palette used by the Chart.js datasets.
export const CHART_COLORS = {
  blue: 'rgba(59, 130, 246, 0.8)',
  blueBorder: 'rgba(59, 130, 246, 1)',
  green: 'rgba(34, 197, 94, 0.8)',
  greenBorder: 'rgba(34, 197, 94, 1)',
  purple: 'rgba(168, 85, 247, 0.8)',
  purpleBorder: 'rgba(168, 85, 247, 1)',
  yellow: 'rgba(251, 191, 36, 0.8)',
  yellowBorder: 'rgba(251, 191, 36, 1)',
  red: 'rgba(239, 68, 68, 0.8)',
  redBorder: 'rgba(239, 68, 68, 1)',
};

// Canonical reservation statuses shown across the admin/operator surfaces.
export const RESERVATION_STATUSES = ['pendiente', 'confirmada', 'completada', 'cancelada'];

export default {
  PAYMENT_METHOD_LABELS,
  CHART_COLORS,
  RESERVATION_STATUSES,
};
