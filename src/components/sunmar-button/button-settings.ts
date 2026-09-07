export type SunmarButtonType = 'primary' | 'secondary' | 'neutral';
export type SunmarButtonSize = 'small' | 'medium' | 'large';

export const normalizeButtonType = (value: unknown): SunmarButtonType =>
  value === 'secondary' || value === 'neutral' ? value : 'primary';

export const normalizeButtonSize = (value: unknown): SunmarButtonSize =>
  value === 'small' || value === 'large' ? value : 'medium';

// Internal notification; it does not bubble outside the group.
export const BUTTON_GROUP_SETTINGS_CHANGE_EVENT = 'sunmar-button-group-settings-change';
