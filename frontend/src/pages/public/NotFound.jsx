import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-page py-32 text-center">
      <p className="text-7xl font-serif text-brand-300">404</p>
      <h1 className="text-3xl font-serif text-ink-900 mt-4">Page not found</h1>
      <p className="text-gray-600 mt-2 mb-8">The page you are looking for has moved or no longer exists.</p>
      <Link to="/" className="btn-primary"><Home className="h-4 w-4" /> Back to homepage</Link>
    </div>
  );
}
