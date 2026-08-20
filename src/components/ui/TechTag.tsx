import { Icon } from '@iconify/react';

import { getTechTagIcon, type TechTagIcon } from '../../content/techTags';

import './TechTag.css';

export type TechTagVariant = 'badge' | 'icon';

type TechTagProps = {
  readonly name: string;
  readonly variant?: TechTagVariant;
};

export function TechTag({ name, variant = 'badge' }: TechTagProps) {
  const tagIcon = getTechTagIcon(name);

  return (
    <span
      className={`tech-tag tech-tag--${variant}`}
      data-tech-tag={name}
      title={variant === 'icon' ? name : undefined}
      role={variant === 'icon' ? 'img' : undefined}
      aria-label={variant === 'icon' ? name : undefined}
    >
      <span className="tech-tag__icon" aria-hidden="true">
        <TechTagIconView icon={tagIcon} />
      </span>
      {variant === 'badge' && <span className="tech-tag__label">{name}</span>}
    </span>
  );
}

function TechTagIconView({ icon }: { readonly icon: TechTagIcon }) {
  if (icon.kind === 'image') {
    return <img src={icon.src} alt="" decoding="async" />;
  }

  if (icon.color === undefined) {
    return <Icon icon={icon.name} width="1em" height="1em" aria-hidden="true" />;
  }

  return <Icon icon={icon.name} color={icon.color} width="1em" height="1em" aria-hidden="true" />;
}
