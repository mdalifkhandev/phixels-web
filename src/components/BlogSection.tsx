import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { BlogCard } from "./BlogCard";
import { apiService } from "../services/api";
import { Blog, ServiceCategory, Author } from "../types/api";
export function BlogSection() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(
    [],
  );

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const [response, categoriesResponse, authorsResponse] =
          await Promise.all([
            apiService.getBlogs(),
            apiService.getServiceCategories(),
            apiService.getAuthors(),
          ]);
        if (response?.success && Array.isArray(response.data)) {
          setPosts(
            response.data.filter((post: Blog) => post.status === "published"),
          );
        }
        if (
          categoriesResponse?.success &&
          Array.isArray(categoriesResponse.data)
        ) {
          setServiceCategories(
            categoriesResponse.data.filter(
              (service: ServiceCategory) => service.isActive !== false,
            ),
          );
        }
        if (authorsResponse?.success && Array.isArray(authorsResponse.data)) {
          setAuthors(authorsResponse.data);
        }
      } catch {
        // Keep UI fallback from static featured posts.
      }
    };
    loadBlogs();
  }, []);

  const handleShare = async (
    e: React.MouseEvent,
    title: string,
    id: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/blog/${id}`;

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

  const serviceById = useMemo(
    () => new Map(serviceCategories.map((service) => [service._id, service])),
    [serviceCategories],
  );

  return (
    <section className="py-24 bg-[#050505]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Latest Insights
            </h2>
            <p className="text-gray-400 max-w-2xl">
              Stay updated with the latest trends, tutorials, and insights from
              our engineering team.
            </p>
          </div>
          <Link
            to="/blog"
            className="hidden md:flex items-center gap-2 text-[color:var(--bright-red)] font-bold hover:gap-4 transition-all group"
          >
            View All Posts{" "}
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post, index) => (
            <BlogCard
              key={post._id}
              post={post}
              authors={authors}
              serviceById={serviceById}
              handleShare={handleShare}
              index={index}
            />
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[color:var(--bright-red)] font-bold hover:gap-4 transition-all"
          >
            View All Posts <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
