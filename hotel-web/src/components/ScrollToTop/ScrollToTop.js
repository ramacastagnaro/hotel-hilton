import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// React Router keeps the scroll position between navigations; this resets it
// to the top on every pathname change. Rendered once inside the Router.
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
