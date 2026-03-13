import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, ArrowLeft, ExternalLink, Calendar, Globe, Plus, Image, Box, FileText, Film, Upload, X, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import ModelViewer from "@/components/ModelViewer";
import CSVViewer from "@/components/CSVViewer";
import ARGallery from "@/components/ARGallery";

type Yacimiento = {
  id: string;
  nombre: string;
  ubicacion: string;
  tipo: string;
  descripcion: string | null;
  fecha_descubrimiento: string | null;
  coordenadas_lat: number | null;
  coordenadas_lng: number | null;
  imagen_url: string | null;
  website_url: string | null;
  estado: string | null;
  created_at: string;
};

type YacimientoItem = {
  id: string;
  yacimiento_id: string;
  tipo: string;
  titulo: string;
  descripcion: string | null;
  archivo_url: string | null;
  thumbnail_url: string | null;
  orden: number;
  created_at: string;
};

const tipoIcons: Record<string, typeof Image> = {
  imagen: Image,
  modelo_3d: Box,
  panel_info: FileText,
  video: Film,
};

const tipoLabels: Record<string, string> = {
  imagen: "Imagen",
  modelo_3d: "Modelo 3D",
  panel_info: "Panel informativo",
  video: "Vídeo",
};

// ===== LISTING PAGE =====
const YacimientoCard = ({ y, onClick }: { y: Yacimiento; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="group text-left rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-all hover:shadow-[0_0_30px_hsla(217,91%,60%,0.08)]"
  >
    <div className="h-48 overflow-hidden">
      {y.imagen_url ? (
        <img src={y.imagen_url} alt={y.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      ) : (
        <div className="w-full h-full bg-secondary flex items-center justify-center">
          <MapPin size={40} className="text-muted-foreground" />
        </div>
      )}
    </div>
    <div className="p-5">
      <span className="text-xs font-medium text-primary uppercase tracking-wider">{y.tipo}</span>
      <h3 className="text-lg font-bold mt-1 mb-1 group-hover:text-primary transition-colors">{y.nombre}</h3>
      <p className="text-sm text-muted-foreground flex items-center gap-1">
        <MapPin size={14} /> {y.ubicacion}
      </p>
    </div>
  </button>
);

// ===== UPLOAD DIALOG =====
const tipoOptions = [
  { value: "imagen", label: "Imagen / Montaje AR", icon: Image, accept: "image/*" },
  { value: "modelo_3d", label: "Modelo 3D (.glb/.gltf)", icon: Box, accept: ".glb,.gltf" },
  { value: "video", label: "Vídeo", icon: Film, accept: "video/*" },
  { value: "panel_info", label: "Panel informativo", icon: FileText, accept: "image/*,.pdf" },
];

const UploadDialog = ({
  yacimientoId,
  onClose,
  onUploaded,
}: {
  yacimientoId: string;
  onClose: () => void;
  onUploaded: () => void;
}) => {
  const [tipo, setTipo] = useState("imagen");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedTipo = tipoOptions.find((t) => t.value === tipo)!;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    if (f.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !titulo.trim()) {
      setError("Título y archivo son obligatorios.");
      return;
    }
    setUploading(true);
    setError("");

    const ext = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from("yacimiento-images")
      .upload(fileName, file);

    if (uploadErr) {
      setError("Error al subir el archivo. Inténtalo de nuevo.");
      setUploading(false);
      return;
    }

    const { data: publicData } = supabase.storage
      .from("yacimiento-images")
      .getPublicUrl(fileName);

    const archivo_url = publicData.publicUrl;
    const thumbnail_url = file.type.startsWith("image/") ? archivo_url : null;

    const { error: insertErr } = await supabase.from("yacimiento_items").insert({
      yacimiento_id: yacimientoId,
      tipo,
      titulo: titulo.trim(),
      descripcion: descripcion.trim() || null,
      archivo_url,
      thumbnail_url,
    } as any);

    if (insertErr) {
      setError("Error al guardar. Inténtalo de nuevo.");
      setUploading(false);
      return;
    }

    setUploading(false);
    onUploaded();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4" onClick={onClose}>
      <div
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-bold">Subir contenido</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tipo */}
          <div>
            <label className="text-sm font-medium mb-2 block">Tipo de contenido</label>
            <div className="grid grid-cols-2 gap-2">
              {tipoOptions.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => { setTipo(t.value); setFile(null); setPreview(null); }}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                      tipo === t.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    <Icon size={16} />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Título *</label>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Animación termas romano"
              required
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={2}
              placeholder="Breve descripción del contenido…"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </div>

          {/* Archivo */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Archivo *</label>
            <input
              ref={fileRef}
              type="file"
              accept={selectedTipo.accept}
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
                {preview && (
                  <img src={preview} alt="Preview" className="w-12 h-12 rounded object-cover" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                <button type="button" onClick={() => { setFile(null); setPreview(null); }} className="text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-background px-4 py-6 text-sm text-muted-foreground hover:border-primary/50 transition-colors w-full justify-center"
              >
                <Upload size={20} />
                Seleccionar archivo ({selectedTipo.label})
              </button>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-400 flex items-center gap-1.5">{error}</p>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Subiendo…
              </>
            ) : (
              <>
                <Upload size={18} /> Subir contenido
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// ===== DETAIL PAGE =====
const YacimientoDetail = ({ id, onBack }: { id: string; onBack: () => void }) => {
  const [yacimiento, setYacimiento] = useState<Yacimiento | null>(null);
  const [items, setItems] = useState<YacimientoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  const fetchData = async () => {
    const { data: y } = await supabase.from("yacimientos").select("*").eq("id", id).single();
    if (y) setYacimiento(y as Yacimiento);
    const { data: its } = await supabase.from("yacimiento_items").select("*").eq("yacimiento_id", id).order("orden");
    if (its) setItems(its as YacimientoItem[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Cargando...</div>;
  if (!yacimiento) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">No encontrado</div>;

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={16} /> Volver a comunidad
        </button>

        {/* Hero image */}
        {yacimiento.imagen_url && (
          <div className="rounded-xl overflow-hidden border border-border mb-8 h-64 md:h-96">
            <img src={yacimiento.imagen_url} alt={yacimiento.nombre} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-medium text-primary uppercase tracking-wider">{yacimiento.tipo}</span>
            <h1 className="text-3xl md:text-5xl font-bold mt-1">{yacimiento.nombre}</h1>
            <p className="text-muted-foreground flex items-center gap-1 mt-2">
              <MapPin size={16} /> {yacimiento.ubicacion}
            </p>
          </div>
          {yacimiento.website_url && (
            <a
              href={yacimiento.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary border border-primary/30 rounded-lg px-4 py-2 hover:bg-primary/10 transition-colors"
            >
              <Globe size={16} /> Sitio web <ExternalLink size={14} />
            </a>
          )}
        </div>

        {yacimiento.fecha_descubrimiento && (
          <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
            <Calendar size={14} /> {yacimiento.fecha_descubrimiento}
          </p>
        )}

        {yacimiento.descripcion && (
          <p className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-3xl">
            {yacimiento.descripcion}
          </p>
        )}

        {/* Items gallery */}
        {items.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Contenido AR</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => {
                const Icon = tipoIcons[item.tipo] || FileText;
                return (
                  <div key={item.id} className="rounded-xl border border-border bg-card overflow-hidden group">
                    <div className="h-40 overflow-hidden bg-secondary">
                      {(item.thumbnail_url || item.archivo_url) ? (
                        <img
                          src={item.thumbnail_url || item.archivo_url || ""}
                          alt={item.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon size={32} className="text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={14} className="text-primary" />
                        <span className="text-xs text-primary font-medium">{tipoLabels[item.tipo]}</span>
                      </div>
                      <h3 className="text-sm font-bold">{item.titulo}</h3>
                      {item.descripcion && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.descripcion}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Visor 3D */}
        <div className="border-t border-border pt-8 mt-8">
          <h2 className="text-2xl font-bold mb-6">Visor 3D</h2>
          <ModelViewer
            modelUrl={items.find((i) => i.tipo === "modelo_3d")?.archivo_url || undefined}
          />
        </div>

        {/* Datos de excavación */}
        <div className="border-t border-border pt-8 mt-8">
          <h2 className="text-2xl font-bold mb-6">Datos de excavación</h2>
          <CSVViewer />
        </div>

        {/* Galería y montajes */}
        <div className="border-t border-border pt-8 mt-8">
          <h2 className="text-2xl font-bold mb-6">Galería y montajes</h2>
          <ARGallery
            images={
              items
                .filter((i) => i.tipo === "imagen" && (i.archivo_url || i.thumbnail_url))
                .map((i) => ({
                  src: (i.archivo_url || i.thumbnail_url)!,
                  title: i.titulo,
                  category: "montaje" as const,
                }))
                .length > 0
                ? items
                    .filter((i) => i.tipo === "imagen" && (i.archivo_url || i.thumbnail_url))
                    .map((i) => ({
                      src: (i.archivo_url || i.thumbnail_url)!,
                      title: i.titulo,
                      category: "montaje" as const,
                    }))
                : undefined
            }
          />
        </div>

        {items.length === 0 && (
          <div className="text-center py-12 border border-dashed border-border rounded-xl">
            <p className="text-muted-foreground">Aún no hay contenido AR para este yacimiento.</p>
            <p className="text-sm text-muted-foreground mt-1">¡Sé el primero en añadir contenido!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ===== MAIN PAGE =====
const Comunidad = () => {
  const [yacimientos, setYacimientos] = useState<Yacimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("yacimientos").select("*").order("created_at", { ascending: false });
      if (data) setYacimientos(data as Yacimiento[]);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <>
      <Navbar />
      {selectedId ? (
        <YacimientoDetail id={selectedId} onBack={() => setSelectedId(null)} />
      ) : (
        <div className="min-h-screen pt-24 pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
                Comunidad
              </p>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Yacimientos con AR
              </h1>
              <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed mb-12">
                Explora yacimientos arqueológicos que usan nuestra tecnología de Realidad Aumentada.
                ¿Conoces uno? ¡Regístralo y comparte contenido AR con la comunidad!
              </p>
            </AnimatedSection>

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-xl border border-border bg-card h-72 animate-pulse" />
                ))}
              </div>
            ) : yacimientos.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p>No hay yacimientos registrados aún.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {yacimientos.map((y) => (
                  <AnimatedSection key={y.id} delay={0.05}>
                    <YacimientoCard y={y} onClick={() => setSelectedId(y.id)} />
                  </AnimatedSection>
                ))}
              </div>
            )}

            {/* CTA to register */}
            <AnimatedSection delay={0.2}>
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
                <h3 className="text-xl font-bold mb-2">Crea tu propio contenido AR</h3>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Usa las plantillas y herramientas de <span className="text-foreground font-semibold">UNEARTHED AR</span> para dar vida a cualquier yacimiento arqueológico con Realidad Aumentada. ¡Sin necesidad de programar!
                </p>
                <a
                  href="/#arquitectura"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition-all"
                >
                  <Plus size={18} /> Empieza ahora
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Comunidad;
