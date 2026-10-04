/**
 * Фильтр по стадиям релиза с количеством релизов в каждой.
 */
import { STAGES } from '../config.js';
import { countByStage } from '../services/metrics.js';

const item = (value, label, count, active) => `
  <button class="pipeline__item" data-action="filter" data-value="${value}" aria-pressed="${active}">
    ${label}<small class="pipeline__count">${count}</small>
  </button>`;

export function Pipeline(releases, filter) {
  return [
    item('all', 'Все', releases.length, filter === 'all'),
    ...STAGES.map((s) => item(s.id, s.label, countByStage(releases, s.id), filter === s.id)),
  ].join('');
}
