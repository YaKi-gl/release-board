/**
 * Хранилище состояния приложения (простой паттерн «store + actions»).
 * Компоненты только читают state, а изменяют его через actions.
 * После каждого изменения подписчики получают уведомление и перерисовывают UI.
 */
import { CHECKLIST_TEMPLATE } from './config.js';
import { SEED_RELEASES } from './data/seed.js';
import { loadReleases, saveReleases } from './services/storage.js';
import { byDateDesc, createId, todayIso } from './utils/format.js';

const initialReleases = loadReleases() ?? structuredClone(SEED_RELEASES);

export const state = {
  releases: initialReleases,
  filter: 'all', // 'all' или id стадии
  selectedId: [...initialReleases].sort(byDateDesc)[0]?.id ?? null,
  draft: null, // релиз в режиме редактирования / создания
  confirmDelete: false,
};

const listeners = new Set();

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setState(patch) {
  Object.assign(state, patch);
  listeners.forEach((listener) => listener(state));
}

/** Изменение данных: сохраняем в хранилище и обновляем UI. */
function commitReleases(releases, patch = {}) {
  saveReleases(releases);
  setState({ releases, ...patch });
}

const selected = () => state.releases.find((r) => r.id === state.selectedId);

const updateSelected = (changes) =>
  commitReleases(state.releases.map((r) => (r.id === state.selectedId ? { ...r, ...changes } : r)));

export const actions = {
  setFilter(filter) {
    setState({ filter });
  },

  select(id) {
    setState({ selectedId: id, draft: null, confirmDelete: false });
  },

  startCreate() {
    setState({
      draft: { id: null, version: '', name: '', date: todayIso(), stage: 'planned', owner: '', notes: '' },
      confirmDelete: false,
    });
  },

  startEdit() {
    const release = selected();
    if (release) setState({ draft: { ...release } });
  },

  cancelEdit() {
    setState({ draft: null });
  },

  /** Сохраняет новый или отредактированный релиз. */
  saveDraft(fields) {
    const base = state.draft ?? {};
    const release = {
      ...base,
      ...fields,
      id: base.id ?? createId(),
      checklist: base.checklist ?? CHECKLIST_TEMPLATE.map((title) => ({ title, done: false })),
    };
    delete release.example;

    const exists = state.releases.some((r) => r.id === release.id);
    const releases = exists
      ? state.releases.map((r) => (r.id === release.id ? release : r))
      : [...state.releases, release];

    commitReleases(releases, { draft: null, selectedId: release.id });
  },

  setStage(stage) {
    updateSelected({ stage });
  },

  toggleChecklistItem(index, done) {
    const release = selected();
    if (!release) return;
    const checklist = release.checklist.map((item, i) => (i === index ? { ...item, done } : item));
    updateSelected({ checklist });
  },

  askDelete() {
    setState({ confirmDelete: true });
  },

  cancelDelete() {
    setState({ confirmDelete: false });
  },

  deleteSelected() {
    const releases = state.releases.filter((r) => r.id !== state.selectedId);
    commitReleases(releases, {
      selectedId: [...releases].sort(byDateDesc)[0]?.id ?? null,
      confirmDelete: false,
    });
  },
};
