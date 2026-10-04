import { motion } from 'framer-motion';
import { STAGES } from '../../config/stages.js';
import { fadeUp, panelMotion, staggerContainer } from '../motion/presets.js';
import '../ReleaseCard/ReleaseCard.css';
import './ReleaseForm.css';


function Field({ label, children }) {
  return (
    <motion.label className="form-field" variants={fadeUp}>
      <span className="label">{label}</span>
      {children}
    </motion.label>
  );
}

/** Форма создания и редактирования релиза. Неуправляемые поля + FormData. */
export function ReleaseForm({ draft, onSave, onCancel }) {
  function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    onSave({
      version: data.version.trim(),
      date: data.date,
      owner: data.owner.trim(),
      stage: data.stage,
      name: data.name.trim(),
      notes: data.notes,
    });
  }

  return (
    <motion.form className="card" onSubmit={handleSubmit} {...panelMotion}>
      <h2 className="card__title">{draft.id ? 'Редактировать релиз' : 'Новый релиз'}</h2>
      <motion.div className="release-form" variants={staggerContainer(0.05, 0.1)} initial="hidden" animate="show">
        <div className="release-form__grid">
          <Field label="Версия">
            <input type="text" name="version" id="f-version" required placeholder="2.6.0" defaultValue={draft.version} autoFocus />
          </Field>
          <Field label="Дата выкладки">
            <input type="date" name="date" id="f-date" required defaultValue={draft.date} />
          </Field>
          <Field label="Ответственный">
            <input type="text" name="owner" id="f-owner" defaultValue={draft.owner} />
          </Field>
          <Field label="Стадия">
            <select name="stage" id="f-stage" defaultValue={draft.stage}>
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Название / скоуп">
          <input type="text" name="name" id="f-name" required defaultValue={draft.name} />
        </Field>
        <Field label="Заметки">
          <textarea name="notes" id="f-notes" defaultValue={draft.notes} />
        </Field>
      </motion.div>
      <div className="row">
        <motion.button className="btn" type="submit" whileTap={{ scale: 0.96 }}>
          Сохранить
        </motion.button>
        <button className="btn btn--ghost" type="button" onClick={onCancel}>
          Отмена
        </button>
      </div>
    </motion.form>
  );
}
