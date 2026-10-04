import { motion } from 'framer-motion';

/** Галочка, которая «прорисовывается» при отметке пункта. */
function CheckMark({ checked }) {
  return (
    <motion.span
      className="check-box"
      animate={{ backgroundColor: checked ? 'var(--accent)' : 'rgba(0,0,0,0)', scale: checked ? [1, 1.2, 1] : 1 }}
      transition={{ duration: 0.25 }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <motion.path
          d="M5 13l4 4L19 7"
          fill="none"
          stroke="var(--panel)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: checked ? 1 : 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        />
      </svg>
    </motion.span>
  );
}

/** Чек-лист готовности релиза. */
export function Checklist({ items, onToggle }) {
  return (
    <div className="checklist">
      {items.map((item, i) => (
        <label key={item.title} className="checklist__item">
          <input
            type="checkbox"
            className="visually-hidden"
            checked={item.done}
            onChange={(e) => onToggle(i, e.target.checked)}
          />
          <CheckMark checked={item.done} />
          <motion.span
            className="checklist__title"
            animate={{ opacity: item.done ? 0.55 : 1 }}
            style={{ textDecoration: item.done ? 'line-through' : 'none' }}
          >
            {item.title}
          </motion.span>
        </label>
      ))}
    </div>
  );
}
