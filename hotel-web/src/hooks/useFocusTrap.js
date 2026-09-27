import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

// Accessibility helper for modal dialogs: moves focus into the dialog on mount,
// keeps Tab/Shift+Tab cycling inside it, closes on Escape, and restores focus to
// the previously focused element on unmount.
//
// Usage: attach the returned ref to the dialog container.
export function useFocusTrap(onClose) {
  const containerRef = useRef(null);
  const onCloseRef = useRef(onClose);

  // Keep the latest callback without re-running the trap effect on every render
  // (an inline onClose would otherwise re-focus the dialog on each parent render).
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const previouslyFocused = document.activeElement;

    const getFocusable = () => Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));

    const focusables = getFocusable();
    if (focusables.length > 0) {
      focusables[0].focus();
    } else {
      container.setAttribute('tabindex', '-1');
      container.focus();
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const items = getFocusable();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, []);

  return containerRef;
}
