import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import api, { resolveImage } from '../../api/client.js';

export default function ImageField({ label = 'Image', value, onChange }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await api.post('/admin/media', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      onChange(res.data.url);
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex gap-3 items-start">
        <div className="h-20 w-20 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0">
          {value ? <img src={resolveImage(value)} alt="preview" className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">None</div>}
        </div>
        <div className="flex-1 space-y-2">
          <input className="input" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="Paste image URL or upload" />
          <label className="inline-flex items-center gap-2 text-sm text-brand-700 cursor-pointer">
            <UploadCloud className="h-4 w-4" />{uploading ? 'Uploading...' : 'Upload image'}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      </div>
    </div>
  );
}
