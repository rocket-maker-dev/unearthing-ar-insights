import { Smartphone, AppWindow, Globe, Code } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const requirements = [
  { icon: Smartphone, text: "Dispositivo Android compatible con ARCore" },
  { icon: AppWindow, text: "App Scaniverse (gratis en Play Store)" },
  { icon: Globe, text: "Chrome (Android)" },
  { icon: Code, text: "Nuestro código (GitHub, gratis)" },
];

const steps = [
  "Escanea el espacio con Scaniverse → exporta como .glb",
  "Descarga nuestro código → sube tu archivo GLB",
  "Abre la URL en Chrome → toca el suelo → los objetos AR aparecen anclados al espacio",
];

const ReplicateSection = () => (
  <section id="replica" className="section-padding bg-card/30">
    <div className="max-w-4xl mx-auto">
      <AnimatedSection>
        <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
          Replica el experimento
        </p>
        <h2 className="text-3xl md:text-5xl font-bold mb-12">
          Hazlo tú también
        </h2>
      </AnimatedSection>

      {/* Requirements */}
      <AnimatedSection delay={0.1}>
        <h3 className="text-lg font-semibold mb-6">Necesitas:</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {requirements.map((r) => (
            <div
              key={r.text}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <r.icon size={20} className="text-primary" />
              </div>
              <span className="text-sm text-foreground">{r.text}</span>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Steps */}
      <AnimatedSection delay={0.2}>
        <h3 className="text-lg font-semibold mb-6">Pasos:</h3>
        <div className="space-y-6">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-5 items-start">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                {i + 1}
              </div>
              <p className="text-muted-foreground text-base pt-2 leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default ReplicateSection;
