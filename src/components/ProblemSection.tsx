import { Radar, Eye, Link } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import arPhone from "@/assets/ar_phone_ruins.png";
import arArtifacts from "@/assets/ar_artifacts_float.png";

const features = [
  {
    icon: Radar,
    title: "Escanear",
    desc: "Capturamos el espacio con Scaniverse creando una malla 3D milimétrica",
  },
  {
    icon: Eye,
    title: "Visualizar",
    desc: "WebXR ancla los objetos al mundo real sin apps, solo con Chrome y ARCore",
  },
  {
    icon: Link,
    title: "Compartir",
    desc: "Todo el código es open source para que cualquier equipo lo use y mejore",
  },
];

const ProblemSection = () => (
  <section id="problema" className="section-padding">
    <div className="max-w-6xl mx-auto">
      <AnimatedSection>
        <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
          El problema
        </p>
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Solo vemos piedras
        </h2>
        <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed mb-6">
          Cuando visitamos un yacimiento arqueológico, un museo o un centro de interpretación, muchas veces solo vemos piedras y ruinas. Todo debe mantenerse inalterable para su conservación. Pero con Realidad Aumentada podemos superponer reconstrucciones 3D, paneles informativos y animaciones sobre el espacio real, enriqueciendo la experiencia de forma didáctica sin tocar ni alterar nada.
        </p>
        <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed mb-12">
          Nuestra plataforma abierta de experiencias AR permite a cualquier museo o yacimiento subir y compartir contenido didáctico AR: reconstrucciones 3D, paneles informativos y animaciones superpuestas sobre el espacio real.
        </p>
      </AnimatedSection>

      {/* Image showcase */}
      <AnimatedSection delay={0.1}>
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="rounded-xl overflow-hidden border border-border group">
            <img
              src={arPhone}
              alt="Usando un teléfono móvil para ver ruinas con realidad aumentada"
              className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="p-4 bg-card">
              <p className="text-sm font-medium text-foreground">AR en tiempo real</p>
              <p className="text-xs text-muted-foreground">Apunta con tu iPhone y los hallazgos aparecen superpuestos al yacimiento real</p>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-border group">
            <img
              src={arArtifacts}
              alt="Artefactos arqueológicos con hologramas de reconstrucción 3D"
              className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="p-4 bg-card">
              <p className="text-sm font-medium text-foreground">Análisis de artefactos</p>
              <p className="text-xs text-muted-foreground">Reconstrucción 3D de piezas fragmentadas con datos de origen y datación</p>
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
              <p className="text-muted-foreground text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
