import { useState, useCallback, useRef } from "react";
import { Upload, Table2 } from "lucide-react";

// ===== Hardcoded data =====
const hallazgos = [
  { nombre: "Cerámica Terra Sigillata", periodo: "Romano", año: -150, descripcion: "Fragmentos de cerámica romana de lujo importada del Mediterráneo", emoji: "🏺", color: "#e74c3c" },
  { nombre: "Mosaico del Triclinium", periodo: "Romano", año: -200, descripcion: "Suelo decorado con teselas blancas y negras del comedor de una villa", emoji: "🎨", color: "#f39c12" },
  { nombre: "Enterramiento Medieval", periodo: "Medieval", año: 1150, descripcion: "Tumba de lajas orientada este-oeste del siglo XII", emoji: "⚱️", color: "#9b59b6" },
  { nombre: "Muralla del Castro", periodo: "Prerromano", año: -500, descripcion: "Base de muralla de granito sin argamasa", emoji: "🏰", color: "#2ecc71" },
  { nombre: "Hogar Prehistórico", periodo: "Prehistórico", año: -900, descripcion: "Restos de combustión con cenizas. Datación C14: ~900 a.C.", emoji: "🔥", color: "#e67e22" },
];

const posiciones = [
  { nombre: "Cerámica Terra Sigillata", x: 1.5, y: 0.5, z: -1.0, rotY: 0 },
  { nombre: "Mosaico del Triclinium", x: 0, y: 0.05, z: 0, rotY: 0 },
  { nombre: "Enterramiento Medieval", x: -2.0, y: 0.5, z: 1.5, rotY: 45 },
  { nombre: "Muralla del Castro", x: -3.5, y: 1.0, z: 0, rotY: 0 },
  { nombre: "Hogar Prehistórico", x: 2.5, y: 0.3, z: 2.0, rotY: -30 },
];

const reconstrucciones = [
  { nombre: "Mosaico del Triclinium", ancho: 2.0, alto: 0.1, largo: 2.0, x: 0, y: 0.05, z: 0, descripcion: "Suelo de mosaico reconstruido", color: "#f39c12" },
  { nombre: "Muralla del Castro", ancho: 0.5, alto: 2.0, largo: 6.0, x: -3.5, y: 1.0, z: 0, descripcion: "Muralla a su altura original", color: "#2ecc71" },
];

type TabKey = "hallazgos" | "posiciones" | "reconstrucciones" | "csv";

const tabs: { key: TabKey; label: string }[] = [
  { key: "hallazgos", label: "Hallazgos" },
  { key: "posiciones", label: "Posiciones" },
  { key: "reconstrucciones", label: "Reconstrucciones" },
];

// ===== CSV parser =====
function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.trim().split("\n").filter(Boolean);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const rows = lines.slice(1).map((line) => line.split(",").map((c) => c.trim().replace(/^"|"$/g, "")));
  return { headers, rows };
}

// ===== Table wrapper =====
const ScrollTable = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-x-auto rounded-lg border border-border">
    <table className="w-full text-sm">{children}</table>
  </div>
);

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-secondary/50 whitespace-nowrap">
    {children}
  </th>
);

