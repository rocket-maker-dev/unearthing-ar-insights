import AnimatedSection from "./AnimatedSection";
import ar3dModels from "@/assets/ar_3d_models.png";
import arDailyLife from "@/assets/ar_daily_life.png";
import arInfoPanels from "@/assets/ar_info_panels.png";

const showcaseItems = [
  {
    image: ar3dModels,
    alt: "Reconstrucción 3D de un templo romano con realidad aumentada",
    title: "Reconstrucción arquitectónica",
    desc: "Visualiza cómo eran los edificios originales superpuestos sobre las ruinas actuales.",
  },
  {
    image: arDailyLife,
    alt: "Recreación de la vida cotidiana romana con hologramas AR",
    title: "Vida cotidiana recreada",
    desc: "Imagina cómo era el día a día en las termas romanas con figuras holográficas a escala real.",
  },
  {
    image: arInfoPanels,
    alt: "Paneles de información AR con datos del yacimiento arqueológico",
    title: "Paneles informativos AR",
    desc: "Accede a datos, mapas topográficos y fichas de cada pieza directamente en el yacimiento.",
  },
];

const ARShowcaseSection = () => (
  <section id="galeria" className="section-padding bg-card/30">
    <div className="max-w-6xl mx-auto">
      <AnimatedSection>
        <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
          Nuestra visión
        </p>
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          La arqueología del futuro
        </h2>
        <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed mb-14">
          Así es como la Realidad Aumentada puede transformar la forma en que
          exploramos, documentamos y compartimos el patrimonio arqueológico.
        </p>
      </AnimatedSection>

      <div className="grid md:grid-cols-3 gap-6">
        {showcaseItems.map((item, i) => (
          <AnimatedSection key={item.title} delay={i * 0.15}>
            <div className="rounded-xl overflow-hidden border border-border bg-card group hover:border-primary/40 transition-all">
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default ARShowcaseSection;
