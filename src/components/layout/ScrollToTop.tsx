import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

import { getPathWithoutLocale } from '../../routing/locale';
import { scrollToTop } from './scrollToTop';

export function ScrollToTop() {
  const { pathname } = useLocation();
  const routePath = getPathWithoutLocale(pathname);
  const previousRoutePathRef = useRef(routePath);

  useEffect(() => {
    const previousRoutePath = previousRoutePathRef.current;
    previousRoutePathRef.current = routePath;

    if (routePath === '/' || previousRoutePath === '/') {
      scrollToTop();
    }
  }, [routePath]);

  return null;
}
