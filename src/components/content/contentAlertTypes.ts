export const contentAlertTypes = ['note', 'tip', 'important', 'warning', 'caution'] as const;

export type ContentAlertType = (typeof contentAlertTypes)[number];
