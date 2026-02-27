import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Smartphone, Globe, Cpu, Palette, BarChart, Shield, Cloud, Zap, Blocks, Building2, Brain } from 'lucide-react';
import { apiService } from '../services/api';
import { ServiceMenuCategory } from '../types/api';

const iconMap: Record<string, any> = {
  code: Code,
  smartphone: Smartphone,
  globe: Globe,
  cpu: Cpu,
  palette: Palette,
  'bar-chart': BarChart,
  shield: Shield,
  cloud: Cloud,
  zap: Zap,
  blocks: Blocks,
  building2: Building2,
  brain: Brain,
};

const gradients = [
  'from-blue-500/20 to-blue-500/0',
  'from-cyan-500/20 to-cyan-500/0',
  'from-green-500/20 to-green-500/0',
  'from-purple-500/20 to-purple-500/0',
  'from-orange-500/20 to-orange-500/0',
  'from-red-500/20 to-red-500/0',
  'from-yellow-500/20 to-yellow-500/0',
];

const colors = [
  'text-blue-400',
  'text-cyan-400',
  'text-green-400',
  'text-purple-400',
  'text-orange-400',
  'text-red-400',
  'text-yellow-400',
];

export function ServicesGrid() {
  const [services, setServices] = useState<ServiceMenuCategory[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiService.getServiceMenu();
        if (response.success) {
          setServices(response.data || []);
        }
      } catch (error) {
        console.error('Failed to load services', error);
      }
    };

    fetchServices();
  }, []);

  if (services.length === 0) return null;

  return <section className="py-24 bg-[#050505] relative lg:mt-14 overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-[color:var(--deep-navy)] rounded-full mix-blend-screen filter blur-[100px] opacity-20" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-[color:var(--deep-red)] rounded-full mix-blend-screen filter blur-[100px] opacity-10" />
    </div>
    <div className="container mx-auto px-4 relative z-10">
      <div className="text-center mb-16">
        <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="inline-block mb-4 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-[color:var(--neon-yellow)]">
          End-to-End Solutions
        </motion.div>
        <motion.h2 initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.1
        }} className="text-4xl md:text-5xl font-bold mb-4">
          Our Expertise
        </motion.h2>
        <motion.p initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.2
        }} className="text-gray-400 max-w-2xl mx-auto">
          We deliver end-to-end digital solutions across the entire technology
          stack, tailored to your business goals.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {services.map((service, index) => {
          const mappedIconKey = (service.iconKey || '').toLowerCase();
          const Icon = iconMap[mappedIconKey] || Code;
          const gradient = gradients[index % gradients.length];
          const color = colors[index % colors.length];

          return <motion.div key={service._id} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.05
          }} viewport={{
            once: true
          }}>
            <Link to={`/services/${service.slug}`} className="group relative block h-full p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[color:var(--neon-yellow)] transition-all duration-500 overflow-hidden hover:-translate-y-2">
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className={`relative w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 ${color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                <Icon size={32} />
              </div>

              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[color:var(--neon-yellow)] transition-colors flex items-center justify-between">
                  {service.name}
                  <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">
                  {service.subcategories?.length || 0} specialized services available.
                </p>
              </div>
            </Link>
          </motion.div>;
        })}
      </div>
    </div>
  </section>;
}
