import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Scale, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { apiService } from "../services/api";
import { LegalContent } from "../types/api";

import { usePageContent } from "../hooks/usePageContent";

export function TermsPage() {
  const { getSection } = usePageContent('terms');

  const heroSection = getSection('hero', {
    head: 'Terms & <span class="text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--bright-red)] to-[color:var(--neon-yellow)]">Conditions</span>',
    caption: 'Legal Agreement',
    description: "Welcome to Phixels! These terms outline the rules and regulations for using our services."
  });

  const [content, setContent] = useState<LegalContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await apiService.getLegalContent();
        if (response.success) {
          setContent(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch terms & conditions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  return (
    <main className="bg-[#050505] min-h-screen pt-40 pb-20">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[color:var(--deep-navy)] rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[color:var(--neon-yellow)] rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-pulse"
          style={{
            animationDelay: "1s",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Scale className="w-4 h-4 text-[color:var(--neon-yellow)]" />
            <span className="text-sm text-gray-300">{heroSection.caption}</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-bold mb-6"
              dangerouslySetInnerHTML={{ __html: heroSection.head }}
          />
          <p className="text-xl text-gray-400 max-w-2xl mx-auto"
             dangerouslySetInnerHTML={{ __html: heroSection.description }}
          />
        </motion.div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-[color:var(--bright-red)]" />
              <p>Loading terms & conditions...</p>
            </div>
          ) : content?.termsConditions && content.termsConditions.length > 0 ? (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
              }}
              className="space-y-12"
            >
              {content.termsConditions.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[color:var(--neon-yellow)]/30 transition-colors">
                      <span className="text-xl font-bold text-[color:var(--neon-yellow)]">
                        {index + 1}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                      {section.title}
                    </h2>
                  </div>
                  <div className="p-8 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/[0.07] transition-all">
                    <div
                      className="text-gray-300 leading-relaxed rich-text-content"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </div>
                </motion.div>
              ))}

              {/* Contact Card */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                className="p-8 rounded-2xl bg-gradient-to-br from-[color:var(--bright-red)]/10 to-transparent border border-white/10 text-center mt-20"
              >
                <h3 className="text-2xl font-bold text-white mb-4">
                  Questions About Our Terms?
                </h3>
                <p className="text-gray-400 mb-6">
                  If you have any questions about these Terms & Conditions,
                  please contact us.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[color:var(--bright-red)] text-white font-bold hover:bg-[color:var(--bright-red)]/90 transition-colors"
                >
                  Contact Us <ArrowRight size={18} />
                </Link>
              </motion.div>

              {content.updatedAt && (
                <div className="text-center text-sm text-gray-500 pt-8 border-t border-white/10">
                  Last Updated:{" "}
                  {new Date(content.updatedAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            /* Fallback static content/message */
            <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
              <Scale className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">
                Terms Currently Updating
              </h3>
              <p className="text-gray-400">
                Please check back soon or contact us for details.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
