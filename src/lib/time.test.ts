import { describe, expect, it } from 'vitest';
import { formatTime } from './time';

describe('formatTime', () => {
  it('convierte a la zona indicada en formato 24 h', () => {
    const date = new Date('2026-01-15T15:30:00Z');
    expect(formatTime(date, 'America/Santiago')).toBe('12:30');
    expect(formatTime(date, 'Asia/Tokyo')).toBe('00:30');
  });

  it('respeta el horario de invierno', () => {
    expect(formatTime(new Date('2026-07-15T15:30:00Z'), 'America/Santiago')).toBe('11:30');
  });
});
