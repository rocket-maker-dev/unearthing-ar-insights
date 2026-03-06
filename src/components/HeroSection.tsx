import { ArrowDown, Play } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center grid-bg overflow-hidden">
    {/* Radial glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

    <div className="relative z-10 max-w-4xl mx-auto text-center px-6 py-32">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm font-medium tracking-widest uppercase text-primary mb-6"
      >
        First LEGO League 2026
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight mb-6"
      >
        Vemos lo que el suelo{" "}
        <span className="text-gradient">esconde</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
      >
        Usamos Realidad Aumentada y escáneres LiDAR para visualizar hallazgos
        arqueológicos antes de moverlos. Tecnología open source, hecha por
        estudiantes.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
      >
        <a
          href="#problema"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-lg hover:brightness-110 transition-all"
        >
          Ver cómo funciona <ArrowDown size={18} />
        </a>
      </motion.div>

      {/* Video placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="relative max-w-2xl mx-auto aspect-video rounded-xl border border-border bg-card flex items-center justify-center group cursor-pointer hover:border-primary/40 transition-colors"
      >
        <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <Play size={28} className="text-primary ml-1" />
          </div>
          <span className="text-sm font-medium">Demo AR aquí</span>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
