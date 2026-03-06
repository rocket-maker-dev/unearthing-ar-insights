import { User, Send, Monitor, Code, Clapperboard } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { useState } from "react";

const teamMembers = [
  { id: 0, name: "Antonio Gayoso", role: "Diseño Web y Presentador", icon: Monitor },
  { id: 1, name: "Samuel Casas", role: "Programador y Presentador", icon: Code },
  { id: 2, name: "Alvaro Sanchez Merlan", role: "Programador y Animador", icon: Clapperboard },
  { id: 3, name: "Diego Gómez Martín", role: "D", icon: User },
  { id: 4, name: "Nombre del alumno/a", role: "", icon: User },
  { id: 5, name: "Nombre del alumno/a", role: "", icon: User },
];

const TeamSection = () => {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder
  };

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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-20">
            {teamMembers.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.id}
                  className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6"
                >
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                    <Icon size={28} className="text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium text-center">
                    {m.name}
                  </span>
                  {m.role && (
                    <span className="text-xs text-muted-foreground text-center">
                      {m.role}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </AnimatedSection>

        {/* Contact form */}
        <AnimatedSection delay={0.2}>
          <h3 className="text-2xl font-bold mb-8">Contacto</h3>
          <form
            onSubmit={handleSubmit}
            className="grid sm:grid-cols-2 gap-4 max-w-2xl"
          >
            <input
              type="text"
              placeholder="Tu nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
            <input
              type="email"
              placeholder="Tu email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
            <textarea
              placeholder="Tu mensaje"
              rows={4}
              value={form.mensaje}
              onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
              className="sm:col-span-2 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
            <button
              type="submit"
              className="sm:col-span-2 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3.5 rounded-lg hover:brightness-110 transition-all w-full sm:w-auto"
            >
              <Send size={18} />
              Enviar mensaje
            </button>
          </form>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default TeamSection;
