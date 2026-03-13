import { useState, useRef, Suspense, useCallback, useMemo, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { RotateCcw, Grid3X3, RefreshCw, Upload, Loader2 } from "lucide-react";

// ===== Placeholder: Hypocaustum pillars =====
const HypocaustumPillars = ({ wireframe }: { wireframe: boolean }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const positions = useMemo(
    () => [
      [-1.2, 0, -1.2], [-1.2, 0, 0], [-1.2, 0, 1.2],
      [0, 0, -1.2], [0, 0, 0], [0, 0, 1.2],
      [1.2, 0, -1.2], [1.2, 0, 0], [1.2, 0, 1.2],
    ] as [number, number, number][],
    []
  );

  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.65, 0]}>
        <boxGeometry args={[3.6, 0.15, 3.6]} />
        <meshStandardMaterial color="#b8860b" wireframe={wireframe} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[3.6, 0.1, 3.6]} />
        <meshStandardMaterial color="#b8860b" wireframe={wireframe} transparent opacity={0.4} />
      </mesh>
      {positions.map((pos, i) => (
        <mesh key={i} position={[pos[0], 0, pos[2]]}>
          <cylinderGeometry args={[0.18, 0.22, 1.2, 16]} />
          <meshStandardMaterial
            color="#daa520"
            wireframe={wireframe}
            transparent
            opacity={0.75}
            metalness={0.3}
            roughness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
};

// ===== Helpers =====
function getFileExtension(url: string): string {
  return url.split("?")[0].split(".").pop()?.toLowerCase() || "";
}

function autoScaleAndCenter(object: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  if (maxDim === 0) return;
  const scale = 2.5 / maxDim;
  object.scale.setScalar(scale);
  const center = box.getCenter(new THREE.Vector3());
  object.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
}

function applyWireframe(object: THREE.Object3D, wireframe: boolean) {
  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => { (m as THREE.MeshStandardMaterial).wireframe = wireframe; });
      } else {
        (mesh.material as THREE.MeshStandardMaterial).wireframe = wireframe;
      }
    }
  });
}

// ===== GLTF model loader =====
const GLTFModel = ({ url, wireframe, onError }: { url: string; wireframe: boolean; onError?: () => void }) => {
  const { scene } = useGLTF(url, undefined, undefined, (e) => {
    console.error("GLTF load error:", e);
    onError?.();
  });

  useMemo(() => applyWireframe(scene, wireframe), [scene, wireframe]);
  useMemo(() => autoScaleAndCenter(scene), [scene]);

  return <primitive object={scene} />;
};

// ===== STL model loader =====
const STLModel = ({ url, wireframe, onError }: { url: string; wireframe: boolean; onError?: () => void }) => {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const meshRef = useRef<THREE.Mesh>(null!);

  useEffect(() => {
    const loader = new STLLoader();
    loader.load(
      url,
      (geo) => {
        geo.computeVertexNormals();
        setGeometry(geo);
      },
      undefined,
      (e) => {
        console.error("STL load error:", e);
        onError?.();
      }
    );
  }, [url]);

  useEffect(() => {
    if (meshRef.current && geometry) {
      autoScaleAndCenter(meshRef.current);
    }
  }, [geometry]);

  if (!geometry) return null;

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial color="#daa520" wireframe={wireframe} metalness={0.3} roughness={0.5} />
    </mesh>
  );
};

// ===== OBJ model loader =====
const OBJModel = ({ url, wireframe, onError }: { url: string; wireframe: boolean; onError?: () => void }) => {
  const [object, setObject] = useState<THREE.Group | null>(null);

  useEffect(() => {
    const loader = new OBJLoader();
    loader.load(
      url,
      (obj) => {
        // Give default material to meshes without one
        obj.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (!mesh.material || (mesh.material as THREE.Material).type === "MeshBasicMaterial") {
              mesh.material = new THREE.MeshStandardMaterial({ color: "#daa520", metalness: 0.3, roughness: 0.5 });
            }
          }
        });
        autoScaleAndCenter(obj);
        setObject(obj);
      },
      undefined,
      (e) => {
        console.error("OBJ load error:", e);
        onError?.();
      }
    );
  }, [url]);

  useEffect(() => {
    if (object) applyWireframe(object, wireframe);
  }, [object, wireframe]);

  if (!object) return null;
  return <primitive object={object} />;
};

