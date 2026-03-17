import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { apiService } from '../services/api';
import { Review } from '../types/api';

export function ReviewCarousel() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiService.getReviews();
        if (response.success) {
          setReviews(response.data || []);
        }
      } catch (error) {
        console.error('Failed to load reviews', error);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    if (!autoplay || reviews.length === 0) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [autoplay, reviews.length]);

  const next = () => {
    if (reviews.length === 0) return;
    setAutoplay(false);
    setCurrent(prev => (prev + 1) % reviews.length);
  };
  const prev = () => {
    if (reviews.length === 0) return;
    setAutoplay(false);
    setCurrent(prev => (prev - 1 + reviews.length) % reviews.length);
  };

  if (reviews.length === 0) {
    return null;
  }

  return <div className="relative bg-white/5 rounded-2xl p-6 border border-white/10">
    <div className="absolute top-4 right-4 text-white/10">
      <Quote size={40} />
    </div>

    <div className="relative h-[220px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -20
        }} transition={{
          duration: 0.3
        }} className="h-full flex flex-col justify-between">
          <div>
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < reviews[current].rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"} />)}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed italic mb-6">
              "{reviews[current].review}"
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-r from-[color:var(--bright-red)] to-[color:var(--deep-navy)]">
                <img src={reviews[current].image} alt={reviews[current].name} className="w-full h-full rounded-full object-cover border-2 border-black" />
              </div>
            </div>
            <div>
              <div className="text-white font-bold text-sm">
                {reviews[current].name}
              </div>
              <div className="text-[color:var(--bright-red)] text-xs font-medium">
                {reviews[current].role}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>

    {/* Controls */}
    <div className="flex justify-end gap-2 mt-4">
      <button onClick={prev} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
        <ChevronLeft size={16} />
      </button>
      <button onClick={next} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
        <ChevronRight size={16} />
      </button>
    </div>
  </div>;
}
