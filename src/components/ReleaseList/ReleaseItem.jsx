import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { readiness } from '../../services/metrics.js';
import { formatDate } from '../../utils/format.js';
import { ProgressBar } from '../ui/ProgressBar.jsx';
import { StageChip } from '../ui/StageChip.jsx';

/** Карточка релиза в списке. forwardRef нужен AnimatePresence в режиме popLayout. */
export const ReleaseItem = forwardRef(function ReleaseItem({ release, selected, onSelect }, ref) {
  const progress = readiness(release);

  return (
    <motion.li
      ref={ref}
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
    >
      <motion.button
        className="release-item"
        aria-current={selected}
        onClick={onSelect}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="release-item__version">v{release.version}</span>
        <StageChip stage={release.stage} />
        <span className="release-item__name">{release.name}</span>
        <ProgressBar value={progress} />
        <span className="release-item__meta">
          <span>📅 {formatDate(release.date)}</span>
          <span>Чек-лист {progress}%</span>
          {release.owner && <span>{release.owner}</span>}
          {release.example && <span>пример</span>}
        </span>
      </motion.button>
    </motion.li>
  );
});
