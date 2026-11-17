import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Eye, ArrowLeft } from 'lucide-react';
import api from '../../api/client.js';
import ImageField from '../../components/admin/ImageField.jsx';
import { Spinner } from '../../components/ui/index.jsx';
import { Toast } from '../../components/ui/Toast.jsx';

const blank = { title: '', excerpt: '', content: '', featuredImage: '', author: 'Maison Gourmet', tags: [], status: 'draft', seo: { title: '', description: '' } };

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(blank);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    api.get('/admin/blog').then((r) => {
      const found = r.data.find((p) => p._id === id);
      if (found) setForm({ ...blank, ...found, tags: found.tags || [], seo: { ...blank.seo, ...(found.seo || {}) } });
    }).finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setSeo = (k, v) => setForm((f) => ({ ...f, seo: { ...f.seo, [k]: v } }));

  const submit = async (status) => {
    setSaving(true);
    const payload = { ...form, status, tags: form.tags.filter(Boolean) };
    try {
      if (isEdit) await api.put('/admin/blog/' + id, payload);
      else await api.post('/admin/blog', payload);
      setToast({ type: 'success', message: status === 'published' ? 'Article published.' : 'Draft saved.' });
      setTimeout(() => navigate('/admin/blog'), 800);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Save failed.' });
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl">
      <button onClick={() => navigate('/admin/blog')} className="inline-flex items-center gap-2 text-sm text-gray-500 mb-4"><ArrowLeft className="h-4 w-4" />Back to blog</button>
      <h1 className="text-2xl font-serif text-ink-900 mb-1">{isEdit ? 'Edit article' : 'New article'}</h1>
      <p className="text-gray-500 text-sm mb-8">Write your article, then save as draft or publish.</p>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-6 space-y-4">
            <div><label className="label">Title</label><input className="input text-lg" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Article title" /></div>
            <div><label className="label">Excerpt</label><textarea rows="2" className="input" value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} placeholder="Short summary for cards and SEO" /></div>
            <div><label className="label">Content</label><textarea rows="14" className="input font-mono text-sm" value={form.content} onChange={(e) => set('content', e.target.value)} placeholder="Write your article..." /></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-ink-900">Publish</h2>
            <div><label className="label">Status</label>
              <span className={'badge ' + (form.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')}>{form.status}</span>
            </div>
            <div><label className="label">Author</label><input className="input" value={form.author} onChange={(e) => set('author', e.target.value)} /></div>
            <div><label className="label">Tags (comma separated)</label><input className="input" value={(form.tags || []).join(', ')} onChange={(e) => set('tags', e.target.value.split(',').map((t) => t.trim()))} /></div>
            <div className="flex flex-col gap-2 pt-2">
              <button onClick={() => submit('draft')} disabled={saving} className="w-full px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-50 disabled:opacity-60"><Save className="h-4 w-4 inline mr-2" />Save draft</button>
              <button onClick={() => submit('published')} disabled={saving} className="btn-admin w-full disabled:opacity-60"><Eye className="h-4 w-4" />Publish</button>
            </div>
          </div>
          <div className="card p-6"><ImageField label="Featured image" value={form.featuredImage} onChange={(v) => set('featuredImage', v)} /></div>
          <div className="card p-6 space-y-3">
            <h2 className="font-semibold text-ink-900">SEO</h2>
            <div><label className="label">SEO title</label><input className="input" value={form.seo.title} onChange={(e) => setSeo('title', e.target.value)} /></div>
            <div><label className="label">Meta description</label><textarea rows="2" className="input" value={form.seo.description} onChange={(e) => setSeo('description', e.target.value)} /></div>
          </div>
        </div>
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
