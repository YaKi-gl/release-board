import { AnimatePresence, motion } from 'framer-motion';
import { byDateDesc } from '../../utils/format.js';
import { EmptyState } from '../ui/EmptyState.jsx';
import { ReleaseItem } from './ReleaseItem.jsx';
import './ReleaseList.css';

/** Список релизов. При фильтрации карточки плавно перестраиваются (layout-анимация). */
export function ReleaseList({ releases, filter, selectedId, onSelect }) {
  const visible = releases.filter((r) => filter === 'all' || r.stage === filter).sort(byDateDesc);

  if (!visible.length) {
    return (
      <EmptyState>
        {releases.length ? 'В этой стадии релизов нет.' : 'Релизов пока нет. Нажмите «+ Новый релиз», чтобы добавить первый.'}
      </EmptyState>
    );
  }

  return (
    <motion.ul className="release-list" layout>
      <AnimatePresence initial={false} mode="popLayout">
        {visible.map((release) => (
          <ReleaseItem
            key={release.id}
            release={release}
            selected={release.id === selectedId}
            onSelect={() => onSelect(release.id)}
          />
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