// ===== Model dispatcher =====
const ModelDispatcher = ({ url, wireframe, onError }: { url: string; wireframe: boolean; onError?: () => void }) => {
  const ext = getFileExtension(url);

  if (ext === "stl") return <STLModel url={url} wireframe={wireframe} onError={onError} />;
  if (ext === "obj") return <OBJModel url={url} wireframe={wireframe} onError={onError} />;
  return <GLTFModel url={url} wireframe={wireframe} onError={onError} />;
};

// ===== Loading spinner overlay =====
const LoadingOverlay = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-10 rounded-xl">
    <div className="flex flex-col items-center gap-3">
      <Loader2 size={32} className="text-primary animate-spin" />
      <span className="text-sm text-muted-foreground font-medium">Cargando modelo…</span>
    </div>
  </div>
);

// ===== Main component =====
interface ModelViewerProps {
  modelUrl?: string;
  className?: string;
  compact?: boolean;
}

const ModelViewer = ({ modelUrl, className = "", compact = false }: ModelViewerProps) => {
  const [localUrl, setLocalUrl] = useState<string | null>(null);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [modelError, setModelError] = useState(false);
  const controlsRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeUrl = modelError ? null : (localUrl || modelUrl || null);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setModelError(false);
    setLoading(true);
    const url = URL.createObjectURL(file);
    setLocalUrl(url);
    setTimeout(() => setLoading(false), 100);
  }, []);

  const resetCamera = useCallback(() => {
    controlsRef.current?.reset();
  }, []);

  return (
    <div className={`relative w-full ${compact ? "h-full" : "h-[400px] md:h-[500px]"} rounded-xl border border-border bg-card overflow-hidden ${className}`}>
      {loading && <LoadingOverlay />}

      {/* Floating controls */}
      {!compact && (
        <div className="absolute top-3 right-3 z-20 flex gap-2">
          <button
            onClick={resetCamera}
            className="p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
            title="Reset cámara"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={() => setWireframe((w) => !w)}
            className={`p-2 rounded-lg backdrop-blur-sm border transition-all ${wireframe ? "bg-primary/20 border-primary/40 text-primary" : "bg-background/80 border-border text-muted-foreground hover:text-foreground hover:border-primary/40"}`}
            title="Wireframe on/off"
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setAutoRotate((r) => !r)}
            className={`p-2 rounded-lg backdrop-blur-sm border transition-all ${autoRotate ? "bg-primary/20 border-primary/40 text-primary" : "bg-background/80 border-border text-muted-foreground hover:text-foreground hover:border-primary/40"}`}
            title="Auto-rotate on/off"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      )}

      {/* Upload button */}
      {!compact && (
        <div className="absolute bottom-3 left-3 z-20">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
          >
            <Upload size={14} /> Subir modelo 3D
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".glb,.gltf,.stl,.obj,.fbx"
            onChange={handleFile}
            className="hidden"
          />
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [3, 2.5, 3], fov: 45 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <Environment preset="apartment" />
          {activeUrl ? (
            <ModelDispatcher url={activeUrl} wireframe={wireframe} onError={() => setModelError(true)} />
          ) : (
            <HypocaustumPillars wireframe={wireframe} />
          )}
        </Suspense>
        <OrbitControls
          ref={controlsRef}
          autoRotate={autoRotate}
          autoRotateSpeed={1.5}
          enableZoom
          enablePan
          minDistance={1.5}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
