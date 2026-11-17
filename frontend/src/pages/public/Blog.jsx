import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import useFetch from '../../hooks/useFetch.js';
import { resolveImage } from '../../api/client.js';
import { Spinner, ErrorState, EmptyState } from '../../components/ui/index.jsx';

export default function Blog() {
  const { data, loading, error } = useFetch('/blog');
  return (
    <div className="container-page py-16">
      <div className="text-center mb-12">
        <h1 className="section-title">Our Blog</h1>
        <p className="text-gray-600 mt-2">Stories, recipes and news from our kitchen.</p>
      </div>
      {loading && <Spinner />}
      {error && <ErrorState message={error} />}
      {data && data.length === 0 && <EmptyState title="No articles published yet" />}
      {data && data.length > 0 && (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data.map((p) => (
            <Link key={p._id} to={'/blog/' + p.slug} className="card group flex flex-col">
              <div className="h-48 overflow-hidden">
                <img src={resolveImage(p.featuredImage)} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(p.publishedAt || p.createdAt).toLocaleDateString()}
                </div>
                <h3 className="font-serif text-lg mb-2 group-hover:text-brand-600">{p.title}</h3>
                <p className="text-gray-600 text-sm flex-1">{p.excerpt}</p>
                <span className="text-brand-600 text-sm font-medium mt-4">Read article &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
