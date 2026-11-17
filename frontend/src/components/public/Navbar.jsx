import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, UtensilsCrossed } from 'lucide-react';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/menu', label: 'Menu' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const active = 'text-brand-600 font-semibold';
  const idle = 'text-ink-800 hover:text-brand-600 transition-colors';

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="container-page flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6 text-brand-600" />
          <span className="font-serif text-xl text-ink-900">Maison Gourmet</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => (isActive ? active : idle)}>
              {l.label}
            </NavLink>
          ))}
          <Link to="/admin/login" className="btn-primary px-4 py-2 text-sm">Admin</Link>
        </nav>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-gray-100 bg-white">
          <div className="container-page py-4 flex flex-col gap-3">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? active : idle)}>{l.label}</NavLink>
            ))}
            <Link to="/admin/login" onClick={() => setOpen(false)} className="btn-primary px-4 py-2 text-sm w-fit">Admin</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
