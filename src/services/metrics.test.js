import { describe, expect, it } from 'vitest';
import { countInProgress, countShippedInMonth, nextRelease, readiness, rollbackRate } from './metrics.js';

const rel = (overrides) => ({ id: 'x', version: '1.0.0', date: '2026-10-10', stage: 'planned', checklist: [], ...overrides });

describe('readiness', () => {
  it('считает процент выполненных пунктов', () => {
    const r = rel({ checklist: [{ done: true }, { done: true }, { done: false }, { done: false }] });
    expect(readiness(r)).toBe(50);
  });

  it('возвращает 0 для пустого чек-листа', () => {
    expect(readiness(rel({ checklist: [] }))).toBe(0);
  });
});

describe('nextRelease', () => {
  it('выбирает ближайший незавершённый релиз не раньше сегодняшнего дня', () => {
    const releases = [
      rel({ id: 'past', date: '2026-09-01', stage: 'dev' }),
      rel({ id: 'shipped', date: '2026-10-05', stage: 'prod' }),
      rel({ id: 'late', date: '2026-11-01', stage: 'qa' }),
      rel({ id: 'soon', date: '2026-10-06', stage: 'dev' }),
    ];
    expect(nextRelease(releases, '2026-10-04').id).toBe('soon');
  });

  it('возвращает null, если планов нет', () => {
    expect(nextRelease([], '2026-10-04')).toBeNull();
  });
});

describe('rollbackRate', () => {
  it('считает долю откатов среди завершённых релизов', () => {
    const releases = [rel({ stage: 'prod' }), rel({ stage: 'prod' }), rel({ stage: 'rollback' }), rel({ stage: 'qa' })];
    expect(rollbackRate(releases)).toBe(33);
  });

  it('возвращает 0 без завершённых релизов', () => {
    expect(rollbackRate([rel({ stage: 'dev' })])).toBe(0);
  });
});

describe('счётчики', () => {
  const releases = [
    rel({ stage: 'dev' }),
    rel({ stage: 'qa' }),
    rel({ stage: 'prod', date: '2026-10-02' }),
    rel({ stage: 'prod', date: '2026-09-20' }),
  ];

  it('countInProgress — разработка и тестирование', () => {
    expect(countInProgress(releases)).toBe(2);
  });

  it('countShippedInMonth — выкладки в прод за текущий месяц', () => {
    expect(countShippedInMonth(releases, '2026-10-04')).toBe(1);
  });
});
