import { Icon } from '@iconify/react';

import { getTechTagDefinition, type TechTagIcon } from '../../content/techTags';

import './TechTag.css';

export type TechTagVariant = 'badge' | 'icon';

type TechTagProps = {
  readonly name: string;
  readonly variant?: TechTagVariant;
};

const fallbackIcon: TechTagIcon = { kind: 'iconify', name: 'lucide:code-2' };

export function TechTag({ name, variant = 'badge' }: TechTagProps) {
  const definition = getTechTagDefinition(name);
  const tagIcon = definition?.icon ?? fallbackIcon;

  return (
    <span
      className={`tech-tag tech-tag--${variant}`}
      data-tech-tag={name}
      title={variant === 'icon' ? name : undefined}
      role={variant === 'icon' ? 'img' : undefined}
      aria-label={variant === 'icon' ? name : undefined}
    >
      <span className="tech-tag__icon" aria-hidden="true">
        <TechTagIcon icon={tagIcon} />
      </span>
      {variant === 'badge' && <span className="tech-tag__label">{name}</span>}
    </span>
  );
}

function TechTagIcon({ icon }: { readonly icon: TechTagIcon }) {
  if (icon.kind === 'image') {
    return <img src={icon.src} alt="" decoding="async" />;
  }

  return <Icon icon={icon.name} width="1em" height="1em" aria-hidden="true" />;
}
