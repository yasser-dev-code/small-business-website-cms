import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { UtensilsCrossed, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <UtensilsCrossed className="h-10 w-10 text-brand-400 mx-auto mb-3" />
          <h1 className="font-serif text-2xl text-white">Maison Gourmet Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to manage your website</p>
        </div>
        <form onSubmit={onSubmit} className="bg-white rounded-2xl p-8 shadow-xl space-y-4">
          {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@maisongourmet.com" required />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required />
          </div>
          <button disabled={loading} className="btn-primary w-full disabled:opacity-60">
            <LogIn className="h-4 w-4" />{loading ? 'Signing in...' : 'Sign in'}
          </button>
          <p className="text-xs text-gray-400 text-center">Demo: admin@maisongourmet.com / Admin123!</p>
        </form>
      </div>
    </div>
  );
}
