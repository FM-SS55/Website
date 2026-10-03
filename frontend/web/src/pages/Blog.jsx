import { useFetch } from '@shared/hooks';
import { Loader } from '@shared/components';
import { api } from '../services/api.js';
import usePageTitle from '../utils/usePageTitle.js';
import PageHero from '../components/PageHero.jsx';
import BlogCard from '../components/BlogCard.jsx';

export default function Blog() {
  usePageTitle('Blog');
  const { data: posts, loading, error } = useFetch(api.posts);
  return (
    <>
      <PageHero title="Insights on Facility Management" crumbs={[['Blog']]} />
      <section className="section">
        <div className="container">
          {loading || error ? <Loader error={error} /> : posts.length ? (
            <div className="blog-grid">{posts.map((p) => <BlogCard key={p.id} post={p} />)}</div>
          ) : <p className="section-desc">No blog posts published yet — check back soon.</p>}
        </div>
      </section>
    </>
  );
}