import { describe, expect, it } from 'vitest';
import { formatMonth, periodParts, sortByRecency } from './dates';

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

describe('periodParts', () => {
  it('marca como vigente un periodo sin término', () => {
    expect(periodParts('2023-03', null)).toEqual({ from: 'mar 2023', to: null, current: true });
  });

  it('separa inicio y término de un periodo cerrado', () => {
    expect(periodParts('2021-01', '2022-06')).toEqual({
      from: 'ene 2021',
      to: 'jun 2022',
      current: false,
    });
  });

  it('muestra un solo mes si empieza y termina el mismo mes', () => {
    expect(periodParts('2023-08', '2023-08')).toEqual({
      from: 'ago 2023',
      to: null,
      current: false,
    });
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
