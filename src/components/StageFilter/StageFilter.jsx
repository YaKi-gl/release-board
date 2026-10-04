import { motion } from 'framer-motion';
import { STAGES } from '../../config/stages.js';
import { countByStage } from '../../services/metrics.js';
import './StageFilter.css';

/** Фильтр по стадиям. Активная «таблетка» плавно перетекает между кнопками. */
export function StageFilter({ releases, filter, onChange }) {
  const options = [{ id: 'all', label: 'Все', count: releases.length }].concat(
    STAGES.map((s) => ({ id: s.id, label: s.label, count: countByStage(releases, s.id) })),
  );

  return (
    <nav className="stage-filter" aria-label="Фильтр по стадии">
      {options.map((o) => {
        const active = filter === o.id;
        return (
          <button key={o.id} className="stage-filter__item" aria-pressed={active} onClick={() => onChange(o.id)}>
            {active && (
              <motion.span
                layoutId="stage-filter-pill"
                className="stage-filter__pill"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="stage-filter__text">
              {o.label}
              <small className="stage-filter__count">{o.count}</small>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
