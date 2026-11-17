import { useMemo, useState } from 'react';
import useFetch from '../../hooks/useFetch.js';
import { resolveImage } from '../../api/client.js';
import { Spinner, ErrorState, EmptyState } from '../../components/ui/index.jsx';

export default function Menu() {
  const { data, loading, error } = useFetch('/menu');
  const [active, setActive] = useState('All');

  const categories = useMemo(() => {
    if (!data) return ['All'];
    return ['All', ...Array.from(new Set(data.map((m) => m.category)))];
  }, [data]);

  const items = useMemo(() => {
    if (!data) return [];
    return active === 'All' ? data : data.filter((m) => m.category === active);
  }, [data, active]);

  return (
    <div className="container-page py-16">
      <div className="text-center mb-10">
        <h1 className="section-title">Our Menu</h1>
        <p className="text-gray-600 mt-2">Seasonal French cuisine, made fresh daily.</p>
      </div>
      {loading && <Spinner />}
      {error && <ErrorState message={error} />}
      {data && (
        <>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((c) => (
              <button key={c} onClick={() => setActive(c)}
                className={'px-5 py-2 rounded-full text-sm border transition-colors ' + (active === c ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-300 text-gray-700 hover:border-brand-400')}>
                {c}
              </button>
            ))}
          </div>
          {items.length === 0 ? <EmptyState title="No items in this category" /> : (
            <div className="grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
              {items.map((m) => (
                <div key={m._id} className="flex gap-4">
                  <img src={resolveImage(m.image)} alt={m.name} className="h-24 w-24 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline gap-3 border-b border-dashed border-gray-200 pb-1">
                      <h3 className="font-serif text-lg">{m.name}</h3>
                      <span className="text-brand-600 font-semibold whitespace-nowrap">{m.price} EUR</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-2">{m.description}</p>
                    <span className="badge bg-brand-50 text-brand-700 mt-2">{m.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
