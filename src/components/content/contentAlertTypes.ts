export const contentAlertTypes = ['note', 'tip', 'important', 'warning', 'caution', 'solution'] as const;

export type ContentAlertType = (typeof contentAlertTypes)[number];
