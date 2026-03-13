import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import arHero from "@/assets/ar_excavation_hero.png";
import logo from "@/assets/logo_vision_maker_lab.png";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Background image with overlay */}
    <div className="absolute inset-0">
      <img
        src={arHero}
        alt="Excavación arqueológica con hologramas AR superpuestos"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
    </div>

    {/* Radial glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

    <div className="relative z-10 max-w-4xl mx-auto text-center px-6 py-32">
      <motion.img
        src={logo}
        alt="Logo Vision Maker Lab"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-6 rounded-full object-cover border-2 border-primary/30 shadow-[0_0_30px_hsla(217,91%,60%,0.15)]"
      />

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
        Usamos Realidad Aumentada con WebXR y ARCore para visualizar hallazgos
        arqueológicos en su contexto original. Tecnología open source, hecha por
        estudiantes.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <a
          href="#problema"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-lg hover:brightness-110 transition-all"
        >
          Ver cómo funciona <ArrowDown size={18} />
        </a>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
