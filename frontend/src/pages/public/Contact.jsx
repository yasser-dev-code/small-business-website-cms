import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import useFetch from '../../hooks/useFetch.js';
import { Spinner } from '../../components/ui/index.jsx';
import { Toast } from '../../components/ui/Toast.jsx';

export default function Contact() {
  const { data, loading } = useFetch('/settings');
  const [sent, setSent] = useState(false);

  if (loading) return <Spinner />;
  const s = data || { social: {}, openingHours: [] };

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    e.target.reset();
  };

  return (
    <div className="container-page py-16">
      <div className="text-center mb-12">
        <h1 className="section-title">Contact Us</h1>
        <p className="text-gray-600 mt-2">We would love to hear from you. Reserve a table or send a message.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div className="space-y-6">
          <div className="flex gap-4"><MapPin className="h-6 w-6 text-brand-600 flex-shrink-0" /><div><h3 className="font-semibold">Address</h3><p className="text-gray-600 text-sm">{s.address}</p></div></div>
          <div className="flex gap-4"><Phone className="h-6 w-6 text-brand-600 flex-shrink-0" /><div><h3 className="font-semibold">Phone</h3><p className="text-gray-600 text-sm">{s.phone}</p></div></div>
          <div className="flex gap-4"><Mail className="h-6 w-6 text-brand-600 flex-shrink-0" /><div><h3 className="font-semibold">Email</h3><p className="text-gray-600 text-sm">{s.email}</p></div></div>
          <div className="flex gap-4"><Clock className="h-6 w-6 text-brand-600 flex-shrink-0" /><div><h3 className="font-semibold mb-2">Opening Hours</h3>
            <ul className="text-sm text-gray-600 space-y-1">{(s.openingHours || []).map((h) => <li key={h.day} className="flex justify-between gap-6 max-w-xs"><span>{h.day}</span><span>{h.hours}</span></li>)}</ul>
          </div></div>
        </div>
        <form onSubmit={onSubmit} className="card p-8 space-y-4">
          <div><label className="label">Name</label><input required className="input" name="name" placeholder="Your name" /></div>
          <div><label className="label">Email</label><input required type="email" className="input" name="email" placeholder="you@example.com" /></div>
          <div><label className="label">Message</label><textarea required rows="5" className="input" name="message" placeholder="How can we help?"></textarea></div>
          <button type="submit" className="btn-primary w-full"><Send className="h-4 w-4" /> Send Message</button>
        </form>
      </div>
      <Toast toast={sent ? { type: 'success', message: 'Thanks! Your message has been received.' } : null} onClose={() => setSent(false)} />
    </div>
  );
}
