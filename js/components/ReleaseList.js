/**
 * Список релизов слева: версия, стадия, прогресс чек-листа.
 */
import { readiness } from '../services/metrics.js';
import { byDateDesc, escapeHtml, formatDate } from '../utils/format.js';
import { StageChip } from './StageChip.js';

function ReleaseItem(release, isSelected) {
  const progress = readiness(release);
  return `
    <button class="release-item" data-action="select" data-id="${release.id}" aria-current="${isSelected}">
      <span class="release-item__version">v${escapeHtml(release.version)}</span>
      ${StageChip(release.stage)}
      <span class="release-item__name">${escapeHtml(release.name)}</span>
      <span class="progress"><i class="progress__fill" style="width:${progress}%"></i></span>
      <span class="release-item__meta">
        <span>📅 ${formatDate(release.date)}</span>
        <span>Чек-лист ${progress}%</span>
        ${release.owner ? `<span>${escapeHtml(release.owner)}</span>` : ''}
        ${release.example ? '<span>пример</span>' : ''}
      </span>
    </button>`;
}

export function ReleaseList(releases, filter, selectedId) {
  const visible = releases.filter((r) => filter === 'all' || r.stage === filter).sort(byDateDesc);

  if (!visible.length) {
    const text = releases.length
      ? 'В этой стадии релизов нет.'
      : 'Релизов пока нет. Нажмите «+ Новый релиз», чтобы добавить первый.';
    return `<div class="empty">${text}</div>`;
  }

  return visible.map((r) => ReleaseItem(r, r.id === selectedId)).join('');
}
