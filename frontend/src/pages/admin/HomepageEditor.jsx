import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import api from '../../api/client.js';
import ImageField from '../../components/admin/ImageField.jsx';
import { Spinner } from '../../components/ui/index.jsx';
import { Toast } from '../../components/ui/Toast.jsx';

const empty = { headline: '', subtitle: '', heroImage: '', introTitle: '', introText: '', ctaText: '', ctaLink: '', seo: { title: '', description: '' } };

export default function HomepageEditor() {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.get('/homepage').then((r) => setForm({ ...empty, ...r.data, seo: { ...empty.seo, ...(r.data.seo || {}) } })).finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setSeo = (k, v) => setForm((f) => ({ ...f, seo: { ...f.seo, [k]: v } }));

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/admin/homepage', form);
      setToast({ type: 'success', message: 'Homepage saved. Changes are live on the public site.' });
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Save failed.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-serif text-ink-900 mb-1">Homepage</h1>
      <p className="text-gray-500 text-sm mb-8">Edit the content shown on your public homepage.</p>
      <form onSubmit={onSave} className="space-y-6">
        <div className="card p-6 space-y-4">
          <div><label className="label">Headline</label><input className="input" value={form.headline} onChange={(e) => set('headline', e.target.value)} /></div>
          <div><label className="label">Subtitle</label><input className="input" value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} /></div>
          <ImageField label="Hero image" value={form.heroImage} onChange={(v) => set('heroImage', v)} />
        </div>
        <div className="card p-6 space-y-4">
          <div><label className="label">Introduction title</label><input className="input" value={form.introTitle} onChange={(e) => set('introTitle', e.target.value)} /></div>
          <div><label className="label">Introduction text</label><textarea rows="4" className="input" value={form.introText} onChange={(e) => set('introText', e.target.value)} /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label">Call-to-action text</label><input className="input" value={form.ctaText} onChange={(e) => set('ctaText', e.target.value)} /></div>
            <div><label className="label">Call-to-action link</label><input className="input" value={form.ctaLink} onChange={(e) => set('ctaLink', e.target.value)} placeholder="/menu" /></div>
          </div>
        </div>
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-ink-900">SEO</h2>
          <div><label className="label">SEO title</label><input className="input" value={form.seo.title} onChange={(e) => setSeo('title', e.target.value)} /></div>
          <div><label className="label">Meta description</label><textarea rows="2" className="input" value={form.seo.description} onChange={(e) => setSeo('description', e.target.value)} /></div>
        </div>
        <button disabled={saving} className="btn-admin disabled:opacity-60"><Save className="h-4 w-4" />{saving ? 'Saving...' : 'Save changes'}</button>
      </form>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
