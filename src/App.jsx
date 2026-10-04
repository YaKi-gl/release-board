import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header/Header.jsx';
import { ReleaseCard } from './components/ReleaseCard/ReleaseCard.jsx';
import { ReleaseForm } from './components/ReleaseForm/ReleaseForm.jsx';
import { ReleaseList } from './components/ReleaseList/ReleaseList.jsx';
import { StageFilter } from './components/StageFilter/StageFilter.jsx';
import { StatsBar } from './components/StatsBar/StatsBar.jsx';
import { useReleaseBoard } from './hooks/useReleaseBoard.js';

export default function App() {
  const { state, selected, actions } = useReleaseBoard();
  const { releases, filter, selectedId, draft, confirmDelete } = state;

  return (
    <div className="app">
      <Header onCreate={actions.startCreate} />
      <StatsBar releases={releases} />
      <StageFilter releases={releases} filter={filter} onChange={actions.setFilter} />

      <main className="workspace">
        <ReleaseList releases={releases} filter={filter} selectedId={selectedId} onSelect={actions.select} />

        <AnimatePresence mode="wait">
          {draft ? (
            <ReleaseForm key={`form-${draft.id ?? 'new'}`} draft={draft} onSave={actions.saveDraft} onCancel={actions.cancelEdit} />
          ) : (
            <ReleaseCard key={selected?.id ?? 'empty'} release={selected} confirmDelete={confirmDelete} actions={actions} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
