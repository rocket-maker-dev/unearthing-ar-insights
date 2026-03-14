import { X, AlertTriangle, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import AnimatedSection from "./AnimatedSection";

const statusConfig = {
  fail: { icon: X, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", line: "bg-red-400/20" },
  warn: { icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", line: "bg-yellow-400/20" },
  success: { icon: Check, color: "text-primary", bg: "bg-primary/10", border: "border-primary/30", line: "bg-primary/30" },
};

const TimelineSection = () => {
  const { t } = useTranslation();

  const steps = [
    { status: "fail" as const, title: "Mattercraft", desc: t("timeline.step1_desc") },
    { status: "fail" as const, title: "Immersal SDK", desc: t("timeline.step2_desc") },
    { status: "fail" as const, title: "OpenCV + descriptores sintéticos", desc: t("timeline.step3_desc") },
    { status: "warn" as const, title: "OpenCV + fotos reales", desc: t("timeline.step4_desc") },
    { status: "success" as const, title: "WebXR + Scaniverse", desc: t("timeline.step5_desc") },
  ];

  return (
    <section id="proceso" className="section-padding bg-card/30">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection>
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">{t("timeline.label")}</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">{t("timeline.title")}</h2>
          <p className="text-muted-foreground text-lg mb-16">{t("timeline.desc")}</p>
        </AnimatedSection>

        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-8">
            {steps.map((step, i) => {
              const cfg = statusConfig[step.status];
              const Icon = cfg.icon;
              const isLast = step.status === "success";
              return (
                <AnimatedSection key={step.title} delay={i * 0.1}>
                  <div className="relative flex gap-6 items-start">
                    <div className={`relative z-10 w-10 h-10 rounded-full ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0 ${isLast ? "animate-pulse-glow" : ""}`}>
                      <Icon size={18} className={cfg.color} />
                    </div>
                    <div className={`flex-1 rounded-lg border p-5 ${isLast ? "border-primary/30 bg-primary/5" : "border-border bg-card"}`}>
                      <h3 className={`font-bold text-base mb-1 ${isLast ? "text-primary" : "text-foreground"}`}>{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
