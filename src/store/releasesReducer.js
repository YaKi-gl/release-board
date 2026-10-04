/**
 * Редьюсер состояния приложения. Чистая функция: (state, action) → новый state.
 * Вся логика изменения данных собрана здесь, поэтому её легко тестировать.
 */
import { CHECKLIST_TEMPLATE } from '../config/stages.js';
import { byDateDesc, createId, todayIso } from '../utils/format.js';

export const ActionTypes = {
  SET_FILTER: 'SET_FILTER',
  SELECT: 'SELECT',
  START_CREATE: 'START_CREATE',
  START_EDIT: 'START_EDIT',
  CANCEL_EDIT: 'CANCEL_EDIT',
  SAVE_DRAFT: 'SAVE_DRAFT',
  SET_STAGE: 'SET_STAGE',
  TOGGLE_CHECK: 'TOGGLE_CHECK',
  ASK_DELETE: 'ASK_DELETE',
  CANCEL_DELETE: 'CANCEL_DELETE',
  DELETE_SELECTED: 'DELETE_SELECTED',
};

const latestId = (releases) => [...releases].sort(byDateDesc)[0]?.id ?? null;

export function createInitialState(releases) {
  return {
    releases,
    filter: 'all',
    selectedId: latestId(releases),
    draft: null,
    confirmDelete: false,
  };
}

const emptyDraft = () => ({ id: null, version: '', name: '', date: todayIso(), stage: 'planned', owner: '', notes: '' });

function updateSelected(state, changes) {
  return {
    ...state,
    releases: state.releases.map((r) => (r.id === state.selectedId ? { ...r, ...changes } : r)),
  };
}

export function releasesReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_FILTER:
      return { ...state, filter: action.filter };

    case ActionTypes.SELECT:
      return { ...state, selectedId: action.id, draft: null, confirmDelete: false };

    case ActionTypes.START_CREATE:
      return { ...state, draft: emptyDraft(), confirmDelete: false };

    case ActionTypes.START_EDIT: {
      const release = state.releases.find((r) => r.id === state.selectedId);
      return release ? { ...state, draft: { ...release } } : state;
    }

    case ActionTypes.CANCEL_EDIT:
      return { ...state, draft: null };

    case ActionTypes.SAVE_DRAFT: {
      const base = state.draft ?? {};
      const release = {
        ...base,
        ...action.fields,
        id: base.id ?? createId(),
        checklist: base.checklist ?? CHECKLIST_TEMPLATE.map((title) => ({ title, done: false })),
      };
      delete release.example;
      const exists = state.releases.some((r) => r.id === release.id);
      return {
        ...state,
        releases: exists ? state.releases.map((r) => (r.id === release.id ? release : r)) : [...state.releases, release],
        draft: null,
        selectedId: release.id,
      };
    }

    case ActionTypes.SET_STAGE:
      return updateSelected(state, { stage: action.stage });

    case ActionTypes.TOGGLE_CHECK: {
      const release = state.releases.find((r) => r.id === state.selectedId);
      if (!release) return state;
      const checklist = release.checklist.map((item, i) => (i === action.index ? { ...item, done: action.done } : item));
      return updateSelected(state, { checklist });
    }

    case ActionTypes.ASK_DELETE:
      return { ...state, confirmDelete: true };

    case ActionTypes.CANCEL_DELETE:
      return { ...state, confirmDelete: false };

    case ActionTypes.DELETE_SELECTED: {
      const releases = state.releases.filter((r) => r.id !== state.selectedId);
      return { ...state, releases, selectedId: latestId(releases), confirmDelete: false };
    }

    default:
      return state;
  }
}
