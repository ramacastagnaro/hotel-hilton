import { generateConfirmationCode } from './ticketCode';

describe('generateConfirmationCode', () => {
  it('is deterministic for the same reservation', () => {
    const reservation = { reservation_id: 54 };
    expect(generateConfirmationCode(reservation)).toBe(
      generateConfirmationCode(reservation)
    );
  });

  it('embeds the zero-padded reservation id', () => {
    expect(generateConfirmationCode({ reservation_id: 7 })).toMatch(/^D007/);
    expect(generateConfirmationCode({ reservation_id: 1234 })).toMatch(/^D1234/);
  });

  it('produces a different code for a different reservation', () => {
    expect(generateConfirmationCode({ reservation_id: 1 })).not.toBe(
      generateConfirmationCode({ reservation_id: 2 })
    );
  });

  it('falls back to a placeholder when there is no id', () => {
    expect(generateConfirmationCode()).toBe('D000000');
    expect(generateConfirmationCode(null)).toBe('D000000');
    expect(generateConfirmationCode({})).toBe('D000000');
  });
});
