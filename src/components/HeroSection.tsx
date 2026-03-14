import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import heroVideo from "@/assets/hero-video.mp4";
import logo from "@/assets/logo_vision_maker_lab.png";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <video src={heroVideo} autoPlay loop muted playsInline className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background" />
      </div>
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
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-sm font-medium tracking-widest uppercase text-primary mb-6">
          {t("hero.badge")}
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }} className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight mb-6">
          {t("hero.title_1")}{" "}
          <span className="text-gradient">{t("hero.title_highlight")}</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          {t("hero.subtitle")}
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#problema" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-lg hover:brightness-110 transition-all">
            {t("hero.cta_how")} <ArrowDown size={18} />
          </a>
          <Link to="/comunidad" className="inline-flex items-center gap-2 border border-border text-foreground font-semibold px-8 py-3.5 rounded-lg hover:bg-secondary transition-all">
            {t("hero.cta_community")}
          </Link>
          <a href="#equipo" className="inline-flex items-center gap-2 border border-primary/30 text-primary font-semibold px-8 py-3.5 rounded-lg hover:bg-primary/10 transition-all">
            {t("hero.cta_team")}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
