import { Link } from 'react-router-dom';
import { formatDate } from '@shared/utils';

export default function BlogCard({ post }) {
  const imgStyle = post.image_url ? { backgroundImage: `url('${post.image_url}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined;
  return (
    <Link to={`/blog/${post.slug}`} className="blog-card">
      <div className="blog-card__img" style={imgStyle} />
      <div className="blog-card__body">
        <div className="blog-card__date">{formatDate(post.published_at)}</div>
        <h3 className="blog-card__title">{post.title}</h3>
        <p className="blog-card__excerpt">{post.excerpt}</p>
      </div>
    </Link>
  );
}