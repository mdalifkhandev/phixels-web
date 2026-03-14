import { motion } from 'framer-motion';
import { Hero } from '../components/Hero';
import { ServicesGrid } from '../components/ServicesGrid';
import { ProcessSection } from '../components/ProcessSection';
import { PortfolioTeaser } from '../components/PortfolioTeaser';
import { TechStack } from '../components/TechStack';
import { BlogSection } from '../components/BlogSection';
import { Button } from '../components/ui/Button';
import { ProfessionalReviewCarousel } from '../components/ProfessionalReviewCarousel';
import { ArrowRight } from 'lucide-react';
import Mouse from '../components/ui/Mouse';
import { usePageContent } from '../hooks/usePageContent';

export function HomePage() {
  const { getSection } = usePageContent('home');

  const heroSection = getSection('hero', {
    head: 'Transforming Visionary Concepts into Digital Dominance',
    caption: 'Accepting New Enterprise Projects for Q4',
    description: "We build scalable, secure, and future-proof mobile apps for startups and Fortune 500s. From AI integration to blockchain architecture."
  });

  const ctaSection = getSection('cta', {
    head: 'STOP THINKING. START BUILDING.',
    description: "Your billion-dollar idea deserves billion-dollar execution. Let's ship it before your competition does.",
    buttonText: 'Book Free Consultation'
  });

  const servicesSection = getSection('services', {
    head: 'Our Expertise',
    caption: 'End-to-End Solutions',
    description: "We deliver end-to-end digital solutions across the entire technology stack, tailored to your business goals."
  });

  const processSection = getSection('process', {
    head: 'How We Build',
    description: "100% Transparency, Weekly Sprints, Post-Launch Support."
  });

  const portfolioSection = getSection('works', {
    head: 'Featured Work',
    description: "We build award-winning apps that scale. Swipe to explore our recent masterpieces."
  });

  const blogSection = getSection('blog', {
    head: 'Latest Insights',
    description: "Stay updated with the latest trends, tutorials, and insights from our engineering team."
  });

  return <main className="bg-[#050505] min-h-screen">
    <Hero 
      head={heroSection.head}
      caption={heroSection.caption}
      description={heroSection.description}
    />
    <Mouse />
    <ServicesGrid 
      head={servicesSection.head}
      caption={servicesSection.caption}
      description={servicesSection.description}
    />
    <ProcessSection 
      head={processSection.head}
      description={processSection.description}
    />
    <PortfolioTeaser 
      head={portfolioSection.head}
      description={portfolioSection.description}
    />
    <TechStack />
    <BlogSection 
      head={blogSection.head}
      description={blogSection.description}
    />
    <ProfessionalReviewCarousel />
    <section className="py-40 relative overflow-hidden flex items-center justify-center min-h-[80vh]">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[color:var(--bright-red)]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div initial={{
          opacity: 0,
          scale: 0.9
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.8
        }}>
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter leading-none"
              dangerouslySetInnerHTML={{ __html: ctaSection.head.replace('BUILDING.', '<span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400">BUILDING.</span>').replace('THINKING.', '<span class="text-transparent bg-clip-text bg-gradient-to-b from-gray-500 to-gray-800">THINKING.</span>') }}
          />

          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            {ctaSection.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button variant="primary" triggerPopup glow className="text-xl px-12 py-6 rounded-full group">
              <span className="flex items-center gap-3">
                {ctaSection.buttonText}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>

            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span className="w-2 h-2 rounded-full bg-[color:var(--vibrant-green)] animate-pulse" />
              2 slots remaining for this week
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  </main>;
}