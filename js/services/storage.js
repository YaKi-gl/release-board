/**
 * Слой хранения. Сейчас это localStorage; при переходе на сервер
 * достаточно заменить реализацию этих двух функций.
 */
import { STORAGE_KEY } from '../config.js';

/** @returns {Array|null} сохранённые релизы или null, если данных нет */
export function loadReleases() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveReleases(releases) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(releases));
    return true;
  } catch {
    return false;
  }
}

/** Доступно ли хранилище (в приватном режиме может быть отключено). */
export function isStorageAvailable() {
  try {
    const key = `${STORAGE_KEY}:probe`;
    localStorage.setItem(key, '1');
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
