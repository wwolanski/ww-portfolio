import { PROJECT_TAG_DEFINITIONS, type ProjectTag } from '../../content/projectTags';
import { PROJECT_BADGE_CONFIG } from './ProjectBadgeConfig';

type ProjectBadgeProps = {
  readonly tag: ProjectTag;
};

export function ProjectBadge({ tag }: ProjectBadgeProps) {
  const { badgeType } = PROJECT_BADGE_CONFIG;
  const definition = PROJECT_TAG_DEFINITIONS[tag];

  return (
    <span className={`project-badge project-badge--${badgeType}`} data-project-tag={tag}>
      {badgeType === 'dot' && <span className="project-badge__dot" aria-hidden="true" />}
      {definition.label}
    </span>
  );
}
