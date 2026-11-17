import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Home, Briefcase, Newspaper, UtensilsCrossed, Settings, Image, LogOut, Menu, X, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/homepage', label: 'Homepage', icon: Home },
  { to: '/admin/services', label: 'Services', icon: Briefcase },
  { to: '/admin/blog', label: 'Blog', icon: Newspaper },
  { to: '/admin/menu', label: 'Menu', icon: UtensilsCrossed },
  { to: '/admin/media', label: 'Media', icon: Image },
  { to: '/admin/settings', label: 'Settings', icon: Settings }
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const onLogout = async () => { await logout(); navigate('/admin/login'); };
  const cls = ({ isActive }) => 'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ' + (isActive ? 'bg-brand-600 text-white' : 'text-gray-300 hover:bg-white/10');

  const Sidebar = (
    <div className="flex flex-col h-full">
      <div className="px-5 h-16 flex items-center gap-2 border-b border-white/10">
        <UtensilsCrossed className="h-6 w-6 text-brand-400" />
        <span className="font-serif text-lg text-white">Maison Gourmet</span>
      </div>
      <nav className="flex-1 px-3 py-5 space-y-1">
        {nav.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className={cls} onClick={() => setOpen(false)}>
            <n.icon className="h-5 w-5" />{n.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        <Link to="/" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10"><ExternalLink className="h-5 w-5" />View site</Link>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10"><LogOut className="h-5 w-5" />Logout</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-ink-900">{Sidebar}</aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-ink-900">{Sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
          <span className="text-sm text-gray-500 hidden sm:block">Signed in as <strong className="text-ink-900">{admin?.name}</strong></span>
          <span className="badge bg-brand-50 text-brand-700">Admin</span>
        </header>
        <main className="p-4 sm:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
