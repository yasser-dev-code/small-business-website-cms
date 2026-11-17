import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import api, { resolveImage } from '../../api/client.js';
import useFetch from '../../hooks/useFetch.js';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import { Spinner, ErrorState, EmptyState, Badge } from '../../components/ui/index.jsx';
import { Toast } from '../../components/ui/Toast.jsx';

export default function BlogManager() {
  const { data, loading, error, reload } = useFetch('/admin/blog');
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');

  const posts = (data || []).filter((p) =>
    (status === 'all' || p.status === status) &&
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  const toggleStatus = async (p) => {
    const next = p.status === 'published' ? 'draft' : 'published';
    await api.put('/admin/blog/' + p._id, { status: next });
    reload();
  };

  const doDelete = async () => {
    await api.delete('/admin/blog/' + confirmId);
    setConfirmId(null);
    setToast({ type: 'success', message: 'Article deleted.' });
    reload();
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div><h1 className="text-2xl font-serif text-ink-900">Blog</h1><p className="text-gray-500 text-sm">Create, edit and publish articles.</p></div>
        <Link to="/admin/blog/new" className="btn-admin"><Plus className="h-4 w-4" />New article</Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Search articles..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select className="input w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {posts.length === 0 ? <EmptyState title="No articles" description="Write your first article." action={<Link to="/admin/blog/new" className="btn-admin text-sm">New article</Link>} /> : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p._id} className="card p-4 flex gap-4 items-center">
              <img src={resolveImage(p.featuredImage)} alt="" className="h-16 w-24 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{p.title}</h3>
                  <Badge tone={p.status === 'published' ? 'green' : 'yellow'}>{p.status}</Badge>
                </div>
                <p className="text-xs text-gray-500 line-clamp-1 mt-1">{p.excerpt}</p>
                <p className="text-xs text-gray-400 mt-1">/blog/{p.slug}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Link to={'/admin/blog/' + p._id + '/edit'} className="p-1.5 text-gray-500 hover:text-brand-600"><Pencil className="h-4 w-4" /></Link>
                <button onClick={() => toggleStatus(p)} className="p-1.5 text-gray-500 hover:text-brand-600">{p.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                <button onClick={() => setConfirmId(p._id)} className="p-1.5 text-gray-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!confirmId} title="Delete article" message="This action cannot be undone." onCancel={() => setConfirmId(null)} onConfirm={doDelete} />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
