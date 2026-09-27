// Single source of truth for button styling across the app.
// Variants map to the Navy+Gold design tokens (see tailwind.config.js).
const variants = {
  primary: 'bg-navy-800 hover:bg-navy-900 text-white',
  accent: 'bg-gold-500 hover:bg-gold-600 text-navy-950',
  secondary: 'bg-white border border-navy-200 text-navy-800 hover:bg-surface-100',
  ghost: 'bg-transparent text-navy-700 hover:bg-surface-100',
  confirm: 'bg-success text-white hover:opacity-90',
  destructive: 'bg-danger text-white hover:opacity-90',
  icon: 'p-2 rounded-full hover:bg-surface-100',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
};

const base =
  'inline-flex items-center justify-center gap-2 font-sans font-semibold rounded-btn transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 disabled:opacity-50 disabled:cursor-not-allowed';

export function buttonStyles({ variant = 'primary', size = 'md', className = '' } = {}) {
  return [
    base,
    sizes[size] || sizes.md,
    variants[variant] || variants.primary,
    className,
  ]
    .join(' ')
    .trim();
}

export const buttonVariants = Object.keys(variants);
export const buttonSizes = Object.keys(sizes);
