/**
 * Сводка KPI над списком релизов.
 */
import {
  countInProgress,
  countShippedInMonth,
  nextRelease,
  rollbackRate,
} from '../services/metrics.js';
import { escapeHtml, formatDate, todayIso } from '../utils/format.js';

const stat = (label, value, hint) => `
  <div class="stat">
    <span class="stat__label">${label}</span>
    <b class="stat__value">${value}</b>
    <div class="muted">${hint}</div>
  </div>`;

export function Stats(releases) {
  const today = todayIso();
  const next = nextRelease(releases, today);

  return [
    stat('Следующий релиз', next ? escapeHtml(next.version) : '—', next ? formatDate(next.date) : 'нет в плане'),
    stat('В работе', countInProgress(releases), 'разработка + тест'),
    stat('Выкачено за месяц', countShippedInMonth(releases, today), 'стадия «В проде»'),
    stat('Доля откатов', `${rollbackRate(releases)}%`, 'от завершённых релизов'),
  ].join('');
}
