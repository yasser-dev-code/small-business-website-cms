import { Loader2, AlertTriangle, Inbox } from 'lucide-react';

export function Spinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-gray-500">
      <Loader2 className="animate-spin h-5 w-5" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <AlertTriangle className="h-8 w-8 text-red-500" />
      <p className="text-gray-700">{message || 'Something went wrong.'}</p>
      {onRetry && <button onClick={onRetry} className="btn-outline px-4 py-2 text-sm">Try again</button>}
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center border border-dashed border-gray-300 rounded-2xl">
      <Inbox className="h-8 w-8 text-gray-400" />
      <p className="font-medium text-gray-800">{title}</p>
      {description && <p className="text-sm text-gray-500 max-w-sm">{description}</p>}
      {action}
    </div>
  );
}

export function Badge({ children, tone = 'gray' }) {
  const tones = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    gray: 'bg-gray-100 text-gray-700',
    red: 'bg-red-100 text-red-700'
  };
  return <span className={'badge ' + (tones[tone] || tones.gray)}>{children}</span>;
}
