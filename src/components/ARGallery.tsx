import { useState, useCallback, useEffect } from "react";
import { ImagePlus, X, ChevronLeft, ChevronRight } from "lucide-react";

type ImageCategory = "montaje" | "alumno";

interface GalleryImage {
  src: string;
  title: string;
  category: ImageCategory;
}

interface ARGalleryProps {
  images?: GalleryImage[];
  className?: string;
}

type FilterKey = "todos" | "montaje" | "alumno";

const filters: { key: FilterKey; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "montaje", label: "Montajes AR" },
  { key: "alumno", label: "Trabajos alumnos" },
];

const placeholdersMontaje = Array.from({ length: 6 }, (_, i) => ({
  id: `m-${i}`,
  category: "montaje" as ImageCategory,
  label: "Montaje AR — foto del yacimiento con modelo 3D superpuesto",
}));

const placeholdersAlumno = Array.from({ length: 6 }, (_, i) => ({
  id: `a-${i}`,
  category: "alumno" as ImageCategory,
  label: "Trabajo de alumno — animación o modelo 3D",
}));

const allPlaceholders = [...placeholdersMontaje, ...placeholdersAlumno];

// ===== Lightbox =====
const Lightbox = ({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  const img = images[index];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-lg bg-card/80 border border-border text-muted-foreground hover:text-foreground transition-colors z-10"
      >
        <X size={20} />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-4 p-2 rounded-lg bg-card/80 border border-border text-muted-foreground hover:text-foreground transition-colors z-10"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 p-2 rounded-lg bg-card/80 border border-border text-muted-foreground hover:text-foreground transition-colors z-10"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      <div
        className="max-w-[90vw] max-h-[85vh] flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={img.src}
          alt={img.title}
          className="max-w-full max-h-[75vh] object-contain rounded-xl border border-border shadow-2xl"
        />
        <p className="text-sm text-foreground font-medium">{img.title}</p>
      </div>
    </div>
  );
};

// ===== Main =====
const ARGallery = ({ images, className = "" }: ARGalleryProps) => {
  const [filter, setFilter] = useState<FilterKey>("todos");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const hasImages = images && images.length > 0;

  const filteredImages = hasImages
    ? filter === "todos"
      ? images
      : images.filter((img) => img.category === filter)
    : [];

  const filteredPlaceholders =
    filter === "todos"
      ? allPlaceholders
      : allPlaceholders.filter((p) => p.category === filter);

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(
    () => setLightboxIndex((i) => (i !== null && filteredImages.length > 0 ? (i - 1 + filteredImages.length) % filteredImages.length : null)),
    [filteredImages.length]
  );
  const next = useCallback(
    () => setLightboxIndex((i) => (i !== null && filteredImages.length > 0 ? (i + 1) % filteredImages.length : null)),
    [filteredImages.length]
  );

  return (
    <div className={`rounded-xl border border-border bg-card overflow-hidden ${className}`}>
      {/* Filter tabs */}
      <div className="flex border-b border-border px-2 overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
              filter === f.key ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
            {filter === f.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {hasImages
          ? filteredImages.map((img, i) => (
              <button
                key={i}
                onClick={() => openLightbox(i)}
                className="group rounded-xl border border-border overflow-hidden hover:border-primary/40 transition-all hover:shadow-[0_0_20px_hsla(217,91%,60%,0.08)]"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="px-4 py-3 text-left">
                  <span className="text-xs text-primary font-medium uppercase tracking-wider">
                    {img.category === "montaje" ? "Montaje AR" : "Trabajo alumno"}
                  </span>
                  <p className="text-sm font-semibold mt-0.5 truncate">{img.title}</p>
                </div>
              </button>
            ))
          : filteredPlaceholders.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 aspect-[4/3] text-center px-4"
              >
                <ImagePlus size={28} className="text-muted-foreground/50" />
                <p className="text-xs text-muted-foreground leading-relaxed max-w-[180px]">
                  {p.label}
                </p>
              </div>
            ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && filteredImages.length > 0 && (
        <Lightbox
          images={filteredImages}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prev}
          onNext={next}
        />
      )}
    </div>
  );
};

export default ARGallery;
