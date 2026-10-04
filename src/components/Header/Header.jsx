import { motion } from 'framer-motion';
import { isStorageAvailable } from '../../services/storage.js';
import './Header.css';

export function Header({ onCreate }) {
  return (
    <header className="header">
      <div>
        <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          Release Board
        </motion.h1>
        <p className="header__subtitle">Календарь выкладок, стадии и чек-лист готовности к релизу</p>
      </div>
      <div className="row">
        <span className="header__badge">
          {isStorageAvailable() ? 'данные хранятся в этом браузере' : 'хранилище недоступно · изменения не сохранятся'}
        </span>
        <motion.button className="btn" onClick={onCreate} whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }}>
          + Новый релиз
        </motion.button>
      </div>
    </header>
  );
}
