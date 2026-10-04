import { motion } from 'framer-motion';
import './ui.css';

const COLORS = ['#2944c9', '#8ea2ff', '#1f7a4d', '#6fd3a0', '#f0bf5e'];
const PARTICLES = Array.from({ length: 24 }, (_, i) => {
  // «Золотой угол» равномерно раскладывает частицы по кругу без Math.random
  const angle = (i * 137.5 * Math.PI) / 180;
  const distance = 60 + (i % 4) * 22;
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance - 20,
    size: 5 + (i % 3) * 2,
    color: COLORS[i % COLORS.length],
    round: i % 2 === 0,
  };
});

/** Короткий взрыв конфетти. Перезапускается при смене key. */
export function Confetti() {
  return (
    <span className="confetti" aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="confetti__piece"
          style={{ width: p.size, height: p.size, background: p.color, borderRadius: p.round ? '50%' : 2 }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 40], scale: [0, 1, 0.8], opacity: [1, 1, 0], rotate: p.round ? 0 : 360 }}
          transition={{ duration: 1.1, ease: 'easeOut', times: [0, 0.5, 1] }}
        />
      ))}
    </span>
  );
}
