import { BadgeCheck, CircleAlert, Info, Lightbulb, OctagonAlert, TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';

import type { ContentAlertType } from './contentAlertTypes';

type ContentAlertProps = {
  readonly type: ContentAlertType;
  readonly children: ReactNode;
};

const alertLabels: Record<ContentAlertType, string> = {
  note: 'Note',
  tip: 'Tip',
  important: 'Important',
  warning: 'Warning',
  caution: 'Caution',
  solution: 'Solution',
};

const alertIcons = {
  note: Info,
  tip: Lightbulb,
  important: OctagonAlert,
  warning: TriangleAlert,
  caution: CircleAlert,
  solution: BadgeCheck,
} as const;

export function ContentAlert({ type, children }: ContentAlertProps) {
  const Icon = alertIcons[type];

  return (
    <aside className={`mdx-alert mdx-alert--${type}`} aria-label={alertLabels[type]}>
      <div className="mdx-alert__title">
        <Icon aria-hidden="true" />
        <span>{alertLabels[type]}</span>
      </div>
      <div className="mdx-alert__body">{children}</div>
    </aside>
  );
}
