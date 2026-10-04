/**
 * Форма создания и редактирования релиза.
 */
import { STAGES } from '../config.js';
import { escapeHtml } from '../utils/format.js';

const field = (label, control) => `<label><div class="label">${label}</div>${control}</label>`;

export function ReleaseForm(draft) {
  const stageOptions = STAGES.map(
    (s) => `<option value="${s.id}" ${draft.stage === s.id ? 'selected' : ''}>${s.label}</option>`,
  ).join('');

  return `
    <form class="card" id="release-form">
      <h2 class="card__title">${draft.id ? 'Редактировать релиз' : 'Новый релиз'}</h2>
      <div class="form-grid">
        ${field('Версия', `<input type="text" name="version" id="f-version" required placeholder="2.6.0" value="${escapeHtml(draft.version)}">`)}
        ${field('Дата выкладки', `<input type="date" name="date" id="f-date" required value="${escapeHtml(draft.date)}">`)}
        ${field('Ответственный', `<input type="text" name="owner" id="f-owner" value="${escapeHtml(draft.owner)}">`)}
        ${field('Стадия', `<select name="stage" id="f-stage">${stageOptions}</select>`)}
      </div>
      ${field('Название / скоуп', `<input type="text" name="name" id="f-name" required value="${escapeHtml(draft.name)}">`)}
      ${field('Заметки', `<textarea name="notes" id="f-notes">${escapeHtml(draft.notes)}</textarea>`)}
      <div class="row">
        <button class="btn" type="submit">Сохранить</button>
        <button class="btn btn--ghost" type="button" data-action="cancel-edit">Отмена</button>
      </div>
    </form>`;
}

/** Собирает значения формы в объект релиза. */
export function readReleaseForm(form) {
  const data = Object.fromEntries(new FormData(form));
  return {
    version: data.version.trim(),
    date: data.date,
    owner: data.owner.trim(),
    stage: data.stage,
    name: data.name.trim(),
    notes: data.notes,
  };
}
