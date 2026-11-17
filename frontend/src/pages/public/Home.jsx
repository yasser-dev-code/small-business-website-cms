import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Phone, Mail } from 'lucide-react';
import useFetch from '../../hooks/useFetch.js';
import { resolveImage } from '../../api/client.js';
import { Spinner, ErrorState } from '../../components/ui/index.jsx';

export default function Home() {
  const { data: home, loading, error } = useFetch('/homepage');
  const { data: services } = useFetch('/services');
  const { data: menu } = useFetch('/menu');
  const { data: posts } = useFetch('/blog');
  const { data: settings } = useFetch('/settings');

  if (loading) return <Spinner />;
  if (error) return <div className="container-page"><ErrorState message={error} /></div>;

  const featuredServices = (services || []).filter((s) => s.featured).slice(0, 3);
  const featuredMenu = (menu || []).filter((m) => m.featured).slice(0, 4);
  const latestPosts = (posts || []).slice(0, 3);

  return (
    <div>
      <section className="relative h-[80vh] min-h-[520px] flex items-center justify-center text-center">
        <img src={resolveImage(home.heroImage)} alt="Maison Gourmet" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative container-page text-white animate-fade-up">
          <p className="uppercase tracking-[0.3em] text-brand-300 text-sm mb-4">Fine French Dining</p>
          <h1 className="text-4xl sm:text-6xl font-serif mb-4">{home.headline}</h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mb-8">{home.subtitle}</p>
          {home.ctaText && (
            <Link to={home.ctaLink || '/menu'} className="btn-primary">
              {home.ctaText} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>

      <section className="container-page py-20 text-center max-w-3xl">
        <h2 className="section-title mb-5">{home.introTitle}</h2>
        <p className="text-gray-600 leading-relaxed text-lg">{home.introText}</p>
      </section>

      {featuredServices.length > 0 && (
        <section className="bg-brand-50 py-20">
          <div className="container-page">
            <div className="text-center mb-12">
              <h2 className="section-title">Our Services</h2>
              <p className="text-gray-600 mt-2">Everything we do, crafted for memorable occasions.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {featuredServices.map((s) => (
                <div key={s._id} className="card group">
                  <div className="h-48 overflow-hidden">
                    <img src={resolveImage(s.image)} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif mb-2">{s.title}</h3>
                    <p className="text-gray-600 text-sm">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {featuredMenu.length > 0 && (
        <section className="container-page py-20">
          <div className="text-center mb-12">
            <h2 className="section-title">Signature Dishes</h2>
            <p className="text-gray-600 mt-2">A taste of our seasonal carte.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredMenu.map((m) => (
              <div key={m._id} className="card">
                <div className="h-40 overflow-hidden">
                  <img src={resolveImage(m.image)} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-baseline gap-2">
                    <h3 className="font-serif text-lg">{m.name}</h3>
                    <span className="text-brand-600 font-semibold">{m.price} EUR</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10"><Link to="/menu" className="btn-outline">View Full Menu</Link></div>
        </section>
      )}

      {latestPosts.length > 0 && (
        <section className="bg-brand-50 py-20">
          <div className="container-page">
            <div className="text-center mb-12">
              <h2 className="section-title">From Our Blog</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {latestPosts.map((p) => (
                <Link key={p._id} to={'/blog/' + p.slug} className="card group">
                  <div className="h-44 overflow-hidden">
                    <img src={resolveImage(p.featuredImage)} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-lg mb-2 group-hover:text-brand-600">{p.title}</h3>
                    <p className="text-gray-600 text-sm">{p.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-page py-20">
        <div className="grid gap-6 sm:grid-cols-3 text-center">
          <div><MapPin className="h-6 w-6 text-brand-600 mx-auto mb-2" /><p className="text-gray-600 text-sm">{settings?.address}</p></div>
          <div><Phone className="h-6 w-6 text-brand-600 mx-auto mb-2" /><p className="text-gray-600 text-sm">{settings?.phone}</p></div>
          <div><Mail className="h-6 w-6 text-brand-600 mx-auto mb-2" /><p className="text-gray-600 text-sm">{settings?.email}</p></div>
        </div>
      </section>
    </div>
  );
}
