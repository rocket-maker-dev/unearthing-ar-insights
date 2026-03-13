import { useState, useRef, Suspense, useCallback, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
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
      {/* Base slab */}
      <mesh position={[0, -0.65, 0]}>
        <boxGeometry args={[3.6, 0.15, 3.6]} />
        <meshStandardMaterial color="#b8860b" wireframe={wireframe} transparent opacity={0.6} />
      </mesh>
      {/* Top slab */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[3.6, 0.1, 3.6]} />
        <meshStandardMaterial color="#b8860b" wireframe={wireframe} transparent opacity={0.4} />
      </mesh>
      {/* Pillars */}
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

// ===== GLTF model loader =====
const GLTFModel = ({ url, wireframe }: { url: string; wireframe: boolean }) => {
  const { scene } = useGLTF(url);

  useMemo(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => { (m as THREE.MeshStandardMaterial).wireframe = wireframe; });
        } else {
          (mesh.material as THREE.MeshStandardMaterial).wireframe = wireframe;
        }
      }
    });
  }, [scene, wireframe]);

  // Auto-scale and center
  useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.5 / maxDim;
    scene.scale.setScalar(scale);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  }, [scene]);

  return <primitive object={scene} />;
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
}

const ModelViewer = ({ modelUrl, className = "" }: ModelViewerProps) => {
  const [localUrl, setLocalUrl] = useState<string | null>(null);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [loading, setLoading] = useState(false);
  const controlsRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeUrl = localUrl || modelUrl || null;

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const url = URL.createObjectURL(file);
    setLocalUrl(url);
    // Loading will be handled by Suspense fallback
    setTimeout(() => setLoading(false), 100);
  }, []);

  const resetCamera = useCallback(() => {
    controlsRef.current?.reset();
  }, []);

  return (
    <div className={`relative w-full h-[400px] md:h-[500px] rounded-xl border border-border bg-card overflow-hidden ${className}`}>
      {loading && <LoadingOverlay />}

      {/* Floating controls */}
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

      {/* Upload button */}
      <div className="absolute bottom-3 left-3 z-20">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
        >
          <Upload size={14} /> Subir .glb / .gltf
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".glb,.gltf"
          onChange={handleFile}
          className="hidden"
        />
      </div>

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
            <GLTFModel url={activeUrl} wireframe={wireframe} />
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
