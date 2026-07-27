import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mountain } from 'lucide-react';

const hiddenGems = [
  {
    id: 1,
    name: "Phoksundo Lake",
    region: "Dolpo",
    elevation: "3,611m",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1000",
    description: "An alpine fresh water oligotrophic lake, famous for its magnificent turquoise color."
  },
  {
    id: 2,
    name: "Tsum Valley",
    region: "Manaslu",
    elevation: "3,700m",
    image: "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&q=80&w=1000",
    description: "A sacred Himalayan pilgrimage valley situated in northern Gorkha."
  },
  {
    id: 3,
    name: "Nar Phu Valley",
    region: "Annapurna",
    elevation: "4,200m",
    image: "https://images.unsplash.com/photo-1543330691-0f7236a282f1?auto=format&fit=crop&q=80&w=1000",
    description: "A true hidden gem offering medieval Tibetan culture in an untouched valley."
  }
];

export default function HiddenGems() {
  return (
    <section className="min-h-screen w-full bg-background-dark text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-glow mb-4">Discover the Unseen</h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Venture beyond the commercial trails. Hover through the mountain fog to reveal Nepal's best-kept secrets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hiddenGems.map((gem) => (
            <motion.div 
              key={gem.id}
              className="relative h-96 rounded-3xl overflow-hidden cursor-pointer group"
              whileHover="hover"
              initial="rest"
              animate="rest"
            >
              {/* Background Image with 3D Zoom Effect */}
              <motion.img 
                src={gem.image} 
                alt={gem.name}
                className="absolute inset-0 w-full h-full object-cover"
                variants={{
                  rest: { scale: 1 },
                  hover: { scale: 1.1 }
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />

              {/* The "Fog" Layer */}
              <motion.div 
                className="absolute inset-0 bg-white/40 backdrop-blur-md"
                variants={{
                  rest: { opacity: 1 },
                  hover: { opacity: 0 }
                }}
                transition={{ duration: 0.4 }}
              />

              {/* Dark Gradient Overlay for text readability (only appears on hover) */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                variants={{
                  rest: { opacity: 0 },
                  hover: { opacity: 1 }
                }}
                transition={{ duration: 0.4 }}
              />

              {/* Card Content (Bottom) */}
              <motion.div 
                className="absolute bottom-0 left-0 w-full p-6"
                variants={{
                  rest: { y: 20, opacity: 0 },
                  hover: { y: 0, opacity: 1 }
                }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="flex justify-between items-end mb-2">
                  <h3 className="text-2xl font-bold font-display text-white drop-shadow-md">
                    {gem.name}
                  </h3>
                  <div className="flex items-center gap-1 text-accent-temple-gold bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm border border-white/10">
                    <Mountain size={14} />
                    <span className="text-xs font-bold">{gem.elevation}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-white/70 mb-3 text-sm">
                  <MapPin size={14} />
                  <span>{gem.region} Region</span>
                </div>
                
                <p className="text-sm text-white/90 line-clamp-2">
                  {gem.description}
                </p>
              </motion.div>

              {/* Fog Icon in the center when not hovered */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                variants={{
                  rest: { opacity: 1, scale: 1 },
                  hover: { opacity: 0, scale: 0.8 }
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-black/50 font-display font-bold tracking-widest uppercase text-sm bg-white/20 px-4 py-2 rounded-full backdrop-blur-lg">
                  Hover to clear fog
                </span>
              </motion.div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}