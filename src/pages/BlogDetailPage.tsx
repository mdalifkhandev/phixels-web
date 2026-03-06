import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  User,
  Clock,
  Share2,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { apiService } from "../services/api";
import { Blog, ServiceCategory, Author } from "../types/api";
import { renderRichTextToHtml } from "../utils/richText";

export function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [serviceCategory, setServiceCategory] =
    useState<ServiceCategory | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    0;
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

        const authorsResponse = await apiService.getAuthors();
        const authors: Author[] =
          authorsResponse?.success && Array.isArray(authorsResponse.data)
            ? authorsResponse.data
            : [];
        if (slugResponse.success && slugResponse.data) {
          if (slugResponse.data.status !== "published") {
            setError("Blog not found");
            return;
          }
          setBlog(slugResponse.data);

          if (authors.length > 0) {
            const foundAuthor = authors.find((a) =>
              slugResponse.data.authorId
                ? a._id === slugResponse.data.authorId
                : a.name === slugResponse.data.writer,
            );
            if (foundAuthor) setAuthor(foundAuthor);
          }

          if (slugResponse.data.serviceId) {
            setServiceCategory(
              categories.find(
                (category) => category._id === slugResponse.data.serviceId,
              ) || null,
            );
          } else {
            setServiceCategory(null);
          }
        } else {
          const response = await apiService.getBlogById(id);
          if (response.success) {
            if (response.data.status !== "published") {
              setError("Blog not found");
              return;
            }
            setBlog(response.data);

            if (authors.length > 0) {
              const foundAuthor = authors.find((a) =>
                response.data.authorId
                  ? a._id === response.data.authorId
                  : a.name === response.data.writer,
              );
              if (foundAuthor) setAuthor(foundAuthor);
            }

            if (response.data.serviceId) {
              setServiceCategory(
                categories.find(
                  (category) => category._id === response.data.serviceId,
                ) || null,
              );
            } else {
              setServiceCategory(null);
            }
          } else {
            setError(response.message || "Blog not found");
          }
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching the blog");
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
        <h2 className="text-2xl font-bold text-white mb-4">
          {error || "Blog not found"}
        </h2>
        <Link
          to="/blog"
          className="flex items-center gap-2 text-[color:var(--bright-red)] hover:underline"
        >
          <ArrowLeft size={20} /> Back to Blog
        </Link>
      </div>
    );
  }

  const handleShare = async () => {
    if (!blog) return;
    const url = window.location.href;
    const title = blog.title;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        // We could add a toast here if available, but staying consistent with BlogPage.tsx
      } catch (err) {
        console.error("Error copying to clipboard:", err);
      }
    }
  };

  return (
    <main className="bg-[#050505] min-h-screen pt-48 pb-20">
      <article className="container mx-auto px-4 max-w-4xl">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Blog
        </Link>

        <header className="mb-12 text-center">
          <div className="inline-block px-4 py-1 rounded-full bg-[color:var(--bright-red)]/10 text-[color:var(--bright-red)] text-sm font-bold mb-6">
            {blog.categoryName ||
              (Array.isArray(blog.tags) ? blog.tags[0] : "Technology")}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 capitalize leading-tight">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-3">
              {author?.profileImage ? (
                <img
                  src={author.profileImage}
                  alt={blog.writer}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User size={18} />
              )}
              <div>
                <div className="text-white font-medium">{blog.writer}</div>
                {author?.role && (
                  <div className="text-gray-500 text-xs text-left">
                    {author.role}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />{" "}
              {new Date(blog.createdAt).toLocaleDateString()}
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
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div
          className={[
            // base
            "text-gray-300 text-base leading-7",
            // headings
            "[&_h1]:text-4xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:leading-tight",
            "[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-7 [&_h2]:mb-3",
            "[&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-3",
            "[&_h4]:text-xl [&_h4]:font-semibold [&_h4]:text-white [&_h4]:mt-5 [&_h4]:mb-2",
            // paragraph
            "[&_p]:mb-4 [&_p]:leading-7",
            // lists
            "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4",
            "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4",
            "[&_li]:mb-1 [&_li]:leading-7",
            // blockquote
            "[&_blockquote]:border-l-4 [&_blockquote]:border-[color:var(--bright-red)] [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-gray-400 [&_blockquote]:my-6",
            // inline code
            "[&_:not(pre)>code]:bg-white/10 [&_:not(pre)>code]:text-pink-300 [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:rounded [&_:not(pre)>code]:text-sm [&_:not(pre)>code]:font-mono",
            // code block
            "[&_pre]:bg-[#0a0a0a] [&_pre]:border [&_pre]:border-white/10 [&_pre]:rounded-xl [&_pre]:p-5 [&_pre]:my-6 [&_pre]:overflow-x-auto",
            "[&_pre_code]:bg-transparent [&_pre_code]:text-green-300 [&_pre_code]:p-0 [&_pre_code]:text-sm",
            // horizontal rule
            "[&_hr]:border-white/10 [&_hr]:my-8",
            // images
            "[&_img]:rounded-xl [&_img]:max-w-full [&_img]:my-6 [&_img]:mx-auto [&_img]:block [&_img]:shadow-xl",
            // links
            "[&_a]:text-blue-400 [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-blue-300 [&_a]:transition-colors",
            // inline text styles
            "[&_strong]:text-white [&_strong]:font-bold",
            "[&_em]:italic",
            "[&_u]:underline",
            "[&_s]:line-through",
            // text align
            "[&_.text-left]:text-left [&_.text-center]:text-center [&_.text-right]:text-right",
          ].join(" ")}
          dangerouslySetInnerHTML={{
            __html: renderRichTextToHtml(blog.details),
          }}
        />

        <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
          <div className="text-white font-bold">Share this article:</div>
          <div className="flex gap-4">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
              title="Share Article"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </article>
    </main>
  );
}
