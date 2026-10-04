import { AnimatePresence, motion } from 'framer-motion';
import { readiness } from '../../services/metrics.js';
import { formatDate } from '../../utils/format.js';
import { panelMotion } from '../motion/presets.js';
import { Confetti } from '../ui/Confetti.jsx';
import { StageChip } from '../ui/StageChip.jsx';
import { Checklist } from './Checklist.jsx';
import { StageSwitch } from './StageSwitch.jsx';
import './ReleaseCard.css';

/** Карточка выбранного релиза: стадия, чек-лист, заметки и действия. */
export function ReleaseCard({ release, confirmDelete, actions }) {
  if (!release) {
    return (
      <motion.div className="card" {...panelMotion}>
        <p className="muted">Выберите релиз слева, чтобы увидеть стадию, чек-лист готовности и заметки.</p>
      </motion.div>
    );
  }

  const progress = readiness(release);
  const isReady = progress === 100;

  return (
    <motion.article className="card" {...panelMotion}>
      <div className="row row--between">
        <span className="card__meta">
          v{release.version} · {formatDate(release.date)}
        </span>
        <StageChip stage={release.stage} />
      </div>
      <h2 className="card__title">{release.name}</h2>

      <section>
        <div className="label">Стадия</div>
        <StageSwitch current={release.stage} onChange={actions.setStage} />
      </section>

      <section className="card__checklist">
        <div className="label">
          Чек-лист готовности · {progress}%
          <AnimatePresence>
            {isReady && (
              <motion.span
                className="card__ready"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              >
                готов к релизу
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {isReady && <Confetti key={`${release.id}-ready`} />}
        <Checklist items={release.checklist ?? []} onToggle={actions.toggleCheck} />
      </section>

      <section>
        <div className="label">Заметки</div>
        <p className="card__notes">{release.notes || <span className="muted">Нет заметок</span>}</p>
      </section>

      <AnimatePresence mode="wait" initial={false}>
        {confirmDelete ? (
          <motion.div
            key="confirm"
            className="card__confirm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto', x: [0, -6, 6, -3, 0] }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            Удалить релиз v{release.version}?
            <button className="btn btn--danger" onClick={actions.deleteSelected}>
              Удалить
            </button>
            <button className="btn btn--ghost" onClick={actions.cancelDelete}>
              Отмена
            </button>
          </motion.div>
        ) : (
          <motion.div key="actions" className="row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="btn btn--ghost" onClick={actions.startEdit}>
              Редактировать
            </button>
            <button className="btn btn--danger" onClick={actions.askDelete}>
              Удалить
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
