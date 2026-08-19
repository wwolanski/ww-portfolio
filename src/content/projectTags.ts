export const PROJECT_TAG_DEFINITIONS = {
  shipped: { label: 'shipped' },
  'in-development': { label: 'in development' },
  discontinued: { label: 'Discontinued' },
  'prototype-paused': { label: 'prototype / paused' },
  'public-beta': { label: 'public beta' },
} as const;

export type ProjectTag = keyof typeof PROJECT_TAG_DEFINITIONS;

export function isProjectTag(value: string): value is ProjectTag {
  return Object.hasOwn(PROJECT_TAG_DEFINITIONS, value);
}
