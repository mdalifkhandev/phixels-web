import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, Share2, User } from "lucide-react";
import { Blog, Author, ServiceCategory } from "../types/api";
import { stripRichText } from "../utils/richText";

interface BlogCardProps {
  post: Blog;
  authors: Author[];
  serviceById: Map<string, ServiceCategory>;
  handleShare: (
    e: React.MouseEvent,
    title: string,
    id: string,
  ) => Promise<void>;
  index?: number;
}

export function BlogCard({
  post,
  authors,
  serviceById,
  handleShare,
  index = 0,
}: BlogCardProps) {
  const navigate = useNavigate();

  const author = authors.find((a) =>
    post.authorId ? a._id === post.authorId : a.name === post.writer,
  );

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.1 }}
      key={post._id}
      className="group bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-[color:var(--bright-red)] transition-all duration-300 flex flex-col"
    >
      <Link
        to={`/blog/${post.slug || post._id}`}
        className="flex-1 flex flex-col"
      >
        <div className="relative aspect-video overflow-hidden bg-gray-800">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-bold border border-white/10">
              {post.categoryName || post.tags[0] || "Article"}
            </span>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10 overflow-hidden flex-shrink-0">
              {author?.profileImage ? (
                <img
                  src={author.profileImage}
                  alt={post.writer}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={16} className="text-gray-400" />
              )}
            </div>
            <div>
              <div className="text-gray-300 text-sm font-medium">
                {post.writer}
              </div>
              {author?.role && (
                <div className="text-gray-500 text-xs">{author.role}</div>
              )}
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-3 group-hover:text-[color:var(--neon-yellow)] transition-colors line-clamp-2">
            {post.title}
          </h2>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
            {stripRichText(post.details)}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {post.readingTime} read
              </span>
            </div>
            <div className="flex items-center gap-3">
              {post.serviceId && serviceById.get(post.serviceId) && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(
                      `/services/${serviceById.get(post.serviceId!)?.slug}`,
                    );
                  }}
                  className="text-[11px] text-[color:var(--neon-yellow)] hover:underline"
                >
                  {serviceById.get(post.serviceId)?.name}
                </button>
              )}
              <button
                onClick={(e) => handleShare(e, post.title, post._id)}
                className="text-gray-500 hover:text-white transition-colors"
                title="Share Article"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
