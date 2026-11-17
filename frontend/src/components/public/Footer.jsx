import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, UtensilsCrossed } from 'lucide-react';
import useFetch from '../../hooks/useFetch.js';

export default function Footer() {
  const { data } = useFetch('/settings');
  const s = data || { social: {}, openingHours: [] };

  return (
    <footer className="bg-ink-900 text-gray-300 mt-20">
      <div className="container-page py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <UtensilsCrossed className="h-6 w-6 text-brand-400" />
            <span className="font-serif text-xl text-white">{s.name || 'Maison Gourmet'}</span>
          </div>
          <p className="text-sm text-gray-400">{s.tagline || 'Fine French dining, crafted with passion since 2001.'}</p>
          <div className="flex gap-3 mt-5">
            {s.social?.facebook && <a href={s.social.facebook} aria-label="Facebook"><Facebook className="h-5 w-5 hover:text-brand-400" /></a>}
            {s.social?.instagram && <a href={s.social.instagram} aria-label="Instagram"><Instagram className="h-5 w-5 hover:text-brand-400" /></a>}
            {s.social?.twitter && <a href={s.social.twitter} aria-label="Twitter"><Twitter className="h-5 w-5 hover:text-brand-400" /></a>}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-brand-400">About Us</Link></li>
            <li><Link to="/services" className="hover:text-brand-400">Services</Link></li>
            <li><Link to="/menu" className="hover:text-brand-400">Menu</Link></li>
            <li><Link to="/blog" className="hover:text-brand-400">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-brand-400" />{s.address}</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 text-brand-400" />{s.phone}</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 text-brand-400" />{s.email}</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Opening Hours</h4>
          <ul className="space-y-1.5 text-sm">
            {(s.openingHours || []).slice(0, 5).map((h) => (
              <li key={h.day} className="flex justify-between gap-4"><span className="text-gray-400">{h.day}</span><span>{h.hours}</span></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-5 text-xs text-gray-500 flex flex-col sm:flex-row justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} {s.name || 'Maison Gourmet'}. All rights reserved.</span>
          <span>Built as a portfolio full-stack CMS demo.</span>
        </div>
      </div>
    </footer>
  );
}
