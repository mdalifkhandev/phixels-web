import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Clock, Share2, ArrowLeft, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';
import { Blog, ServiceCategory } from '../types/api';
import { renderRichTextToHtml } from '../utils/richText';

export function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const slugResponse = await apiService.getBlogBySlug(id);
        const categoriesResponse = await apiService.getServiceCategories();
        const categories: ServiceCategory[] =
          categoriesResponse?.success && Array.isArray(categoriesResponse.data)
            ? categoriesResponse.data
            : [];
        if (slugResponse.success && slugResponse.data) {
          if (slugResponse.data.status !== 'published') {
            setError('Blog not found');
            return;
          }
          setBlog(slugResponse.data);
          if (slugResponse.data.serviceId) {
            setServiceCategory(
              categories.find((category) => category._id === slugResponse.data.serviceId) || null,
            );
          } else {
            setServiceCategory(null);
          }
        } else {
          const response = await apiService.getBlogById(id);
          if (response.success) {
            if (response.data.status !== 'published') {
              setError('Blog not found');
              return;
            }
            setBlog(response.data);
            if (response.data.serviceId) {
              setServiceCategory(
                categories.find((category) => category._id === response.data.serviceId) || null,
              );
            } else {
              setServiceCategory(null);
            }
          } else {
            setError(response.message || 'Blog not found');
          }
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching the blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[color:var(--bright-red)] animate-spin" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-white mb-4">{error || 'Blog not found'}</h2>
        <Link to="/blog" className="flex items-center gap-2 text-[color:var(--bright-red)] hover:underline">
          <ArrowLeft size={20} /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-[#050505] min-h-screen pt-48 pb-20">
      <article className="container mx-auto px-4 max-w-4xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to Blog
        </Link>

        <header className="mb-12 text-center">
          <div className="inline-block px-4 py-1 rounded-full bg-[color:var(--bright-red)]/10 text-[color:var(--bright-red)] text-sm font-bold mb-6">
            {blog.categoryName || (Array.isArray(blog.tags) ? blog.tags[0] : 'Technology')}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 capitalize leading-tight">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <User size={16} /> {blog.writer}
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} /> {new Date(blog.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} /> {blog.readingTime} read
            </div>
            {serviceCategory && (
              <Link
                to={`/services/${serviceCategory.slug}`}
                className="text-[color:var(--neon-yellow)] hover:underline"
              >
                {serviceCategory.name}
              </Link>
            )}
          </div>
        </header>

        <div className="aspect-video rounded-2xl overflow-hidden mb-12">
          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        </div>

        <div
          className="prose prose-invert prose-lg max-w-none [&_span]:text-inherit"
          dangerouslySetInnerHTML={{ __html: renderRichTextToHtml(blog.details) }}
        />

        <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
          <div className="text-white font-bold">Share this article:</div>
          <div className="flex gap-4">
            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </article>
    </main>
  );
}
