export type ProjectBadgeType = 'pill' | 'solid' | 'dot' | 'basic';

// Change one value here to switch the visual treatment for every project tag.
export const PROJECT_BADGE_CONFIG: { readonly badgeType: ProjectBadgeType } = {
  badgeType: 'dot',
};
