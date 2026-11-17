import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';
import useFetch from '../../hooks/useFetch.js';
import { resolveImage } from '../../api/client.js';
import { Spinner, ErrorState } from '../../components/ui/index.jsx';

export default function BlogDetail() {
  const { slug } = useParams();
  const { data: post, loading, error } = useFetch('/blog/' + slug);

  if (loading) return <Spinner />;
  if (error) return <div className="container-page"><ErrorState message={error} /></div>;
  if (!post) return null;

  useEffectTitle(post);

  return (
    <article className="container-page py-16 max-w-3xl">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-brand-600 mb-6"><ArrowLeft className="h-4 w-4" /> Back to blog</Link>
      <h1 className="text-3xl sm:text-5xl font-serif text-ink-900 mb-4">{post.title}</h1>
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
        <span>By {post.author}</span>
      </div>
      {post.featuredImage && <img src={resolveImage(post.featuredImage)} alt={post.title} className="w-full h-80 object-cover rounded-2xl mb-10" />}
      <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">{post.content}</div>
      {post.tags?.length > 0 && (
        <div className="flex gap-2 mt-10">{post.tags.map((t) => <span key={t} className="badge bg-brand-50 text-brand-700">#{t}</span>)}</div>
      )}
    </article>
  );
}

function useEffectTitle(post) {
  if (typeof document !== 'undefined' && post?.seo?.title) document.title = post.seo.title;
}
