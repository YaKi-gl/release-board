import { STAGE_LABELS } from '../../config/stages.js';
import './ui.css';

/** Цветной чип стадии релиза. */
export function StageChip({ stage }) {
  return <span className={`chip chip--${stage}`}>{STAGE_LABELS[stage] ?? stage}</span>;
}
