/**
 * Цветной чип стадии релиза.
 */
import { STAGE_LABELS } from '../config.js';

export const StageChip = (stage) => `<span class="chip chip--${stage}">${STAGE_LABELS[stage] ?? stage}</span>`;
