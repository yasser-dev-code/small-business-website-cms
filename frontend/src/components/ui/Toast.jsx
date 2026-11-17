import { useEffect } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;
  const ok = toast.type === 'success';
  return (
    <div className={'fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white ' + (ok ? 'bg-green-600' : 'bg-red-600')}>
      {ok ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
      <span className="text-sm">{toast.message}</span>
    </div>
  );
}
