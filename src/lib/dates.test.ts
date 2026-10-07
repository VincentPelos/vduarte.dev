import { describe, expect, it } from 'vitest';
import { formatMonth, formatPeriod, sortByRecency } from './dates';

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

describe('sortByRecency', () => {
  const items = [
    { id: 'antiguo', start: '2019-06', end: '2020-12' },
    { id: 'actual', start: '2023-03', end: null },
    { id: 'medio', start: '2021-01', end: '2023-02' },
    { id: 'medio-corto', start: '2022-05', end: '2023-02' },
  ];

  it('pone lo vigente primero y luego ordena por término e inicio', () => {
    expect(sortByRecency(items).map((i) => i.id)).toEqual([
      'actual',
      'medio-corto',
      'medio',
      'antiguo',
    ]);
  });

  it('no modifica el arreglo original', () => {
    const copy = [...items];
    sortByRecency(items);
    expect(items).toEqual(copy);
  });
});
