import { motion } from 'framer-motion';
import './ui.css';

/** Полоса прогресса с пружинной анимацией заполнения. */
export function ProgressBar({ value }) {
  return (
    <span className="progress" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <motion.i
        className="progress__fill"
        initial={false}
        animate={{ width: `${value}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />
    </span>
  );
}
