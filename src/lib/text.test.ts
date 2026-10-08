import { describe, expect, it } from 'vitest';
import { pluralize } from './text';

describe('pluralize', () => {
  const roles = { one: 'rol', other: 'roles' };

  it('usa el singular solo con 1', () => {
    expect(pluralize(1, roles)).toBe('1 rol');
    expect(pluralize(0, roles)).toBe('0 roles');
    expect(pluralize(3, roles)).toBe('3 roles');
  });
});
