import { describe, expect, it } from 'vitest';
import { formatMonth, formatPeriod } from './dates';

describe('formatMonth', () => {
  it('formatea AAAA-MM como mes abreviado y año', () => {
    expect(formatMonth('2023-03')).toBe('mar 2023');
    expect(formatMonth('2024-12')).toBe('dic 2024');
  });

  it('rechaza formatos y meses inválidos', () => {
    expect(() => formatMonth('2023-3')).toThrow('Fecha inválida');
    expect(() => formatMonth('2023-13')).toThrow('Fecha inválida');
    expect(() => formatMonth('marzo')).toThrow('Fecha inválida');
  });
});

describe('formatPeriod', () => {
  it('muestra "actual" cuando no hay fecha de término', () => {
    expect(formatPeriod('2023-03', null)).toBe('mar 2023 — actual');
  });

  it('muestra ambas fechas cuando el periodo terminó', () => {
    expect(formatPeriod('2021-01', '2022-06')).toBe('ene 2021 — jun 2022');
  });
});
