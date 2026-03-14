import { Github, Download, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";

const diagram = `Android (Chrome + ARCore)
    │
    ▼
WebXR API — tracking nativo (cámara + giroscopio + ARCore)
    │
    ▼
Three.js — renderiza los objetos 3D en el espacio real
    │
    ▼
Archivo GLB — malla 3D del espacio generada por Scaniverse`;

const ArchitectureSection = () => {
  const { t } = useTranslation();

  const externalButtons = [
    { icon: Github, label: t("architecture.github"), href: "https://github.com/rocket-maker-dev/unearthing-ar-insights" },
  ];

  return (
    <section id="arquitectura" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">{t("architecture.label")}</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">{t("architecture.title")}</h2>
          <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed mb-12">{t("architecture.desc")}</p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="rounded-xl border border-border bg-card p-6 md:p-8 mb-10 overflow-x-auto">
            <pre className="text-sm md:text-base font-mono text-primary leading-loose whitespace-pre">{diagram}</pre>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <div className="flex flex-wrap gap-4">
            {externalButtons.map((b) => (
              <a key={b.label} href={b.href} target={b.href.startsWith("http") ? "_blank" : undefined} rel={b.href.startsWith("http") ? "noopener noreferrer" : undefined} className="inline-flex items-center gap-2 rounded-lg border border-primary/30 text-primary font-medium px-6 py-3 text-sm hover:bg-primary/10 transition-colors">
                <b.icon size={18} />
                {b.label}
              </a>
            ))}
            <Link to="/docs" className="inline-flex items-center gap-2 rounded-lg border border-primary/30 text-primary font-medium px-6 py-3 text-sm hover:bg-primary/10 transition-colors">
              <FileText size={18} />
              {t("architecture.docs")}
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ArchitectureSection;
