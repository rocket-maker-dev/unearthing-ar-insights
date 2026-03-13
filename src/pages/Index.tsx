import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import ARShowcaseSection from "@/components/ARShowcaseSection";
import TimelineSection from "@/components/TimelineSection";
import ArchitectureSection from "@/components/ArchitectureSection";
import ReplicateSection from "@/components/ReplicateSection";
import YacimientosSection from "@/components/YacimientosSection";
import TeamSection from "@/components/TeamSection";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import ModelViewer from "@/components/ModelViewer";
import { ArrowRight } from "lucide-react";

const ModelViewerPreview = () => (
  <section className="py-20 px-6">
    <div className="max-w-6xl mx-auto">
      <AnimatedSection>
        <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
          Tecnología
        </p>
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Visor 3D interactivo
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed mb-8">
          Explora los modelos arqueológicos en 3D desde el navegador
        </p>
      </AnimatedSection>
      <AnimatedSection delay={0.15}>
        <ModelViewer />
        <div className="mt-6 flex justify-center">
          <Link
            to="/comunidad"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition-all"
          >
            Ver más en Comunidad <ArrowRight size={16} />
          </Link>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

const Index = () => (
  <>
    <Navbar />
    <HeroSection />
    <ProblemSection />
    <ARShowcaseSection />
    <TimelineSection />
    <ArchitectureSection />
    <ModelViewerPreview />
    <ReplicateSection />
    
    <TeamSection />
    <Footer />
  </>
);

export default Index;
