/**
 * Демо-данные: показываются при первом открытии, пока пользователь не добавил свои релизы.
 */
import { CHECKLIST_TEMPLATE } from '../config/stages.js';

/** Чек-лист, в котором отмечены пункты с указанными индексами. */
const checklist = (doneIndexes = []) =>
  CHECKLIST_TEMPLATE.map((title, i) => ({ title, done: doneIndexes.includes(i) }));

export const SEED_RELEASES = [
  {
    id: 'seed-1',
    version: '2.4.0',
    name: 'Смены: обмен сменами между сотрудниками',
    date: '2026-10-08',
    stage: 'qa',
    owner: 'Борис Ф.',
    notes: 'Ждём фикс по уведомлениям.',
    checklist: checklist([0, 1, 2]),
    example: true,
  },
  {
    id: 'seed-2',
    version: '2.3.2',
    name: 'Hotfix: расчёт ночных часов',
    date: '2026-09-24',
    stage: 'prod',
    owner: 'Борис Ф.',
    notes: 'Выкачено без простоя.',
    checklist: checklist([0, 1, 2, 3, 4, 5]),
    example: true,
  },
  {
    id: 'seed-3',
    version: '2.3.1',
    name: 'Экспорт табеля в Excel',
    date: '2026-09-17',
    stage: 'rollback',
    owner: 'Борис Ф.',
    notes: 'Откат: неверная кодировка файла. Перенос в 2.3.2.',
    checklist: checklist([0, 2, 3, 4, 5]),
    example: true,
  },
  {
    id: 'seed-4',
    version: '2.5.0',
    name: 'Отчёт по выручке точки',
    date: '2026-10-22',
    stage: 'dev',
    owner: 'Борис Ф.',
    notes: '',
    checklist: checklist(),
    example: true,
  },
];
