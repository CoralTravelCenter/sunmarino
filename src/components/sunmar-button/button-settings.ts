export type SunmarButtonType = 'primary' | 'secondary' | 'neutral';
export type SunmarButtonSize = 'small' | 'medium' | 'large';

export const normalizeButtonType = (value: unknown): SunmarButtonType =>
  value === 'secondary' || value === 'neutral' ? value : 'primary';

export const normalizeButtonSize = (value: unknown): SunmarButtonSize =>
  value === 'small' || value === 'large' ? value : 'medium';
