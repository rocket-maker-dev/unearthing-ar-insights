import { useState } from "react";
import { MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { supabase } from "@/integrations/supabase/client";

const tiposYacimiento = [
  "Romano",
  "Celta",
  "Medieval",
  "Prehistórico",
  "Moderno",
  "Otro",
];

const initialForm = {
  nombre: "",
  ubicacion: "",
  descripcion: "",
  tipo: "",
  fecha_descubrimiento: "",
  coordenadas_lat: "",
  coordenadas_lng: "",
  contacto_nombre: "",
  contacto_email: "",
};

const YacimientosSection = () => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    if (!form.nombre.trim() || !form.ubicacion.trim() || !form.tipo) {
      setStatus("error");
      setErrorMsg("Nombre, ubicación y tipo son obligatorios.");
      return;
    }

    const { error } = await supabase.from("yacimientos").insert({
      nombre: form.nombre.trim(),
      ubicacion: form.ubicacion.trim(),
      descripcion: form.descripcion.trim() || null,
      tipo: form.tipo,
      fecha_descubrimiento: form.fecha_descubrimiento || null,
      coordenadas_lat: form.coordenadas_lat ? parseFloat(form.coordenadas_lat) : null,
      coordenadas_lng: form.coordenadas_lng ? parseFloat(form.coordenadas_lng) : null,
      contacto_nombre: form.contacto_nombre.trim() || null,
      contacto_email: form.contacto_email.trim() || null,
    });

    if (error) {
      setStatus("error");
      setErrorMsg("Error al guardar. Inténtalo de nuevo.");
      console.error(error);
    } else {
      setStatus("success");
      setForm(initialForm);
    }
  };

  return (
    <section id="yacimientos" className="section-padding bg-secondary/20">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection>
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
            Comunidad
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Registra un yacimiento
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-12">
            ¿Conoces un yacimiento arqueológico que podría beneficiarse de nuestra
            tecnología AR? Rellena este formulario y lo añadiremos a nuestra base de datos.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          {status === "success" ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <CheckCircle size={48} className="text-green-500" />
              <h3 className="text-xl font-bold">¡Yacimiento registrado!</h3>
              <p className="text-muted-foreground">
                Gracias por tu aportación. Revisaremos los datos.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-4 text-primary underline underline-offset-4 hover:brightness-125 transition"
              >
                Registrar otro
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="sm:col-span-2">
                <label className="text-sm font-medium mb-1.5 block">
                  Nombre del yacimiento *
                </label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Termas de Caldoval"
                  required
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Ubicación */}
              <div className="sm:col-span-2">
                <label className="text-sm font-medium mb-1.5 block">
                  Ubicación *
                </label>
                <input
                  name="ubicacion"
                  value={form.ubicacion}
                  onChange={handleChange}
                  placeholder="Ej: Ferrol, Galicia, España"
                  required
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Tipo */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Tipo de yacimiento *
                </label>
                <select
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="">Selecciona…</option>
                  {tiposYacimiento.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha descubrimiento */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Fecha de descubrimiento
                </label>
                <input
                  name="fecha_descubrimiento"
                  value={form.fecha_descubrimiento}
                  onChange={handleChange}
                  placeholder="Ej: Siglo II d.C."
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Coordenadas */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Latitud
                </label>
                <input
                  name="coordenadas_lat"
                  value={form.coordenadas_lat}
                  onChange={handleChange}
                  type="number"
                  step="any"
                  placeholder="43.4831"
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Longitud
                </label>
                <input
                  name="coordenadas_lng"
                  value={form.coordenadas_lng}
                  onChange={handleChange}
                  type="number"
                  step="any"
                  placeholder="-8.2328"
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Descripción */}
              <div className="sm:col-span-2">
                <label className="text-sm font-medium mb-1.5 block">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe el yacimiento, su estado actual, hallazgos relevantes…"
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>

              {/* Contacto */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Tu nombre
                </label>
                <input
                  name="contacto_nombre"
                  value={form.contacto_nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Tu email
                </label>
                <input
                  name="contacto_email"
                  value={form.contacto_email}
                  onChange={handleChange}
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Error */}
              {status === "error" && (
                <div className="sm:col-span-2 flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  {errorMsg}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="sm:col-span-2 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
              >
                <MapPin size={18} />
                {status === "loading" ? "Guardando…" : "Registrar yacimiento"}
              </button>
            </form>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
};

export default YacimientosSection;
