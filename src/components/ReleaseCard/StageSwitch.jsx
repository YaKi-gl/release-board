import { motion } from 'framer-motion';
import { STAGES } from '../../config/stages.js';

/** Переключатель стадии: подсветка «переезжает» к выбранной кнопке. */
export function StageSwitch({ current, onChange }) {
  return (
    <div className="stage-switch">
      {STAGES.map((stage) => {
        const active = stage.id === current;
        return (
          <button
            key={stage.id}
            className={`stage-switch__btn ${active ? 'is-active' : ''}`}
            onClick={() => onChange(stage.id)}
            aria-pressed={active}
          >
            {active && (
              <motion.span
                layoutId="stage-switch-pill"
                className={`stage-switch__pill stage-switch__pill--${stage.id}`}
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span className="stage-switch__text">{stage.label}</span>
          </button>
        );
      })}
    </div>
  );
}
