import { ArrowUpRight } from 'lucide-react';
import type { ComponentProps } from 'react';

import './ContentLink.css';

export function ContentLink({ children, target, rel, ...props }: ComponentProps<'a'>) {
  const safeRel = target === '_blank' ? rel ?? 'noreferrer' : rel;

  return (
    <a {...props} target={target} rel={safeRel}>
      {children}
      <ArrowUpRight className="content-link__icon" aria-hidden="true" />
    </a>
  );
}
