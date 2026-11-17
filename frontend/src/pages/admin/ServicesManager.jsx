import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import api, { resolveImage } from '../../api/client.js';
import useFetch from '../../hooks/useFetch.js';
import ImageField from '../../components/admin/ImageField.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import { Spinner, ErrorState, EmptyState, Badge } from '../../components/ui/index.jsx';
import { Toast } from '../../components/ui/Toast.jsx';

const blank = { title: '', description: '', image: '', featured: false, published: true };

export default function ServicesManager() {
  const { data, loading, error, reload } = useFetch('/admin/services');
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState(null);

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing._id) await api.put('/admin/services/' + editing._id, editing);
      else await api.post('/admin/services', editing);
      setToast({ type: 'success', message: 'Service saved.' });
      setEditing(null);
      reload();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Save failed.' });
    }
  };

  const togglePublish = async (s) => {
    await api.put('/admin/services/' + s._id, { published: !s.published });
    reload();
  };

  const doDelete = async () => {
    await api.delete('/admin/services/' + confirmId);
    setConfirmId(null);
    setToast({ type: 'success', message: 'Service deleted.' });
    reload();
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-serif text-ink-900">Services</h1><p className="text-gray-500 text-sm">Manage the services shown on your site.</p></div>
        <button onClick={() => setEditing({ ...blank })} className="btn-admin"><Plus className="h-4 w-4" />Add service</button>
      </div>

      {data.length === 0 ? <EmptyState title="No services yet" description="Add your first service to get started." /> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((s) => (
            <div key={s._id} className="card p-4 flex gap-4">
              <img src={resolveImage(s.image)} alt="" className="h-20 w-20 rounded-lg object-cover bg-gray-100" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><h3 className="font-semibold truncate">{s.title}</h3>{s.featured && <Badge tone="yellow">Featured</Badge>}</div>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{s.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge tone={s.published ? 'green' : 'gray'}>{s.published ? 'Published' : 'Draft'}</Badge>
                  <button onClick={() => setEditing({ ...s })} className="p-1.5 text-gray-500 hover:text-brand-600"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => togglePublish(s)} className="p-1.5 text-gray-500 hover:text-brand-600">{s.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  <button onClick={() => setConfirmId(s._id)} className="p-1.5 text-gray-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 overflow-y-auto">
          <form onSubmit={save} className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4 my-8">
            <h2 className="text-lg font-semibold">{editing._id ? 'Edit service' : 'Add service'}</h2>
            <div><label className="label">Title</label><input required className="input" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
            <div><label className="label">Description</label><textarea required rows="3" className="input" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
            <ImageField value={editing.image} onChange={(v) => setEditing({ ...editing, image: v })} />
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />Featured</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />Published</label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg text-sm border border-gray-300">Cancel</button>
              <button className="btn-admin">Save</button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog open={!!confirmId} title="Delete service" message="This action cannot be undone." onCancel={() => setConfirmId(null)} onConfirm={doDelete} />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
