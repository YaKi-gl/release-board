import { motion } from 'framer-motion';
import { countInProgress, countShippedInMonth, nextRelease, rollbackRate } from '../../services/metrics.js';
import { formatDate, todayIso } from '../../utils/format.js';
import { fadeUp, staggerContainer } from '../motion/presets.js';
import { AnimatedNumber } from '../ui/AnimatedNumber.jsx';
import './StatsBar.css';


function Stat({ label, value, hint }) {
  return (
    <motion.div className="stat" variants={fadeUp}>
      <span className="stat__label">{label}</span>
      <b className="stat__value">{value}</b>
      <div className="muted">{hint}</div>
    </motion.div>
  );
}

/** Сводка ключевых метрик релизного процесса. */
export function StatsBar({ releases }) {
  const today = todayIso();
  const next = nextRelease(releases, today);

  return (
    <motion.section className="stats" aria-label="Сводка" variants={staggerContainer(0.07)} initial="hidden" animate="show">
      <Stat label="Следующий релиз" value={next ? next.version : '—'} hint={next ? formatDate(next.date) : 'нет в плане'} />
      <Stat label="В работе" value={<AnimatedNumber value={countInProgress(releases)} />} hint="разработка + тест" />
      <Stat
        label="Выкачено за месяц"
        value={<AnimatedNumber value={countShippedInMonth(releases, today)} />}
        hint="стадия «В проде»"
      />
      <Stat
        label="Доля откатов"
        value={<AnimatedNumber value={rollbackRate(releases)} format={(v) => `${Math.round(v)}%`} />}
        hint="от завершённых релизов"
      />
    </motion.section>
  );
}