const Td = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-4 py-3 whitespace-nowrap border-t border-border ${className}`}>{children}</td>
);

// ===== Component =====
interface CSVViewerProps {
  className?: string;
}

const CSVViewer = ({ className = "" }: CSVViewerProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>("hallazgos");
  const [csvData, setCsvData] = useState<{ headers: string[]; rows: string[][] } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleCSV = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setCsvData(parseCSV(text));
      setActiveTab("csv");
    };
    reader.readAsText(file);
  }, []);

  const allTabs = csvData ? [...tabs, { key: "csv" as TabKey, label: "CSV importado" }] : tabs;

  return (
    <div className={`rounded-xl border border-border bg-card overflow-hidden ${className}`}>
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-border px-2 overflow-x-auto">
        <div className="flex">
          {allTabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                activeTab === t.key
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
              {activeTab === t.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />
              )}
            </button>
          ))}
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all mr-2 my-2 shrink-0"
        >
          <Upload size={12} /> Cargar CSV
        </button>
        <input ref={fileRef} type="file" accept=".csv" onChange={handleCSV} className="hidden" />
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === "hallazgos" && (
          <ScrollTable>
            <thead>
              <tr>
                <Th>Nombre</Th><Th>Periodo</Th><Th>Año</Th><Th>Descripción</Th>
              </tr>
            </thead>
            <tbody>
              {hallazgos.map((h, i) => (
                <tr key={i} className="hover:bg-secondary/30 transition-colors">
                  <Td>
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: h.color }} />
                      <span>{h.emoji} {h.nombre}</span>
                    </span>
                  </Td>
                  <Td><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{h.periodo}</span></Td>
                  <Td className="font-mono text-muted-foreground">{h.año > 0 ? h.año : `${Math.abs(h.año)} a.C.`}</Td>
                  <Td><span className="text-muted-foreground max-w-xs truncate block">{h.descripcion}</span></Td>
                </tr>
              ))}
            </tbody>
          </ScrollTable>
        )}

        {activeTab === "posiciones" && (
          <ScrollTable>
            <thead>
              <tr>
                <Th>Nombre</Th><Th>X</Th><Th>Y</Th><Th>Z</Th><Th>Rotación Y</Th>
              </tr>
            </thead>
            <tbody>
              {posiciones.map((p, i) => (
                <tr key={i} className="hover:bg-secondary/30 transition-colors">
                  <Td>{p.nombre}</Td>
                  <Td className="font-mono text-muted-foreground">{p.x}</Td>
                  <Td className="font-mono text-muted-foreground">{p.y}</Td>
                  <Td className="font-mono text-muted-foreground">{p.z}</Td>
                  <Td className="font-mono text-muted-foreground">{p.rotY}°</Td>
                </tr>
              ))}
            </tbody>
          </ScrollTable>
        )}

        {activeTab === "reconstrucciones" && (
          <ScrollTable>
            <thead>
              <tr>
                <Th>Nombre</Th><Th>Ancho</Th><Th>Alto</Th><Th>Largo</Th><Th>X</Th><Th>Y</Th><Th>Z</Th><Th>Descripción</Th>
              </tr>
            </thead>
            <tbody>
              {reconstrucciones.map((r, i) => (
                <tr key={i} className="hover:bg-secondary/30 transition-colors">
                  <Td>
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                      {r.nombre}
                    </span>
                  </Td>
                  <Td className="font-mono text-muted-foreground">{r.ancho}</Td>
                  <Td className="font-mono text-muted-foreground">{r.alto}</Td>
                  <Td className="font-mono text-muted-foreground">{r.largo}</Td>
                  <Td className="font-mono text-muted-foreground">{r.x}</Td>
                  <Td className="font-mono text-muted-foreground">{r.y}</Td>
                  <Td className="font-mono text-muted-foreground">{r.z}</Td>
                  <Td><span className="text-muted-foreground">{r.descripcion}</span></Td>
                </tr>
              ))}
            </tbody>
          </ScrollTable>
        )}

        {activeTab === "csv" && csvData && (
          <ScrollTable>
            <thead>
              <tr>
                {csvData.headers.map((h, i) => <Th key={i}>{h}</Th>)}
              </tr>
            </thead>
            <tbody>
              {csvData.rows.map((row, i) => (
                <tr key={i} className="hover:bg-secondary/30 transition-colors">
                  {row.map((cell, j) => <Td key={j}>{cell}</Td>)}
                </tr>
              ))}
            </tbody>
          </ScrollTable>
        )}

        {activeTab === "csv" && !csvData && (
          <div className="text-center py-12 text-muted-foreground">
            <Table2 size={32} className="mx-auto mb-3 opacity-50" />
            <p>Sube un archivo CSV para visualizarlo aquí.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CSVViewer;
