import { buttonStyles } from './buttonStyles';

describe('buttonStyles', () => {
  it('returns a class string with the shared base contract', () => {
    const cls = buttonStyles();
    expect(typeof cls).toBe('string');
    expect(cls).toContain('inline-flex');
    expect(cls).toContain('items-center');
    expect(cls).toContain('font-sans');
    expect(cls).toContain('rounded-btn');
    expect(cls).toContain('transition-all');
  });

  it('always exposes focus-visible and disabled affordances (BTN-2)', () => {
    const cls = buttonStyles();
    expect(cls).toContain('focus-visible:ring-2');
    expect(cls).toContain('focus-visible:ring-gold-400');
    expect(cls).toContain('disabled:opacity-50');
    expect(cls).toContain('disabled:cursor-not-allowed');
  });

  it('defaults to the primary variant and md size', () => {
    const cls = buttonStyles();
    expect(cls).toContain('bg-navy-800');
    expect(cls).toContain('px-5');
    expect(cls).toContain('py-2.5');
  });

  it('maps every variant to its brand token classes (BTN-1)', () => {
    expect(buttonStyles({ variant: 'primary' })).toContain('bg-navy-800');
    expect(buttonStyles({ variant: 'accent' })).toContain('bg-gold-500');
    expect(buttonStyles({ variant: 'secondary' })).toContain('border-navy-200');
    expect(buttonStyles({ variant: 'ghost' })).toContain('bg-transparent');
    expect(buttonStyles({ variant: 'confirm' })).toContain('bg-success');
    expect(buttonStyles({ variant: 'destructive' })).toContain('bg-danger');
    expect(buttonStyles({ variant: 'icon' })).toContain('rounded-full');
  });

  it('maps every size', () => {
    expect(buttonStyles({ size: 'sm' })).toContain('px-3');
    expect(buttonStyles({ size: 'md' })).toContain('px-5');
    expect(buttonStyles({ size: 'lg' })).toContain('px-7');
    expect(buttonStyles({ size: 'lg' })).toContain('text-base');
  });

  it('appends a custom className for layout overrides', () => {
    expect(buttonStyles({ className: 'w-full' })).toContain('w-full');
  });

  it('falls back to primary/md for unknown variant or size', () => {
    expect(buttonStyles({ variant: 'nope' })).toContain('bg-navy-800');
    expect(buttonStyles({ size: 'xl' })).toContain('px-5');
  });
});
