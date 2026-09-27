// Stable confirmation code shared by the success view and the PDF ticket.
//
// Deterministic on purpose: the code shown on screen MUST equal the one printed
// on the ticket. A random suffix (the previous behaviour) produced two
// different codes for the same reservation on every render.

/**
 * Derive a short, stable confirmation code from a reservation.
 * @param {{ reservation_id?: number|string }} [reservation]
 * @returns {string} e.g. `D0540F3A`
 */
export function generateConfirmationCode(reservation) {
  const id = reservation?.reservation_id;
  if (id === undefined || id === null || id === '') return 'D000000';

  const numeric = Number(id);
  const padded = String(id).padStart(3, '0');

  const suffix = Number.isFinite(numeric)
    ? ((numeric * 7919) % 1679616)
        .toString(36)
        .toUpperCase()
        .padStart(4, '0')
        .slice(-4)
    : String(id).slice(-4).toUpperCase().padStart(4, '0');

  return `D${padded}${suffix}`;
}
