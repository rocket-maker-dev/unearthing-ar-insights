import { PenTool, Code, Clapperboard, Wrench } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

import roleDesigner from "@/assets/role_designer.jpg";
import roleProgrammer from "@/assets/role_programmer.jpg";
import roleAnimator from "@/assets/role_animator.jpg";
import roleRobotics from "@/assets/role_robotics.jpg";
import roleBuilderCode from "@/assets/role_builder_code.jpg";
import roleConstructor from "@/assets/role_constructor.jpg";

const teamMembers = [
  { id: 0, name: "Antonio", age: 15, role: "Programador Web", icon: Code, bg: roleDesigner },
  { id: 1, name: "Samu", age: 13, role: "Diseño 3D y P. Python", icon: PenTool, bg: roleProgrammer },
  { id: 2, name: "Álvaro", age: 13, role: "P. Python y Animación 3D", icon: Clapperboard, bg: roleAnimator },
  { id: 3, name: "Diego", age: 14, role: "P. Python", icon: Code, bg: roleRobotics },
  { id: 4, name: "Xabi", age: 13, role: "Ingeniero y P. Python", icon: Wrench, bg: roleBuilderCode },
  { id: 5, name: "Miguel Tatu", age: 13, role: "Ingeniero", icon: Wrench, bg: roleConstructor },
];

const TeamSection = () => {
  return (
    <section id="equipo" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
            Quiénes somos
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            El equipo detrás del proyecto
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed mb-12">
            Somos estudiantes de Maker Lab / Espacio Vivo (Ferrol, Galicia).
            Participamos en la FIRST LEGO League 2026. Si quieres replicar el
            proyecto o tienes preguntas, escríbenos.
          </p>
        </AnimatedSection>

        {/* Team grid */}
        <AnimatedSection delay={0.1}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {teamMembers.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.id}
                  className="group relative rounded-xl overflow-hidden border border-border h-56 sm:h-64"
                >
                  <img
                    src={m.bg}
                    alt={m.role}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                  <div className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/20">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground leading-tight">
                      {m.name}
                    </h3>
                    <p className="text-xs text-primary font-medium mt-1">
                      {m.age} años
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {m.role}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default TeamSection;
