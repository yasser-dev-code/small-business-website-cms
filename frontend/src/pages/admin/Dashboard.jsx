import { Link } from 'react-router-dom';
import { Newspaper, FileEdit, Briefcase, UtensilsCrossed, ArrowRight } from 'lucide-react';
import useFetch from '../../hooks/useFetch.js';
import { Spinner, ErrorState, Badge } from '../../components/ui/index.jsx';

export default function Dashboard() {
  const { data, loading, error } = useFetch('/admin/stats');
  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} />;

  const cards = [
    { label: 'Published Articles', value: data.publishedArticles, icon: Newspaper, tone: 'text-green-600 bg-green-50' },
    { label: 'Draft Articles', value: data.draftArticles, icon: FileEdit, tone: 'text-yellow-600 bg-yellow-50' },
    { label: 'Services', value: data.services, icon: Briefcase, tone: 'text-brand-600 bg-brand-50' },
    { label: 'Menu Items', value: data.menuItems, icon: UtensilsCrossed, tone: 'text-blue-600 bg-blue-50' }
  ];

  return (
    <div>
      <h1 className="text-2xl font-serif text-ink-900 mb-1">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">Overview of your website content.</p>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="card p-6">
            <div className={'h-10 w-10 rounded-lg flex items-center justify-center mb-4 ' + c.tone}><c.icon className="h-5 w-5" /></div>
            <p className="text-3xl font-serif text-ink-900">{c.value}</p>
            <p className="text-sm text-gray-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-semibold text-ink-900 mb-4">Recent Activity</h2>
          {data.recentPosts?.length ? (
            <ul className="space-y-3">
              {data.recentPosts.map((p) => (
                <li key={p._id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-gray-700">{p.title}</span>
                  <Badge tone={p.status === 'published' ? 'green' : 'yellow'}>{p.status}</Badge>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-gray-500">No activity yet.</p>}
        </div>
        <div className="card p-6">
          <h2 className="font-semibold text-ink-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[['Homepage', '/admin/homepage'], ['Services', '/admin/services'], ['New Article', '/admin/blog/new'], ['Menu', '/admin/menu'], ['Media', '/admin/media'], ['Settings', '/admin/settings']].map(([label, to]) => (
              <Link key={to} to={to} className="flex items-center justify-between gap-2 border border-gray-200 rounded-lg px-4 py-3 text-sm hover:border-brand-400 hover:text-brand-700 transition-colors">
                {label}<ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
