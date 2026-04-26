import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Pipeline from './components/Pipeline';
import Forecast from './components/Forecast';
import ProjectDetail from './components/ProjectDetail';
import ProjectModal from './components/ProjectModal';
import Login from './components/Login';
import { useProjects } from './hooks/useProjects';
import { useIsMobile } from './hooks/useIsMobile';
import { supabase } from './supabase';

const Spinner = () => (
  <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
    <span style={{ color: 'oklch(60% 0 0)', fontSize: 14 }}>Loading…</span>
  </div>
);

function AuthenticatedApp() {
  const [page, setPage]         = useState('pipeline');
  const [selected, setSelected] = useState(null);
  const [editing, setEditing]   = useState(null);
  const isMobile = useIsMobile();
  const { projects, loading, save, del, togglePaid } = useProjects();

  async function handleSave(p) {
    await save(p);
    setEditing(null);
    setSelected(p);
  }

  async function handleDel(id) {
    await del(id);
    setSelected(null);
  }

  async function handleTogglePaid(pid, iid) {
    await togglePaid(pid, iid);
    setSelected(prev =>
      prev?.id === pid
        ? { ...prev, invoices: prev.invoices.map(i => i.id !== iid ? i : { ...i, paid: !i.paid }) }
        : prev
    );
  }

  if (loading) return <Spinner />;

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: '100%' }}>
      <Sidebar page={page} setPage={setPage} projects={projects} isMobile={isMobile} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', paddingBottom: isMobile ? 60 : 0 }}>
        {page === 'pipeline' && (
          <Pipeline
            projects={projects}
            onSelect={setSelected}
            onNew={() => setEditing('new')}
            isMobile={isMobile}
          />
        )}
        {page === 'forecast' && (
          <Forecast projects={projects} onEdit={p => setEditing(p)} isMobile={isMobile} />
        )}
      </div>

      {selected && (
        <ProjectDetail
          project={selected}
          onEdit={() => { setEditing(selected); setSelected(null); }}
          onDelete={() => handleDel(selected.id)}
          onClose={() => setSelected(null)}
          onTogglePaid={handleTogglePaid}
        />
      )}

      {editing && (
        <ProjectModal
          project={editing === 'new' ? null : editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) return <Spinner />;
  if (!session) return <Login />;
  return <AuthenticatedApp />;
}
