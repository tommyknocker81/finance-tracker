import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

function normalize(p) {
  return {
    ...p,
    invoices: (p.invoices || [])
      .map(inv => ({ ...inv, dueDate: inv.due_date }))
      .sort((a, b) => a.due_date.localeCompare(b.due_date)),
  };
}

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase
      .from('projects')
      .select('*, invoices(*)')
      .order('created_at', { ascending: false });
    if (data) setProjects(data.map(normalize));
    setLoading(false);
  }

  async function save(p) {
    await supabase.from('projects').upsert({
      id: p.id, name: p.name, status: p.status,
      probability: p.probability, client: p.client, notes: p.notes,
    });

    await supabase.from('invoices').delete().eq('project_id', p.id);

    if (p.invoices.length > 0) {
      await supabase.from('invoices').insert(
        p.invoices.map(inv => ({
          id: inv.id, project_id: p.id, name: inv.name,
          amount: inv.amount, due_date: inv.dueDate, paid: inv.paid,
        }))
      );
    }

    const { data } = await supabase
      .from('projects')
      .select('*, invoices(*)')
      .order('created_at', { ascending: false });
    if (data) setProjects(data.map(normalize));
    return p;
  }

  async function del(id) {
    await supabase.from('projects').delete().eq('id', id);
    setProjects(ps => ps.filter(p => p.id !== id));
  }

  async function togglePaid(projectId, invoiceId) {
    const project = projects.find(p => p.id === projectId);
    const invoice = project?.invoices.find(i => i.id === invoiceId);
    if (!invoice) return;

    const newPaid = !invoice.paid;
    await supabase.from('invoices').update({ paid: newPaid }).eq('id', invoiceId);

    setProjects(ps => ps.map(p =>
      p.id !== projectId ? p : {
        ...p,
        invoices: p.invoices.map(i => i.id !== invoiceId ? i : { ...i, paid: newPaid }),
      }
    ));
  }

  return { projects, loading, save, del, togglePaid };
}
