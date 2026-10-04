/**
 * Константы предметной области: стадии релиза и шаблон чек-листа.
 */

export const STAGES = [
  { id: 'planned', label: 'План' },
  { id: 'dev', label: 'Разработка' },
  { id: 'qa', label: 'Тестирование' },
  { id: 'prod', label: 'В проде' },
  { id: 'rollback', label: 'Откат' },
];

export const STAGE_LABELS = Object.fromEntries(STAGES.map((s) => [s.id, s.label]));

/** Стадии, в которых релиз ещё «в работе». */
export const ACTIVE_STAGES = ['dev', 'qa'];

/** Стадии, которыми релиз завершается. */
export const FINAL_STAGES = ['prod', 'rollback'];

export const CHECKLIST_TEMPLATE = [
  'Все задачи релиза закрыты в Jira',
  'Регресс пройден QA',
  'Миграции БД проверены на стейдже',
  'Release notes согласованы',
  'План отката описан',
  'Команда поддержки предупреждена',
];

export const STORAGE_KEY = 'release-board:releases';
