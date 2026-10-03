import { Link, useParams } from 'react-router-dom';
import { useFetch } from '@shared/hooks';
import { Loader } from '@shared/components';
import { formatDate } from '@shared/utils';
import { api } from '../services/api.js';
import usePageTitle from '../utils/usePageTitle.js';
import PageHero from '../components/PageHero.jsx';
import NotFound from './NotFound.jsx';

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, loading, error } = useFetch(() => api.post(slug), [slug]);
  usePageTitle(post?.title);

  if (loading) return <Loader />;
  if (error) return error.status === 404 ? <NotFound /> : <Loader error={error} />;

  return (
    <>
      <PageHero title={post.title} crumbs={[['Blog', '/blog'], [post.title]]}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, opacity: 0.85, marginTop: 10 }}>{formatDate(post.published_at)}</p>
      </PageHero>
      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          {post.image_url && <img src={post.image_url} alt={post.title} style={{ borderRadius: 10, marginBottom: 34, width: '100%' }} />}
          {/* Rendered as plain text (React-escaped), line breaks preserved */}
          <div style={{ fontSize: 16, color: 'var(--ink)', whiteSpace: 'pre-line' }}>{post.body}</div>
          <div style={{ marginTop: 46, paddingTop: 26, borderTop: '1px solid var(--line)' }}>
            <Link to="/blog" className="btn btn-outline" style={{ color: 'var(--ink)', borderColor: 'var(--ink)' }}>← Back to Blog</Link>
          </div>
        </div>
      </section>
    </>
  );
}