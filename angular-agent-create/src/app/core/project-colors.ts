import { ProjectColor } from './project-api.types';

/**
 * Project accent palette. The folder swatch tint and the picker circle are both
 * derived from each `hex` (via color-mix), so a colour is one source value here.
 */
export const PROJECT_COLORS: ProjectColor[] = [
  { id: 'slate', label: 'Slate', hex: '#6B7A90' },
  { id: 'blue', label: 'Blue', hex: '#4F7FE0' },
  { id: 'green', label: 'Green', hex: '#3FA56B' },
  { id: 'amber', label: 'Amber', hex: '#E0A23A' },
  { id: 'red', label: 'Red', hex: '#DB6B66' },
  { id: 'steel', label: 'Steel', hex: '#5E7186' },
  { id: 'teal', label: 'Teal', hex: '#2FA89A' },
  { id: 'purple', label: 'Purple', hex: '#8A6FE0' },
  { id: 'pink', label: 'Pink', hex: '#DD79AE' },
  { id: 'indigo', label: 'Indigo', hex: '#5B61E0' },
  { id: 'lime', label: 'Lime', hex: '#7FB23E' },
  { id: 'cyan', label: 'Cyan', hex: '#3AA6C7' },
];

export const DEFAULT_PROJECT_COLOR_ID = PROJECT_COLORS[0].id;

const COLOR_BY_ID = new Map(PROJECT_COLORS.map((color) => [color.id, color]));

export function projectColor(colorId: string): ProjectColor {
  return COLOR_BY_ID.get(colorId) ?? PROJECT_COLORS[0];
}
