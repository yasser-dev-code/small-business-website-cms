import useFetch from '../../hooks/useFetch.js';
import { resolveImage } from '../../api/client.js';
import { Spinner, ErrorState } from '../../components/ui/index.jsx';

export default function About() {
  const { data, loading, error } = useFetch('/settings');
  if (loading) return <Spinner />;
  if (error) return <div className="container-page"><ErrorState message={error} /></div>;
  const s = data;

  return (
    <div className="container-page py-16">
      <div className="text-center mb-12">
        <h1 className="section-title">{s.aboutTitle || 'About Us'}</h1>
      </div>
      <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img src={resolveImage(s.aboutImage)} alt={s.name} className="w-full h-80 object-cover" />
        </div>
        <div>
          <p className="text-gray-600 leading-relaxed text-lg">{s.aboutText}</p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-brand-50 rounded-xl"><p className="text-2xl font-serif text-brand-700">20+</p><p className="text-xs text-gray-500">Years</p></div>
            <div className="p-4 bg-brand-50 rounded-xl"><p className="text-2xl font-serif text-brand-700">40+</p><p className="text-xs text-gray-500">Dishes</p></div>
            <div className="p-4 bg-brand-50 rounded-xl"><p className="text-2xl font-serif text-brand-700">4.9</p><p className="text-xs text-gray-500">Rating</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
