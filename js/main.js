/**
 * Точка входа: рендер компонентов и связывание событий интерфейса с actions.
 */
import { ReleaseCard } from './components/ReleaseCard.js';
import { ReleaseForm, readReleaseForm } from './components/ReleaseForm.js';
import { ReleaseList } from './components/ReleaseList.js';
import { Pipeline } from './components/Pipeline.js';
import { Stats } from './components/Stats.js';
import { isStorageAvailable } from './services/storage.js';
import { actions, state, subscribe } from './store.js';

const dom = {
  stats: document.getElementById('stats'),
  pipeline: document.getElementById('pipeline'),
  list: document.getElementById('release-list'),
  detail: document.getElementById('release-detail'),
  storageBadge: document.getElementById('storage-badge'),
};

function render({ releases, filter, selectedId, draft, confirmDelete }) {
  dom.stats.innerHTML = Stats(releases);
  dom.pipeline.innerHTML = Pipeline(releases, filter);
  dom.list.innerHTML = ReleaseList(releases, filter, selectedId);
  dom.detail.innerHTML = draft
    ? ReleaseForm(draft)
    : ReleaseCard(releases.find((r) => r.id === selectedId), confirmDelete);
}

/** Обработчики кликов по data-action. */
const clickHandlers = {
  filter: (el) => actions.setFilter(el.dataset.value),
  select: (el) => actions.select(el.dataset.id),
  'set-stage': (el) => actions.setStage(el.dataset.value),
  create: () => actions.startCreate(),
  edit: () => actions.startEdit(),
  'cancel-edit': () => actions.cancelEdit(),
  delete: () => actions.askDelete(),
  'delete-cancel': () => actions.cancelDelete(),
  'delete-confirm': () => actions.deleteSelected(),
};

document.addEventListener('click', (event) => {
  const el = event.target.closest('button[data-action]');
  clickHandlers[el?.dataset.action]?.(el);
});

document.addEventListener('change', (event) => {
  const el = event.target;
  if (el.dataset.action === 'toggle-check') {
    actions.toggleChecklistItem(Number(el.dataset.index), el.checked);
  }
});

document.addEventListener('submit', (event) => {
  if (event.target.id !== 'release-form') return;
  event.preventDefault();
  actions.saveDraft(readReleaseForm(event.target));
});

dom.storageBadge.textContent = isStorageAvailable()
  ? 'данные хранятся в этом браузере'
  : 'хранилище недоступно · изменения не сохранятся';

subscribe(render);
render(state);
