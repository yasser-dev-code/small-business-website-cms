import { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import api from '../../api/client.js';
import ImageField from '../../components/admin/ImageField.jsx';
import { Spinner } from '../../components/ui/index.jsx';
import { Toast } from '../../components/ui/Toast.jsx';

const empty = { name: '', tagline: '', address: '', phone: '', email: '', openingHours: [], social: { facebook: '', instagram: '', twitter: '' }, aboutTitle: '', aboutText: '', aboutImage: '' };

export default function SettingsManager() {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.get('/settings').then((r) => setForm({ ...empty, ...r.data, social: { ...empty.social, ...(r.data.social || {}) }, openingHours: r.data.openingHours || [] })).finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setSocial = (k, v) => setForm((f) => ({ ...f, social: { ...f.social, [k]: v } }));
  const setHour = (i, key, v) => setForm((f) => ({ ...f, openingHours: f.openingHours.map((h, idx) => idx === i ? { ...h, [key]: v } : h) }));
  const addHour = () => setForm((f) => ({ ...f, openingHours: [...f.openingHours, { day: '', hours: '' }] }));
  const removeHour = (i) => setForm((f) => ({ ...f, openingHours: f.openingHours.filter((_, idx) => idx !== i) }));

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/admin/settings', form);
      setToast({ type: 'success', message: 'Settings saved.' });
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Save failed.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-serif text-ink-900 mb-1">Restaurant Settings</h1>
      <p className="text-gray-500 text-sm mb-8">Your business details, shown across the public site.</p>
      <form onSubmit={onSave} className="space-y-6">
        <div className="card p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label">Restaurant name</label><input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
            <div><label className="label">Tagline</label><input className="input" value={form.tagline} onChange={(e) => set('tagline', e.target.value)} /></div>
          </div>
          <div><label className="label">Address</label><input className="input" value={form.address} onChange={(e) => set('address', e.target.value)} /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={(e) => set('phone', e.target.value)} /></div>
            <div><label className="label">Email</label><input className="input" value={form.email} onChange={(e) => set('email', e.target.value)} /></div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-ink-900">About section</h2>
          <div><label className="label">About title</label><input className="input" value={form.aboutTitle} onChange={(e) => set('aboutTitle', e.target.value)} /></div>
          <div><label className="label">About text</label><textarea rows="4" className="input" value={form.aboutText} onChange={(e) => set('aboutText', e.target.value)} /></div>
          <ImageField label="About image" value={form.aboutImage} onChange={(v) => set('aboutImage', v)} />
        </div>

        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between"><h2 className="font-semibold text-ink-900">Opening hours</h2><button type="button" onClick={addHour} className="text-sm text-brand-600 inline-flex items-center gap-1"><Plus className="h-4 w-4" />Add</button></div>
          {form.openingHours.map((h, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input className="input" placeholder="Day" value={h.day} onChange={(e) => setHour(i, 'day', e.target.value)} />
              <input className="input" placeholder="Hours" value={h.hours} onChange={(e) => setHour(i, 'hours', e.target.value)} />
              <button type="button" onClick={() => removeHour(i)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-ink-900">Social media</h2>
          <div><label className="label">Facebook</label><input className="input" value={form.social.facebook} onChange={(e) => setSocial('facebook', e.target.value)} /></div>
          <div><label className="label">Instagram</label><input className="input" value={form.social.instagram} onChange={(e) => setSocial('instagram', e.target.value)} /></div>
          <div><label className="label">Twitter</label><input className="input" value={form.social.twitter} onChange={(e) => setSocial('twitter', e.target.value)} /></div>
        </div>

        <button disabled={saving} className="btn-admin disabled:opacity-60"><Save className="h-4 w-4" />{saving ? 'Saving...' : 'Save settings'}</button>
      </form>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
