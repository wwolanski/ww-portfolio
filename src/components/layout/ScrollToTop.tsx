import { useEffect } from 'react';
import { useLocation } from 'react-router';

import { getPathWithoutLocale } from '../../routing/locale';
import { scrollToTop } from './scrollToTop';

export function ScrollToTop() {
  const { pathname } = useLocation();
  const routePath = getPathWithoutLocale(pathname);

  useEffect(() => {
    if (routePath !== '/') {
      return;
    }

    scrollToTop();
  }, [routePath]);

  return null;
}
