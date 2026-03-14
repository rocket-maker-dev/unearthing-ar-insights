import { Radar, Eye, Link } from "lucide-react";
import { useTranslation } from "react-i18next";
import AnimatedSection from "./AnimatedSection";
import arPhone from "@/assets/ar_phone_ruins.png";
import arArtifacts from "@/assets/ar_artifacts_float.png";

const ProblemSection = () => {
  const { t } = useTranslation();

  const features = [
    { icon: Radar, title: t("problem.scan"), desc: t("problem.scan_desc") },
    { icon: Eye, title: t("problem.visualize"), desc: t("problem.visualize_desc") },
    { icon: Link, title: t("problem.share"), desc: t("problem.share_desc") },
  ];

  return (
    <section id="problema" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">{t("problem.label")}</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">{t("problem.title")}</h2>
          <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed mb-6">{t("problem.desc_1")}</p>
          <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed mb-12">{t("problem.desc_2")}</p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="rounded-xl overflow-hidden border border-border group">
              <img src={arPhone} alt={t("problem.ar_realtime")} className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="p-4 bg-card">
                <p className="text-sm font-medium text-foreground">{t("problem.ar_realtime")}</p>
                <p className="text-xs text-muted-foreground">{t("problem.ar_realtime_desc")}</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-border group">
              <img src={arArtifacts} alt={t("problem.artifact_analysis")} className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="p-4 bg-card">
                <p className="text-sm font-medium text-foreground">{t("problem.artifact_analysis")}</p>
                <p className="text-xs text-muted-foreground">{t("problem.artifact_analysis_desc")}</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <AnimatedSection key={f.title} delay={i * 0.15 + 0.2}>
              <div className="group rounded-xl border border-border bg-card p-8 hover:border-primary/40 transition-all hover:shadow-[0_0_30px_hsla(217,91%,60%,0.08)]">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                  <f.icon size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
