import { useTranslation } from "react-i18next";
import AnimatedSection from "./AnimatedSection";
import ar3dModels from "@/assets/ar_3d_models.png";
import arDailyLife from "@/assets/ar_daily_life.png";
import arInfoPanels from "@/assets/ar_info_panels.png";

const ARShowcaseSection = () => {
  const { t } = useTranslation();

  const showcaseItems = [
    { image: ar3dModels, alt: t("showcase.item1_title"), title: t("showcase.item1_title"), desc: t("showcase.item1_desc") },
    { image: arDailyLife, alt: t("showcase.item2_title"), title: t("showcase.item2_title"), desc: t("showcase.item2_desc") },
    { image: arInfoPanels, alt: t("showcase.item3_title"), title: t("showcase.item3_title"), desc: t("showcase.item3_desc") },
  ];

  return (
    <section id="galeria" className="section-padding bg-card/30">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">{t("showcase.label")}</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">{t("showcase.title")}</h2>
          <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed mb-14">{t("showcase.desc")}</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {showcaseItems.map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 0.15}>
              <div className="rounded-xl overflow-hidden border border-border bg-card group hover:border-primary/40 transition-all">
                <div className="overflow-hidden">
                  <img src={item.image} alt={item.alt} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ARShowcaseSection;
