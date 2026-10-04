/**
 * Бизнес-логика: метрики релизного процесса. Чистые функции без DOM.
 */
import { ACTIVE_STAGES, FINAL_STAGES } from '../config.js';

/** Процент выполненных пунктов чек-листа (0–100). */
export function readiness(release) {
  const items = release.checklist ?? [];
  if (!items.length) return 0;
  return Math.round((items.filter((i) => i.done).length / items.length) * 100);
}

/** Ближайший запланированный, ещё не завершённый релиз. */
export function nextRelease(releases, today) {
  return releases
    .filter((r) => r.date >= today && !FINAL_STAGES.includes(r.stage))
    .sort((a, b) => a.date.localeCompare(b.date))[0] ?? null;
}

export function countInProgress(releases) {
  return releases.filter((r) => ACTIVE_STAGES.includes(r.stage)).length;
}

/** Сколько релизов выкачено в прод в месяце указанной даты. */
export function countShippedInMonth(releases, today) {
  const month = today.slice(0, 7);
  return releases.filter((r) => r.stage === 'prod' && r.date?.startsWith(month)).length;
}

/** Доля откатов среди завершённых релизов, %. */
export function rollbackRate(releases) {
  const finished = releases.filter((r) => FINAL_STAGES.includes(r.stage));
  if (!finished.length) return 0;
  const rolledBack = finished.filter((r) => r.stage === 'rollback').length;
  return Math.round((rolledBack / finished.length) * 100);
}

export function countByStage(releases, stage) {
  return releases.filter((r) => r.stage === stage).length;
}
