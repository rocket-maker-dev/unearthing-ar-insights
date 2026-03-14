import { Smartphone, AppWindow, Globe, Code, Cpu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";

const ReplicateSection = () => {
  const { t } = useTranslation();

  const requirements = [
    { icon: Smartphone, text: t("replicate.req1") },
    { icon: AppWindow, text: t("replicate.req2") },
    { icon: Globe, text: t("replicate.req3") },
    { icon: Code, text: t("replicate.req4") },
  ];

  const steps = [t("replicate.step1"), t("replicate.step2"), t("replicate.step3")];

  return (
    <section id="replica" className="section-padding bg-card/30">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">{t("replicate.label")}</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-12">{t("replicate.title")}</h2>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <h3 className="text-lg font-semibold mb-6">{t("replicate.needs")}</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-16">
            {requirements.map((r) => (
              <div key={r.text} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <r.icon size={20} className="text-primary" />
                </div>
                <span className="text-sm text-foreground">{r.text}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <h3 className="text-lg font-semibold mb-6">{t("replicate.steps_title")}</h3>
          <div className="space-y-6 mb-12">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-5 items-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                  {i + 1}
                </div>
                <p className="text-muted-foreground text-base pt-2 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <Link
            to="/tecnologia"
            className="inline-flex items-center gap-2.5 rounded-lg bg-primary text-primary-foreground font-semibold px-7 py-3.5 text-sm hover:brightness-110 transition-all"
          >
            <Cpu size={18} />
            {t("replicate.tech_button")}
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ReplicateSection;
