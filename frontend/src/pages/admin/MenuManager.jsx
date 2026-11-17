import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import api, { resolveImage } from '../../api/client.js';
import useFetch from '../../hooks/useFetch.js';
import ImageField from '../../components/admin/ImageField.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import { Spinner, ErrorState, EmptyState, Badge } from '../../components/ui/index.jsx';
import { Toast } from '../../components/ui/Toast.jsx';

const blank = { name: '', description: '', price: 0, category: '', image: '', featured: false, published: true };

export default function MenuManager() {
  const { data, loading, error, reload } = useFetch('/admin/menu');
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set((data || []).map((m) => m.category)))];
  const items = (data || []).filter((m) =>
    (filter === 'All' || m.category === filter) &&
    (m.name.toLowerCase().includes(query.toLowerCase()))
  );

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing._id) await api.put('/admin/menu/' + editing._id, editing);
      else await api.post('/admin/menu', editing);
      setToast({ type: 'success', message: 'Menu item saved.' });
      setEditing(null);
      reload();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Save failed.' });
    }
  };

  const togglePublish = async (m) => { await api.put('/admin/menu/' + m._id, { published: !m.published }); reload(); };
  const doDelete = async () => { await api.delete('/admin/menu/' + confirmId); setConfirmId(null); setToast({ type: 'success', message: 'Menu item deleted.' }); reload(); };

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div><h1 className="text-2xl font-serif text-ink-900">Menu</h1><p className="text-gray-500 text-sm">Add and organize your dishes by category.</p></div>
        <button onClick={() => setEditing({ ...blank })} className="btn-admin"><Plus className="h-4 w-4" />Add item</button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Search menu..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select className="input w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {items.length === 0 ? <EmptyState title="No menu items" description="Add dishes or adjust your filters." /> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((m) => (
                  <tr key={m._id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={resolveImage(m.image)} alt="" className="h-10 w-10 rounded-lg object-cover bg-gray-100" />
                        <div><p className="font-medium text-ink-900">{m.name}{m.featured && <span className="ml-2 text-xs text-brand-600">Featured</span>}</p><p className="text-xs text-gray-400 line-clamp-1 max-w-xs">{m.description}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge tone="gray">{m.category}</Badge></td>
                    <td className="px-4 py-3 font-medium">{m.price} EUR</td>
                    <td className="px-4 py-3"><Badge tone={m.published ? 'green' : 'gray'}>{m.published ? 'Published' : 'Draft'}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setEditing({ ...m })} className="p-1.5 text-gray-500 hover:text-brand-600"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => togglePublish(m)} className="p-1.5 text-gray-500 hover:text-brand-600">{m.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                        <button onClick={() => setConfirmId(m._id)} className="p-1.5 text-gray-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 overflow-y-auto">
          <form onSubmit={save} className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4 my-8">
            <h2 className="text-lg font-semibold">{editing._id ? 'Edit item' : 'Add menu item'}</h2>
            <div><label className="label">Name</label><input required className="input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
            <div><label className="label">Description</label><textarea required rows="2" className="input" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Price (EUR)</label><input required type="number" min="0" step="0.5" className="input" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} /></div>
              <div><label className="label">Category</label><input required className="input" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="Starters" /></div>
            </div>
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

      <ConfirmDialog open={!!confirmId} title="Delete menu item" message="This action cannot be undone." onCancel={() => setConfirmId(null)} onConfirm={doDelete} />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
