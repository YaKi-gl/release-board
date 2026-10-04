/**
 * Утилиты форматирования и безопасного вывода.
 */

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Экранирует пользовательский текст перед вставкой в HTML (защита от XSS). */
export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);

/** Дата в формате YYYY-MM-DD → «8 окт. 2026 г.» */
export function formatDate(isoDate) {
  if (!isoDate) return '—';
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Сегодняшняя дата в формате YYYY-MM-DD по местному времени. */
export function todayIso() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Сортировка релизов: сначала самые поздние. */
export const byDateDesc = (a, b) => (b.date ?? '').localeCompare(a.date ?? '');

/** Короткий уникальный id. */
export const createId = () => `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
