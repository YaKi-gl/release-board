/**
 * Хук-фасад над редьюсером: отдаёт компонентам состояние и готовые действия,
 * а также сохраняет релизы в хранилище при каждом изменении.
 */
import { useEffect, useMemo, useReducer } from 'react';
import { SEED_RELEASES } from '../data/seed.js';
import { loadReleases, saveReleases } from '../services/storage.js';
import { ActionTypes as T, createInitialState, releasesReducer } from '../store/releasesReducer.js';

const init = () => createInitialState(loadReleases() ?? structuredClone(SEED_RELEASES));

export function useReleaseBoard() {
  const [state, dispatch] = useReducer(releasesReducer, undefined, init);

  useEffect(() => {
    saveReleases(state.releases);
  }, [state.releases]);

  const actions = useMemo(
    () => ({
      setFilter: (filter) => dispatch({ type: T.SET_FILTER, filter }),
      select: (id) => dispatch({ type: T.SELECT, id }),
      startCreate: () => dispatch({ type: T.START_CREATE }),
      startEdit: () => dispatch({ type: T.START_EDIT }),
      cancelEdit: () => dispatch({ type: T.CANCEL_EDIT }),
      saveDraft: (fields) => dispatch({ type: T.SAVE_DRAFT, fields }),
      setStage: (stage) => dispatch({ type: T.SET_STAGE, stage }),
      toggleCheck: (index, done) => dispatch({ type: T.TOGGLE_CHECK, index, done }),
      askDelete: () => dispatch({ type: T.ASK_DELETE }),
      cancelDelete: () => dispatch({ type: T.CANCEL_DELETE }),
      deleteSelected: () => dispatch({ type: T.DELETE_SELECTED }),
    }),
    [],
  );

  const selected = state.releases.find((r) => r.id === state.selectedId) ?? null;

  return { state, selected, actions };
}
