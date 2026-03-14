import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, ArrowLeft, ExternalLink, Calendar, Globe, Plus, Image, Box, FileText, Film, Upload, X, CheckCircle, Loader2, Trash2, Play, Pause, Maximize2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
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
  { value: "modelo_3d", label: "Modelo 3D", icon: Box, accept: ".glb,.gltf,.stl,.obj,.fbx" },
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
  const [extraFiles, setExtraFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const extraFileRef = useRef<HTMLInputElement>(null);

  const selectedTipo = tipoOptions.find((t) => t.value === tipo)!;
  const is3D = tipo === "modelo_3d";

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

  const handleExtraFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setExtraFiles(Array.from(files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !titulo.trim()) {
      setError("Título y archivo son obligatorios.");
      return;
    }
    setUploading(true);
    setError("");

    // For .gltf files, upload all files into a shared folder so references work
    const folderPrefix = crypto.randomUUID();
    const mainFileName = `${folderPrefix}/${file.name}`;

    const { error: uploadErr } = await supabase.storage
      .from("yacimiento-images")
      .upload(mainFileName, file, {
        contentType: file.type || "application/octet-stream",
        cacheControl: "3600",
      });

    if (uploadErr) {
      setError("Error al subir el archivo principal. Inténtalo de nuevo.");
      setUploading(false);
      return;
    }

    // Upload extra files (e.g. .bin, textures) into the same folder
    if (extraFiles.length > 0) {
      for (const ef of extraFiles) {
        const { error: extraErr } = await supabase.storage
          .from("yacimiento-images")
          .upload(`${folderPrefix}/${ef.name}`, ef, {
            contentType: ef.type || "application/octet-stream",
            cacheControl: "3600",
          });
        if (extraErr) {
          setError(`Error al subir "${ef.name}". Inténtalo de nuevo.`);
          setUploading(false);
          return;
        }
      }
    }

    const { data: publicData } = supabase.storage
      .from("yacimiento-images")
      .getPublicUrl(mainFileName);

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
                    onClick={() => { setTipo(t.value); setFile(null); setPreview(null); setExtraFiles([]); }}
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
                  <p className="text-xs text-muted-foreground">{file.size < 1024 ? `${file.size} B` : file.size < 1048576 ? `${(file.size / 1024).toFixed(0)} KB` : `${(file.size / 1048576).toFixed(1)} MB`}</p>
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

          {/* Extra files for 3D models (.bin, textures) */}
          {is3D && file && (
            <div>
              <label className="text-sm font-medium mb-1.5 block">Archivos adicionales (.bin, texturas…)</label>
              <input
                ref={extraFileRef}
                type="file"
                multiple
                accept=".bin,.png,.jpg,.jpeg,.ktx2"
                onChange={handleExtraFilesChange}
                className="hidden"
              />
              {extraFiles.length > 0 ? (
                <div className="space-y-2">
                  {extraFiles.map((ef, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-2 text-sm">
                      <FileText size={14} className="text-primary shrink-0" />
                      <span className="truncate flex-1">{ef.name}</span>
                      <span className="text-xs text-muted-foreground">{(ef.size / 1024 / 1024).toFixed(1)} MB</span>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => { setExtraFiles([]); }}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Quitar archivos adicionales
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => extraFileRef.current?.click()}
                  className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-background px-4 py-4 text-sm text-muted-foreground hover:border-primary/50 transition-colors w-full justify-center"
                >
                  <Plus size={16} />
                  Añadir .bin, texturas u otros archivos del modelo
                </button>
              )}
              <p className="text-xs text-muted-foreground mt-1.5">
                Si tu modelo .gltf referencia archivos externos (animacion0.bin, texturas…), súbelos aquí.
              </p>
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive flex items-center gap-1.5">{error}</p>
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

// ===== INLINE VIDEO PLAYER =====
const VideoCardPlayer = ({ url }: { url: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }, []);

  const openModal = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    videoRef.current?.pause();
    setPlaying(false);
    setModalOpen(true);
  }, []);

  return (
    <>
      <div className="relative w-full h-full cursor-pointer" onClick={toggle}>
        <video
          ref={videoRef}
          src={url}
          loop
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        />
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity ${
            playing ? "opacity-0 hover:opacity-100" : "opacity-100"
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
            {playing ? <Pause size={18} className="text-primary-foreground" /> : <Play size={18} className="text-primary-foreground ml-0.5" />}
          </div>
        </div>
        {/* Fullscreen button */}
        <button
          onClick={openModal}
          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-lg bg-card/80 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
          title="Ver a tamaño completo"
        >
          <Maximize2 size={14} />
        </button>
      </div>

      {/* Fullscreen modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-2 sm:p-4 bg-background/95 backdrop-blur-md border-border">
          <video
            ref={modalVideoRef}
            src={url}
            loop
            controls
            autoPlay
            playsInline
            className="w-full max-h-[80vh] rounded-lg object-contain"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

// ===== DETAIL PAGE =====
const YacimientoDetail = ({ id, onBack }: { id: string; onBack: () => void }) => {
  const [yacimiento, setYacimiento] = useState<Yacimiento | null>(null);
  const [items, setItems] = useState<YacimientoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [selected3DId, setSelected3DId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { isAdmin } = useAuth();

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

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("¿Seguro que quieres eliminar este recurso?")) return;
    setDeleting(itemId);
    await supabase.from("yacimiento_items").delete().eq("id", itemId);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    setDeleting(null);
  };

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

        {/* Upload button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-lg hover:brightness-110 transition-all text-sm"
          >
            <Upload size={16} /> Subir montaje o modelo
          </button>
        </div>

        {/* Items gallery */}
        {items.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Contenido AR</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => {
                const Icon = tipoIcons[item.tipo] || FileText;
                return (
                  <div key={item.id} className="rounded-xl border border-border bg-card overflow-hidden group">
                    <div className="h-40 overflow-hidden bg-secondary relative">
                      {item.tipo === "video" && item.archivo_url ? (
                        <VideoCardPlayer url={item.archivo_url} />
                      ) : item.tipo === "modelo_3d" && item.archivo_url ? (
                        <ModelViewer
                          modelUrl={item.archivo_url}
                          compact
                          className="h-full rounded-none border-0"
                        />
                      ) : (item.thumbnail_url || item.archivo_url) ? (
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
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Icon size={14} className="text-primary" />
                          <span className="text-xs text-primary font-medium">{tipoLabels[item.tipo]}</span>
                        </div>
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={deleting === item.id}
                            className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                            title="Eliminar recurso"
                          >
                            {deleting === item.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          </button>
                        )}
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
        {(() => {
          const models3d = items.filter((i) => i.tipo === "modelo_3d" && i.archivo_url);
          return (
            <div className="border-t border-border pt-8 mt-8">
              <h2 className="text-2xl font-bold mb-4">Visor 3D</h2>
              {models3d.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {models3d.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelected3DId(m.id)}
                      className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                        (selected3DId || models3d[models3d.length - 1].id) === m.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {m.titulo}
                    </button>
                  ))}
                </div>
              )}
              <ModelViewer
                modelUrl={
                  models3d.length > 0
                    ? (models3d.find((m) => m.id === selected3DId) || models3d[models3d.length - 1])?.archivo_url || undefined
                    : undefined
                }
              />
            </div>
          );
        })()}

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

        {/* Upload dialog */}
        {showUpload && (
          <UploadDialog
            yacimientoId={id}
            onClose={() => setShowUpload(false)}
            onUploaded={() => {
              setShowUpload(false);
              fetchData();
            }}
          />
        )}
      </div>
    </div>
  );
};

// ===== NEW YACIMIENTO FORM =====
const NuevoYacimientoForm = ({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) => {
  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [tipo, setTipo] = useState("romano");
  const [descripcion, setDescripcion] = useState("");
  const [contactoNombre, setContactoNombre] = useState("");
  const [contactoEmail, setContactoEmail] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const imgRef = useRef<HTMLInputElement>(null);

  const tiposSitio = [
    "romano", "ibérico", "medieval", "prehistórico", "islámico",
    "fenicio", "celta", "visigodo", "otro",
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImagenFile(f);
    setImgPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !ubicacion.trim()) {
      setError("Nombre y ubicación son obligatorios.");
      return;
    }
    setSaving(true);
    setError("");

    let imagen_url: string | null = null;

    if (imagenFile) {
      const fileName = `yacimientos/${crypto.randomUUID()}/${imagenFile.name}`;
      const { error: upErr } = await supabase.storage
        .from("yacimiento-images")
        .upload(fileName, imagenFile, {
          contentType: imagenFile.type,
          cacheControl: "3600",
        });
      if (upErr) {
        setError("Error al subir la imagen. Inténtalo de nuevo.");
        setSaving(false);
        return;
      }
      const { data: pubData } = supabase.storage
        .from("yacimiento-images")
        .getPublicUrl(fileName);
      imagen_url = pubData.publicUrl;
    }

    const { error: insertErr } = await supabase.from("yacimientos").insert({
      nombre: nombre.trim(),
      ubicacion: ubicacion.trim(),
      tipo: tipo,
      descripcion: descripcion.trim() || null,
      contacto_nombre: contactoNombre.trim() || null,
      contacto_email: contactoEmail.trim() || null,
      website_url: websiteUrl.trim() || null,
      imagen_url,
    } as any);

    if (insertErr) {
      console.error("Insert error:", insertErr);
      setError("Error al registrar el yacimiento. Inténtalo de nuevo.");
      setSaving(false);
      return;
    }

    setSaving(false);
    onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4" onClick={onClose}>
      <div
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-bold">Registrar yacimiento</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Nombre del yacimiento *</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Termas Romanas de Caldoval"
              required
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Ubicación */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Ubicación *</label>
            <input
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              placeholder="Ej: Sanxenxo, Pontevedra"
              required
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Tipo de yacimiento</label>
            <div className="flex flex-wrap gap-2">
              {tiposSitio.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTipo(t)}
                  className={`px-3 py-1.5 rounded-lg border text-sm capitalize transition-colors ${
                    tipo === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              placeholder="Describe brevemente el yacimiento o centro de interpretación…"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </div>

          {/* Imagen */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Imagen de portada</label>
            <input ref={imgRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            {imagenFile ? (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
                {imgPreview && <img src={imgPreview} alt="Preview" className="w-12 h-12 rounded object-cover" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{imagenFile.name}</p>
                </div>
                <button type="button" onClick={() => { setImagenFile(null); setImgPreview(null); }} className="text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => imgRef.current?.click()}
                className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-background px-4 py-6 text-sm text-muted-foreground hover:border-primary/50 transition-colors w-full justify-center"
              >
                <Upload size={20} />
                Seleccionar imagen
              </button>
            )}
          </div>

          {/* Contacto */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Nombre contacto</label>
              <input
                value={contactoNombre}
                onChange={(e) => setContactoNombre(e.target.value)}
                placeholder="Opcional"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email contacto</label>
              <input
                type="email"
                value={contactoEmail}
                onChange={(e) => setContactoEmail(e.target.value)}
                placeholder="Opcional"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Sitio web</label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
          >
            {saving ? (
              <><Loader2 size={18} className="animate-spin" /> Registrando…</>
            ) : (
              <><CheckCircle size={18} /> Registrar yacimiento</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// ===== MAIN PAGE =====
const Comunidad = () => {
  const [yacimientos, setYacimientos] = useState<Yacimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const fetchYacimientos = async () => {
    try {
      const { data, error } = await supabase
        .from("yacimientos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading yacimientos:", error);
        setErrorMsg("No se pudieron cargar los yacimientos. Recarga la página.");
        setYacimientos([]);
        return;
      }

      setErrorMsg("");
      setYacimientos((data ?? []) as Yacimiento[]);
    } catch (error) {
      console.error("Unexpected error loading yacimientos:", error);
      setErrorMsg("No se pudieron cargar los yacimientos. Recarga la página.");
      setYacimientos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYacimientos();
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
            ) : errorMsg ? (
              <div className="text-center py-20 text-destructive">
                <p>{errorMsg}</p>
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
                <h3 className="text-xl font-bold mb-2">¿Conoces un yacimiento o centro de interpretación?</h3>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Regístralo en la plataforma y comparte contenido AR con la comunidad. Cualquiera puede añadir un nuevo yacimiento con sus fotos, vídeos y modelos 3D.
                </p>
                <button
                  onClick={() => setShowNewForm(true)}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition-all"
                >
                  <Plus size={18} /> Registrar yacimiento
                </button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      )}

      {showNewForm && (
        <NuevoYacimientoForm
          onClose={() => setShowNewForm(false)}
          onCreated={() => {
            setShowNewForm(false);
            fetchYacimientos();
          }}
        />
      )}

      <Footer />
    </>
  );
};

export default Comunidad;
