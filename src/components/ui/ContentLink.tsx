import { ArrowUpRight } from 'lucide-react';
import type { ComponentProps } from 'react';

import { withBasePath } from '../../routing/basePath';

export function ContentLink({ children, target, rel, href, ...props }: ComponentProps<'a'>) {
  const safeRel = target === '_blank' ? rel ?? 'noreferrer' : rel;

  return (
    <a {...props} href={withBasePath(href, import.meta.env.BASE_URL)} target={target} rel={safeRel}>
      {children}
      <ArrowUpRight className="content-link__icon" aria-hidden="true" />
    </a>
  );
}
