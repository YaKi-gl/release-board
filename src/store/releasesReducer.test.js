import { describe, expect, it } from 'vitest';
import { ActionTypes as T, createInitialState, releasesReducer } from './releasesReducer.js';

const releases = [
  { id: 'a', version: '1.0.0', name: 'A', date: '2026-10-01', stage: 'dev', checklist: [{ title: 'x', done: false }] },
  { id: 'b', version: '1.1.0', name: 'B', date: '2026-10-10', stage: 'planned', checklist: [] },
];

describe('releasesReducer', () => {
  it('по умолчанию выбирает самый поздний релиз', () => {
    expect(createInitialState(releases).selectedId).toBe('b');
  });

  it('создаёт новый релиз с чек-листом и выбирает его', () => {
    let state = createInitialState(releases);
    state = releasesReducer(state, { type: T.START_CREATE });
    state = releasesReducer(state, { type: T.SAVE_DRAFT, fields: { version: '2.0.0', name: 'New', date: '2026-12-01', stage: 'planned' } });
    const created = state.releases.find((r) => r.version === '2.0.0');
    expect(state.releases).toHaveLength(3);
    expect(created.checklist.length).toBeGreaterThan(0);
    expect(state.selectedId).toBe(created.id);
    expect(state.draft).toBeNull();
  });

  it('меняет стадию и отмечает пункт чек-листа у выбранного релиза', () => {
    let state = { ...createInitialState(releases), selectedId: 'a' };
    state = releasesReducer(state, { type: T.SET_STAGE, stage: 'qa' });
    state = releasesReducer(state, { type: T.TOGGLE_CHECK, index: 0, done: true });
    const a = state.releases.find((r) => r.id === 'a');
    expect(a.stage).toBe('qa');
    expect(a.checklist[0].done).toBe(true);
  });

  it('удаляет выбранный релиз и выбирает следующий', () => {
    let state = createInitialState(releases);
    state = releasesReducer(state, { type: T.DELETE_SELECTED });
    expect(state.releases.map((r) => r.id)).toEqual(['a']);
    expect(state.selectedId).toBe('a');
  });

  it('не меняет состояние на неизвестное действие', () => {
    const state = createInitialState(releases);
    expect(releasesReducer(state, { type: 'UNKNOWN' })).toBe(state);
  });
});
