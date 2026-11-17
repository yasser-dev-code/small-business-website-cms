import useFetch from '../../hooks/useFetch.js';
import { resolveImage } from '../../api/client.js';
import { Spinner, ErrorState, EmptyState } from '../../components/ui/index.jsx';

export default function Services() {
  const { data, loading, error } = useFetch('/services');
  return (
    <div className="container-page py-16">
      <div className="text-center mb-12">
        <h1 className="section-title">Our Services</h1>
        <p className="text-gray-600 mt-2">Tailored experiences for every occasion.</p>
      </div>
      {loading && <Spinner />}
      {error && <ErrorState message={error} />}
      {data && data.length === 0 && <EmptyState title="No services published yet" />}
      {data && data.length > 0 && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((s) => (
            <div key={s._id} className="card group">
              <div className="h-52 overflow-hidden">
                <img src={resolveImage(s.image)} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
