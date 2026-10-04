/**
 * Карточка выбранного релиза: стадия, чек-лист готовности, заметки, действия.
 */
import { STAGES } from '../config.js';
import { readiness } from '../services/metrics.js';
import { escapeHtml, formatDate } from '../utils/format.js';
import { StageChip } from './StageChip.js';

const StageSwitch = (current) => `
  <div class="stage-switch">
    ${STAGES.map(
      (s) => `
      <button
        class="stage-switch__btn ${s.id === 'rollback' ? 'stage-switch__btn--rollback' : ''} ${s.id === current ? 'is-active' : ''}"
        data-action="set-stage" data-value="${s.id}">${s.label}</button>`,
    ).join('')}
  </div>`;

const Checklist = (items) => `
  <div class="checklist">
    ${items
      .map(
        (item, i) => `
      <label class="checklist__item">
        <input type="checkbox" data-action="toggle-check" data-index="${i}" ${item.done ? 'checked' : ''}>
        <span class="${item.done ? 'is-done' : ''}">${escapeHtml(item.title)}</span>
      </label>`,
      )
      .join('')}
  </div>`;

const Actions = (release, confirmDelete) =>
  confirmDelete
    ? `<div class="confirm">
         Удалить релиз v${escapeHtml(release.version)}?
         <button class="btn btn--danger" data-action="delete-confirm">Удалить</button>
         <button class="btn btn--ghost" data-action="delete-cancel">Отмена</button>
       </div>`
    : `<div class="row">
         <button class="btn btn--ghost" data-action="edit">Редактировать</button>
         <button class="btn btn--danger" data-action="delete">Удалить</button>
       </div>`;

export function ReleaseCard(release, confirmDelete) {
  if (!release) {
    return `<div class="card"><p class="muted">Выберите релиз слева, чтобы увидеть стадию, чек-лист готовности и заметки.</p></div>`;
  }

  return `
    <article class="card">
      <div class="row row--between">
        <span class="card__meta">v${escapeHtml(release.version)} · ${formatDate(release.date)}</span>
        ${StageChip(release.stage)}
      </div>
      <h2 class="card__title">${escapeHtml(release.name)}</h2>

      <section>
        <div class="label">Стадия</div>
        ${StageSwitch(release.stage)}
      </section>

      <section>
        <div class="label">Чек-лист готовности · ${readiness(release)}%</div>
        ${Checklist(release.checklist ?? [])}
      </section>

      <section>
        <div class="label">Заметки</div>
        <p class="notes">${escapeHtml(release.notes) || '<span class="muted">Нет заметок</span>'}</p>
      </section>

      ${Actions(release, confirmDelete)}
    </article>`;
}
