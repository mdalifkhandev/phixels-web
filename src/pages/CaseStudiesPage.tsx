import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart, Loader2 } from "lucide-react";
import { apiService } from "../services/api";
import { CaseStudy } from "../types/api";

import { usePageContent } from "../hooks/usePageContent";

export function CaseStudiesPage() {
  const { getSection } = usePageContent('works');

  const heroSection = getSection('hero', {
    head: 'Case Studies',
    description: "Deep dives into how we solve complex problems and drive measurable business results."
  });

  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [casesRes, catsRes] = await Promise.all([
          apiService.getCaseStudies(),
          apiService.getServiceCategories(),
        ]);
        if (casesRes.success) {
          setCases(casesRes.data);
        } else {
          setError(casesRes.message || "Failed to fetch case studies");
        }
        if (catsRes.success && Array.isArray(catsRes.data)) {
          const map: Record<string, string> = {};
          for (const cat of catsRes.data) {
            map[cat._id] = cat.name;
          }
          setCategoryMap(map);
        }
      } catch (err: any) {
        setError(
          err.message || "An error occurred while fetching case studies",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Resolve a stored value (ID or plain name) to a display name
  const resolveName = (value: string) => categoryMap[value] ?? value;

  const industryIds = ["All", ...new Set(cases.map((c) => c.category))];
  const filtered =
    filter === "All" ? cases : cases.filter((c) => c.category === filter);

  return (
    <main className="bg-[#050505] min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6"
              dangerouslySetInnerHTML={{ __html: heroSection.head }}
          />
          <p className="text-xl text-gray-400 max-w-2xl mx-auto"
             dangerouslySetInnerHTML={{ __html: heroSection.description }}
          />
        </div>

        {/* Filter */}
        {!loading && !error && (
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {industryIds.map((id: string) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={`px-4 py-2 rounded-full text-sm border transition-all ${filter === id ? "bg-[color:var(--vibrant-green)] text-black border-[color:var(--vibrant-green)]" : "bg-transparent text-gray-400 border-white/20 hover:border-white"}`}
              >
                {id === "All" ? "All" : resolveName(id)}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[color:var(--vibrant-green)] animate-spin mb-4" />
            <p className="text-gray-400">Loading case studies...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 bg-red-500/10 rounded-2xl border border-red-500/20">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12">
            {filtered.map((study) => (
              <motion.div
                key={study._id}
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
                className="bg-white/5 rounded-3xl overflow-hidden border border-white/10 hover:border-[color:var(--vibrant-green)] transition-colors group"
              >
                <Link
                  to={`/case-studies/${study._id}`}
                  className="flex flex-col lg:flex-row"
                >
                  <div className="lg:w-1/2 relative overflow-hidden bg-gray-800 lg:order-first">
                    <img
                      src={study.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80"}
                      alt={study.title}
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute top-6 left-6">
                      <span className="px-3 py-1 rounded-full bg-[color:var(--vibrant-green)] text-black text-xs font-bold shadow-lg">
                        {resolveName(study.category)}
                      </span>
                    </div>
                  </div>

                  <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-[color:var(--vibrant-green)] transition-colors line-clamp-2">
                      {study.title}
                    </h2>
                    <p className="text-gray-400 text-sm mb-2">
                      Client:{" "}
                      <span className="text-white font-semibold">
                        {study.client}
                      </span>
                    </p>

                    <div className="space-y-4 my-6">
                      <div>
                        <h3 className="text-gray-400 text-xs uppercase font-bold mb-1">
                          Challenge
                        </h3>
                        <div 
                          className="text-gray-300 text-sm line-clamp-3 leading-6 prose prose-invert prose-p:my-0 prose-headings:my-0 prose-ol:my-0 prose-ul:my-0"
                          dangerouslySetInnerHTML={{ __html: study.challenge || "" }}
                        />
                      </div>
                      <div>
                        <h3 className="text-gray-400 text-xs uppercase font-bold mb-1">
                          Solution
                        </h3>
                        <div 
                          className="text-gray-300 text-sm line-clamp-3 leading-6 prose prose-invert prose-p:my-0 prose-headings:my-0 prose-ol:my-0 prose-ul:my-0"
                          dangerouslySetInnerHTML={{ __html: study.solution || "" }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                      <div className="flex items-start gap-3 min-w-0">
                        <BarChart
                          className="text-[color:var(--vibrant-green)]"
                          size={24}
                        />
                        <div className="min-w-0">
                          <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                            Result
                          </div>
                          <div 
                            className="text-base font-semibold text-white line-clamp-3 leading-6 prose prose-invert prose-p:my-0 prose-headings:my-0 prose-ol:my-0 prose-ul:my-0"
                            dangerouslySetInnerHTML={{ __html: study.result || "" }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[color:var(--vibrant-green)] font-bold group-hover:gap-4 transition-all shrink-0">
                        Read Full Story{" "}
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            {filtered.length === 0 && !loading && (
              <div className="text-center py-20 text-gray-500">
                No case studies found for this industry.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
