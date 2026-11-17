import { useRef, useState } from 'react';
import { UploadCloud, Trash2, Copy } from 'lucide-react';
import api, { resolveImage } from '../../api/client.js';
import useFetch from '../../hooks/useFetch.js';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import { Spinner, ErrorState, EmptyState } from '../../components/ui/index.jsx';
import { Toast } from '../../components/ui/Toast.jsx';

export default function MediaManager() {
  const { data, loading, error, reload } = useFetch('/admin/media');
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState(null);

  const handleFiles = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const form = new FormData();
        form.append('image', file);
        await api.post('/admin/media', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setToast({ type: 'success', message: 'Upload complete.' });
      reload();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Upload failed.' });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const doDelete = async () => {
    await api.delete('/admin/media/' + confirmId);
    setConfirmId(null);
    setToast({ type: 'success', message: 'Image deleted.' });
    reload();
  };

  const copyUrl = (url) => {
    navigator.clipboard?.writeText(window.location.origin + url).catch(() => {});
    setToast({ type: 'success', message: 'URL copied to clipboard.' });
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-serif text-ink-900">Media Library</h1><p className="text-gray-500 text-sm">Upload and manage images (JPEG, PNG, WEBP, GIF, max 5MB).</p></div>
        <button onClick={() => inputRef.current?.click()} disabled={uploading} className="btn-admin disabled:opacity-60"><UploadCloud className="h-4 w-4" />{uploading ? 'Uploading...' : 'Upload images'}</button>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </div>

      {data.length === 0 ? <EmptyState title="No media yet" description="Upload images to use across your site." /> : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {data.map((m) => (
            <div key={m._id} className="card group">
              <div className="h-32 overflow-hidden bg-gray-100">
                <img src={resolveImage(m.url)} alt={m.originalName} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-500 truncate">{m.originalName || m.filename}</p>
                <div className="flex gap-1 mt-2">
                  <button onClick={() => copyUrl(m.url)} className="p-1.5 text-gray-500 hover:text-brand-600" title="Copy URL"><Copy className="h-4 w-4" /></button>
                  <button onClick={() => setConfirmId(m._id)} className="p-1.5 text-gray-500 hover:text-red-600" title="Delete"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!confirmId} title="Delete image" message="This will permanently remove the file." onCancel={() => setConfirmId(null)} onConfirm={doDelete} />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
