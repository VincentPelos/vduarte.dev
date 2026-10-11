import { describe, expect, it } from 'vitest';
import { formatDate, formatMonth, groupByYear, periodParts, sortByRecency, yearOf } from './dates';

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

  it('muestra años conocidos y notas para fechas pendientes', () => {
    expect(formatDate('2023')).toBe('2023');
    expect(formatDate('2026-07-23')).toBe('23 jul 2026');
    expect(periodParts(null, null, { dateNote: 'Fechas por confirmar', ongoing: false })).toEqual({
      from: 'Fechas por confirmar',
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

  it('deja al final un periodo completado sin fechas', () => {
    const jobs = [
      { id: 'practica', start: null, end: null, ongoing: false },
      { id: 'actual', start: null, end: null, ongoing: true },
    ];
    expect(sortByRecency(jobs).map((job) => job.id)).toEqual(['actual', 'practica']);
  });
});

describe('yearOf', () => {
  it('usa el año del inicio', () => {
    expect(yearOf({ start: '2026-03' })).toBe('2026');
    expect(yearOf({ start: '2026-07-23' })).toBe('2026');
  });

  it('sin inicio, toma el año que nombra la nota', () => {
    expect(yearOf({ start: null, dateNote: 'Aprox. 2025 · meses por confirmar' })).toBe('2025');
    expect(yearOf({ start: null })).toBe('');
  });
});

describe('groupByYear', () => {
  it('agrupa del año más reciente al más antiguo y conserva el orden dentro de cada año', () => {
    const items = [
      { id: 'b', start: '2026-08' },
      { id: 'viejo', start: '2023' },
      { id: 'a', start: '2026-07' },
      { id: 'nota', start: null, dateNote: 'Aprox. 2025' },
    ];
    expect(groupByYear(items).map(([year, list]) => [year, list.map((i) => i.id)])).toEqual([
      ['2026', ['b', 'a']],
      ['2025', ['nota']],
      ['2023', ['viejo']],
    ]);
  });
});
