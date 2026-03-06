import { useEffect, useState, useMemo } from "react";
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
import { BlogCard } from "../components/BlogCard";
import { AnimatePresence } from "framer-motion";

export function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derived Values - Hooks must always be at the top level
  const serviceById = useMemo(
    () => new Map(serviceCategories.map((s) => [s._id, s])),
    [serviceCategories],
  );

  const serviceCategory = useMemo(() => {
    if (!blog?.serviceId) return null;
    return serviceById.get(blog.serviceId) || null;
  }, [blog, serviceById]);

  const author = useMemo(() => {
    if (!blog) return null;
    return (
      authors.find((a) =>
        blog.authorId ? a._id === blog.authorId : a.name === blog.writer,
      ) || null
    );
  }, [blog, authors]);

  const relatedBlogs = useMemo(() => {
    if (!blog || allBlogs.length === 0) return [];

    // 1. Same category or service
    const related = allBlogs.filter(
      (b) =>
        b._id !== blog._id &&
        ((blog.serviceId && b.serviceId === blog.serviceId) ||
          (blog.categoryName && b.categoryName === blog.categoryName)),
    );

    let displayed = related.slice(0, 3);

    // 2. Fallback to latest (top positioned) if < 3
    if (displayed.length < 3) {
      const others = allBlogs
        .filter(
          (b) => b._id !== blog._id && !displayed.find((d) => d._id === b._id),
        )
        .slice(0, 3 - displayed.length);
      displayed = [...displayed, ...others];
    }

    return displayed;
  }, [blog, allBlogs]);

  useEffect(() => {
    const fetchBlogData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);

        // 1. Try to fetch the main blog by slug first
        let mainBlog: Blog | null = null;
        try {
          const slugResponse = await apiService.getBlogBySlug(id);
          if (slugResponse.success && slugResponse.data) {
            mainBlog = slugResponse.data;
          }
        } catch (err) {
          // Slug lookup failed, which is expected if 'id' is a real MongoDB ID
          console.log("Slug lookup failed, trying ID...");
        }

        // 2. If slug fetch failed or returned nothing, try by ID
        if (!mainBlog) {
          try {
            const idResponse = await apiService.getBlogById(id);
            if (idResponse.success && idResponse.data) {
              mainBlog = idResponse.data;
            }
          } catch (err) {
            console.error("ID lookup also failed:", err);
          }
        }

        if (!mainBlog) {
          setError("Blog not found");
          setLoading(false);
          return;
        }

        // 3. We have the blog! Check status
        if (mainBlog.status !== "published") {
          setError("Blog not found");
          setLoading(false);
          return;
        }

        setBlog(mainBlog);

        // 4. Fetch related data in parallel without blocking the main content display
        try {
          const [blogsResponse, categoriesResponse, authorsResponse] =
            await Promise.all([
              apiService.getBlogs().catch(() => null),
              apiService.getServiceCategories().catch(() => null),
              apiService.getAuthors().catch(() => null),
            ]);

          if (
            categoriesResponse?.success &&
            Array.isArray(categoriesResponse.data)
          ) {
            setServiceCategories(categoriesResponse.data);
          }

          if (authorsResponse?.success && Array.isArray(authorsResponse.data)) {
            setAuthors(authorsResponse.data);
          }

          if (blogsResponse?.success && Array.isArray(blogsResponse.data)) {
            setAllBlogs(
              blogsResponse.data.filter((b: Blog) => b.status === "published"),
            );
          }
        } catch (err) {
          console.error("Error fetching secondary data:", err);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching the blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
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

  const handleShare = async (
    e?: React.MouseEvent,
    shareTitle?: string,
    shareId?: string,
  ) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!blog && !shareId) return;

    const url = shareId
      ? `${window.location.origin}/blog/${shareId}`
      : window.location.href;
    const title = shareTitle || blog?.title || "";

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
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
              onClick={(e) => handleShare(e)}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
              title="Share Article"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </article>

      {relatedBlogs.length > 0 && (
        <section className="container mx-auto px-4 py-20 mt-20 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-10">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {relatedBlogs.map((post, index) => (
                  <BlogCard
                    key={post._id}
                    post={post}
                    authors={authors}
                    serviceById={serviceById}
                    handleShare={handleShare}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
