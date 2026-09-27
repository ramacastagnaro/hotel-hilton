// Unit tests for the shared formatting helpers introduced by this refactor.
//
// These replace the chimeric CRA `App.test.js` placeholder: rendering the full
// <App /> requires Firebase config, an API base URL and network, so it cannot
// run hermetically in Jest. The formatting layer is pure and is the part the
// admin/operator surfaces actually depend on.
import { formatDate, formatPrice, statusColor } from './format';

describe('formatPrice', () => {
  it('renders an ARS amount with a peso sign', () => {
    const formatted = formatPrice(1000);
    expect(formatted).toContain('1.000');
    expect(formatted).toMatch(/\$/);
  });

  it('coerces numeric strings and falls back to 0 for non-numbers', () => {
    expect(formatPrice('1500')).toContain('1.500');
    expect(formatPrice('no-es-un-numero')).toContain('0');
  });
});

describe('formatDate', () => {
  it('renders dd/MM/yyyy for a local ISO date', () => {
    expect(formatDate('2025-01-15T00:00:00')).toBe('15/01/2025');
  });

  it('returns an empty string for missing or invalid input', () => {
    expect(formatDate('')).toBe('');
    expect(formatDate(undefined)).toBe('');
    expect(formatDate('not-a-date')).toBe('');
  });
});

describe('statusColor', () => {
  it('maps each canonical reservation status', () => {
    expect(statusColor('pendiente')).toBe('bg-yellow-600');
    expect(statusColor('confirmada')).toBe('bg-green-600');
    expect(statusColor('completada')).toBe('bg-blue-600');
    expect(statusColor('cancelada')).toBe('bg-red-600');
  });

  it('falls back for an unknown status such as the retired "reservada"', () => {
    expect(statusColor('reservada')).toBe('bg-gray-600');
    expect(statusColor(undefined)).toBe('bg-gray-600');
  });
});
