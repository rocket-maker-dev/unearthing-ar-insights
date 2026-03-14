import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Smartphone, Globe, Gamepad2, Box, Eye, ChevronRight, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import AnimatedSection from "@/components/AnimatedSection";

/* ── tiny helpers ── */
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
    {children}
  </span>
);

const FlowStep = ({ name, desc, accent }: { name: string; desc: string; accent?: boolean }) => (
  <div className={`rounded-xl border p-5 ${accent ? "border-green-500/50 bg-green-500/5" : "border-border bg-card"}`}>
    <p className="font-semibold text-foreground text-sm">{name}</p>
    <p className="text-muted-foreground text-xs mt-1">{desc}</p>
  </div>
);

const FlowArrow = () => <div className="text-center text-muted-foreground text-lg select-none">↓</div>;

const TechCard = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => (
  <div className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
    <div className="text-2xl mb-3">{icon}</div>
    <h4 className="font-semibold text-foreground mb-2 text-sm">{title}</h4>
    <p className="text-muted-foreground text-xs leading-relaxed">{desc}</p>
  </div>
);

const CodeBlock = ({ lang, code }: { lang: string; code: string }) => (
  <div className="rounded-xl border border-border bg-secondary/50 overflow-hidden mb-6">
    <div className="px-4 py-2 border-b border-border bg-secondary/80 text-xs font-mono text-primary">{lang}</div>
    <pre className="p-4 overflow-x-auto text-xs leading-relaxed font-mono text-muted-foreground whitespace-pre">{code}</pre>
  </div>
);

const Callout = ({ type, children }: { type: "info" | "warn"; children: React.ReactNode }) => (
  <div className={`rounded-xl border p-4 mb-6 text-sm ${type === "warn" ? "border-yellow-500/30 bg-yellow-500/5 text-yellow-200/80" : "border-primary/30 bg-primary/5 text-muted-foreground"}`}>
    {children}
  </div>
);

/* ── Timeline item ── */
const TimelineItem = ({ tag, tagType, title, children }: { tag: string; tagType: "fail" | "partial" | "ok"; title: string; children: React.ReactNode }) => {
  const colors = { fail: "text-red-400 border-red-400/30 bg-red-400/10", partial: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10", ok: "text-green-400 border-green-400/30 bg-green-400/10" };
  const dotColors = { fail: "bg-red-400", partial: "bg-yellow-400", ok: "bg-green-400" };
  return (
    <div className="relative pl-8 pb-10 border-l border-border last:border-l-0 last:pb-0">
      <div className={`absolute left-0 top-1 w-3 h-3 rounded-full -translate-x-1.5 ${dotColors[tagType]}`} />
      <span className={`inline-block text-xs font-semibold rounded-full border px-2.5 py-0.5 mb-2 ${colors[tagType]}`}>{tag}</span>
      <h4 className="font-bold text-foreground mb-2">{title}</h4>
      <div className="text-muted-foreground text-sm leading-relaxed">{children}</div>
    </div>
  );
};

/* ── Glossary item ── */
const GlossaryItem = ({ term, desc }: { term: string; desc: string }) => (
  <div className="rounded-lg border border-border bg-card p-4">
    <dt className="font-semibold text-foreground text-sm">{term}</dt>
    <dd className="text-muted-foreground text-xs mt-1 leading-relaxed">{desc}</dd>
  </div>
);

const Tecnologia = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20">
        {/* Breadcrumb */}
        <div className="max-w-5xl mx-auto px-6 pt-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">{t("docs.home")}</Link>
            <ChevronRight size={14} />
            <span className="text-foreground font-medium">{t("tech.breadcrumb")}</span>
          </div>
        </div>

        {/* HERO */}
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <AnimatedSection>
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">🔬 {t("tech.hero_tag")}</p>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">{t("tech.hero_title")}</h1>
            <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed mb-8">{t("tech.hero_desc")}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge>🤖 Android ARCore</Badge>
              <Badge>🌐 WebXR API</Badge>
              <Badge>🎮 Three.js</Badge>
              <Badge>📦 Scaniverse</Badge>
              <Badge>👁️ OpenCV</Badge>
            </div>
          </AnimatedSection>

          {/* Stats */}
          <AnimatedSection delay={0.15}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {[
                { n: "5", label: t("tech.stat_techs") },
                { n: "15K", label: t("tech.stat_synthetic"), color: "text-red-400" },
                { n: "112K", label: t("tech.stat_orb"), color: "text-purple-400" },
                { n: "1", label: t("tech.stat_final"), color: "text-green-400" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-card p-5 text-center">
                  <div className={`text-3xl font-bold ${s.color || "text-primary"}`}>{s.n}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </section>

        <hr className="border-border max-w-5xl mx-auto" />

        {/* STACK FINAL */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <AnimatedSection>
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">{t("tech.stack_label")}</p>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">{t("tech.stack_title")}</h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-3xl leading-relaxed">{t("tech.stack_desc")}</p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="max-w-md mx-auto space-y-2">
              <FlowStep name="📱 Android (Chrome)" desc={t("tech.flow1")} />
              <FlowArrow />
              <FlowStep name="🌐 WebXR API" desc={t("tech.flow2")} />
              <FlowArrow />
              <FlowStep name="🎮 Three.js" desc={t("tech.flow3")} />
              <FlowArrow />
              <FlowStep name="📦 GLB de Scaniverse" desc={t("tech.flow4")} />
              <FlowArrow />
              <FlowStep name="✅ Objeto AR anclado" desc={t("tech.flow5")} accent />
            </div>
          </AnimatedSection>
        </section>

        <hr className="border-border max-w-5xl mx-auto" />

        {/* CAMINO - TIMELINE */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <AnimatedSection>
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">{t("tech.path_label")}</p>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">{t("tech.path_title")}</h2>
            <p className="text-muted-foreground text-lg mb-12 max-w-3xl leading-relaxed">{t("tech.path_desc")}</p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="max-w-2xl">
              <TimelineItem tag="❌ Descartado" tagType="fail" title={t("tech.phase1_title")}>
                <p>{t("tech.phase1_body")}</p>
                <p className="mt-2"><strong className="text-foreground">{t("tech.phase1_lesson")}</strong></p>
              </TimelineItem>
              <TimelineItem tag="❌ Descartado" tagType="fail" title={t("tech.phase2_title")}>
                <p>{t("tech.phase2_body")}</p>
              </TimelineItem>
              <TimelineItem tag="❌ 0 matches" tagType="fail" title={t("tech.phase3_title")}>
                <p>{t("tech.phase3_body")}</p>
              </TimelineItem>
              <TimelineItem tag="⚠️ Parcial" tagType="partial" title={t("tech.phase4_title")}>
                <p>{t("tech.phase4_body")}</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                  <li>{t("tech.phase4_issue1")}</li>
                  <li>{t("tech.phase4_issue2")}</li>
                  <li>{t("tech.phase4_issue3")}</li>
                  <li>{t("tech.phase4_issue4")}</li>
                </ul>
              </TimelineItem>
              <TimelineItem tag="✅ Final" tagType="ok" title={t("tech.phase5_title")}>
                <p>{t("tech.phase5_body")}</p>
              </TimelineItem>
            </div>
          </AnimatedSection>
        </section>

        <hr className="border-border max-w-5xl mx-auto" />

        {/* WEBXR */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <AnimatedSection>
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">{t("tech.webxr_label")}</p>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">🌐 WebXR API — {t("tech.webxr_subtitle")}</h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-3xl leading-relaxed">{t("tech.webxr_desc")}</p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <TechCard icon="📡" title={t("tech.webxr_hw_title")} desc={t("tech.webxr_hw_desc")} />
              <TechCard icon="🗺️" title="Hit Testing" desc={t("tech.webxr_hit_desc")} />
              <TechCard icon="🔄" title={t("tech.webxr_pose_title")} desc={t("tech.webxr_pose_desc")} />
            </div>

            <Callout type="info">
              <strong>💡 {t("tech.webxr_why_title")}</strong><br />
              {t("tech.webxr_why_body")}
            </Callout>

            <CodeBlock lang="JavaScript" code={`// 1. Comprobar soporte WebXR
if (navigator.xr) {
  const supported = await navigator.xr.isSessionSupported('immersive-ar');
  if (supported) console.log("✅ WebXR AR disponible");
}

// 2. Iniciar sesión AR
async function startAR() {
  session = await navigator.xr.requestSession('immersive-ar', {
    requiredFeatures: ['hit-test', 'local-floor'],
    optionalFeatures: ['depth-sensing']
  });
}

// 3. Obtener posición del dispositivo cada frame
function onXRFrame(time, frame) {
  session.requestAnimationFrame(onXRFrame);
  const pose = frame.getViewerPose(referenceSpace);
  if (pose) {
    camera.matrix.fromArray(pose.views[0].transform.matrix);
    renderer.render(scene, camera);
  }
}

// 4. Hit testing — detectar el suelo
const hitTestSource = await session.requestHitTestSource({
  space: viewerSpace
});
const hitResults = frame.getHitTestResults(hitTestSource);
if (hitResults.length > 0) {
  const hitPose = hitResults[0].getPose(referenceSpace);
  reticle.position.setFromMatrixPosition(hitPose.transform.matrix);
}`} />

            <Callout type="warn">
              <strong>⚠️ {t("tech.webxr_compat")}</strong>
            </Callout>
          </AnimatedSection>
        </section>

        <hr className="border-border max-w-5xl mx-auto" />

        {/* THREE.JS */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <AnimatedSection>
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">{t("tech.three_label")}</p>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">🎮 Three.js — {t("tech.three_subtitle")}</h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-3xl leading-relaxed">{t("tech.three_desc")}</p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <TechCard icon="🎬" title="Scene" desc={t("tech.three_scene")} />
              <TechCard icon="📷" title="Camera" desc={t("tech.three_camera")} />
              <TechCard icon="💡" title="Renderer" desc={t("tech.three_renderer")} />
              <TechCard icon="📦" title="Mesh" desc={t("tech.three_mesh")} />
              <TechCard icon="🗂️" title="GLB / GLTF Loader" desc={t("tech.three_glb")} />
              <TechCard icon="🔢" title={t("tech.three_math_title")} desc={t("tech.three_math_desc")} />
            </div>

            <CodeBlock lang="JavaScript" code={`// Colocar un objeto en el suelo
function placeObject(hitPose) {
  const geometry = new THREE.SphereGeometry(0.05, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffd700, roughness: 0.3, metalness: 0.8
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.setFromMatrixPosition(hitPose.transform.matrix);
  scene.add(mesh);
}

// Cargar modelo GLB de Scaniverse
const loader = new GLTFLoader();
loader.load('escaneo_termas.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(1, 1, 1);
  scene.add(model);
});`} />

            <CodeBlock lang="JavaScript — Setup completo AR" code={`import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true  // transparente → se ve la cámara AR detrás
});

renderer.xr.enabled = true;
document.body.appendChild(ARButton.createButton(renderer, {
  requiredFeatures: ['hit-test']
}));

scene.add(new THREE.AmbientLight(0xffffff, 0.8));
scene.add(new THREE.DirectionalLight(0xffffff, 1.0));

renderer.setAnimationLoop(function(time, frame) {
  if (frame) {
    // hit-test y placement aquí
  }
  renderer.render(scene, camera);
});`} />
          </AnimatedSection>
        </section>

        <hr className="border-border max-w-5xl mx-auto" />

        {/* LIDAR + SCANIVERSE */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <AnimatedSection>
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">{t("tech.lidar_label")}</p>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">📡 LiDAR + Scaniverse</h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-3xl leading-relaxed">{t("tech.lidar_desc")}</p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <TechCard icon="⚡" title={t("tech.lidar_how_title")} desc={t("tech.lidar_how_desc")} />
              <TechCard icon="📲" title="Scaniverse" desc={t("tech.lidar_scaniverse_desc")} />
              <TechCard icon="📦" title={t("tech.lidar_glb_title")} desc={t("tech.lidar_glb_desc")} />
            </div>

            <Callout type="info">
              <strong>🔑 {t("tech.lidar_insight_title")}</strong><br />
              {t("tech.lidar_insight_body")}
            </Callout>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "📱", title: t("tech.lidar_step1"), desc: t("tech.lidar_step1_desc") },
                { icon: "⚙️", title: t("tech.lidar_step2"), desc: t("tech.lidar_step2_desc") },
                { icon: "📤", title: t("tech.lidar_step3"), desc: t("tech.lidar_step3_desc") },
                { icon: "🌐", title: t("tech.lidar_step4"), desc: t("tech.lidar_step4_desc") },
              ].map((s) => (
                <div key={s.title} className="rounded-xl border border-border bg-card p-4 text-center">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">{s.title}</h4>
                  <p className="text-muted-foreground text-xs">{s.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </section>

        <hr className="border-border max-w-5xl mx-auto" />

        {/* OPENCV */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <AnimatedSection>
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">{t("tech.opencv_label")}</p>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">👁️ OpenCV + ORB</h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-3xl leading-relaxed">{t("tech.opencv_desc")}</p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <Callout type="info">
              <strong>🔍 {t("tech.opencv_orb_title")}</strong><br />
              {t("tech.opencv_orb_body")}
            </Callout>

            <CodeBlock lang="Python" code={`import cv2
import numpy as np

# Crear detector ORB
orb = cv2.ORB_create(nfeatures=5000)

# Detectar keypoints y descriptores
img = cv2.imread('foto_espacio.jpg')
keypoints, descriptors = orb.detectAndCompute(img, None)
print(f"Detectados {len(keypoints)} keypoints")

# Feature matching con BFMatcher
bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
matches = bf.match(descriptors_query, descriptors_map)
matches = sorted(matches, key=lambda x: x.distance)
good_matches = [m for m in matches if m.distance < 50]`} />

            <CodeBlock lang="Python — solvePnP" code={`success, rvec, tvec, inliers = cv2.solvePnPRansac(
    object_points, image_points,
    camera_matrix, dist_coeffs,
    reprojectionError=8.0
)
# rvec → rotación, tvec → traslación
# ⚠️ OpenCV usa Y↓, Three.js usa Y↑
if success:
    R, _ = cv2.Rodrigues(rvec)
    camera_matrix_4x4 = buildMatrix(R, tvec)`} />

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <p className="text-red-400 font-semibold text-sm mb-1">❌ {t("tech.opencv_fail1_title")}</p>
                <p className="text-muted-foreground text-xs">{t("tech.opencv_fail1_desc")}</p>
              </div>
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <p className="text-red-400 font-semibold text-sm mb-1">❌ {t("tech.opencv_fail2_title")}</p>
                <p className="text-muted-foreground text-xs">{t("tech.opencv_fail2_desc")}</p>
              </div>
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <p className="text-red-400 font-semibold text-sm mb-1">❌ {t("tech.opencv_fail3_title")}</p>
                <p className="text-muted-foreground text-xs">{t("tech.opencv_fail3_desc")}</p>
              </div>
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                <p className="text-green-400 font-semibold text-sm mb-1">✅ {t("tech.opencv_solution_title")}</p>
                <p className="text-muted-foreground text-xs">{t("tech.opencv_solution_desc")}</p>
              </div>
            </div>
          </AnimatedSection>
        </section>

        <hr className="border-border max-w-5xl mx-auto" />

        {/* GLOSSARY */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <AnimatedSection>
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">{t("tech.glossary_label")}</p>
            <h2 className="text-2xl md:text-4xl font-bold mb-10">📚 {t("tech.glossary_title")}</h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {([
                ["WebXR", t("tech.g_webxr")],
                ["Hit Testing", t("tech.g_hittest")],
                ["Three.js", t("tech.g_threejs")],
                ["GLB / GLTF", t("tech.g_glb")],
                ["LiDAR", t("tech.g_lidar")],
                ["Scaniverse", t("tech.g_scaniverse")],
                ["Nube de puntos", t("tech.g_pointcloud")],
                ["Malla 3D (Mesh)", t("tech.g_mesh")],
                ["ARKit", t("tech.g_arkit")],
                ["OpenCV", t("tech.g_opencv")],
                ["Descriptor ORB", t("tech.g_orb")],
                ["Feature Matching", t("tech.g_matching")],
                ["solvePnP", t("tech.g_solvepnp")],
                ["RANSAC", t("tech.g_ransac")],
                ["WebSocket", t("tech.g_websocket")],
                ["Quaternion", t("tech.g_quaternion")],
                ["Pose", t("tech.g_pose")],
                ["Reticle", t("tech.g_reticle")],
                ["WebGL", t("tech.g_webgl")],
                ["Frame", t("tech.g_frame")],
              ] as [string, string][]).map(([term, desc]) => (
                <GlossaryItem key={term} term={term} desc={desc} />
              ))}
            </dl>
          </AnimatedSection>
        </section>

        <hr className="border-border max-w-5xl mx-auto" />

        {/* RESOURCES */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <AnimatedSection>
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">{t("tech.resources_label")}</p>
            <h2 className="text-2xl md:text-4xl font-bold mb-10">📖 {t("tech.resources_title")}</h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="grid sm:grid-cols-3 gap-4">
              <a href="https://immersive-web.github.io/webxr-samples" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors group">
                <div className="text-2xl mb-3">🌐</div>
                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">WebXR Samples</h4>
                <p className="text-muted-foreground text-xs mt-1">{t("tech.res_webxr")}</p>
              </a>
              <a href="https://threejs-journey.com/" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors group">
                <div className="text-2xl mb-3">🎮</div>
                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">Three.js Journey</h4>
                <p className="text-muted-foreground text-xs mt-1">{t("tech.res_threejs")}</p>
              </a>
              <a href="https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors group">
                <div className="text-2xl mb-3">👁️</div>
                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">OpenCV Python</h4>
                <p className="text-muted-foreground text-xs mt-1">{t("tech.res_opencv")}</p>
              </a>
            </div>
          </AnimatedSection>
        </section>

        {/* Footer nav */}
        <div className="max-w-5xl mx-auto px-6 pb-16">
          <div className="pt-8 border-t border-border flex flex-wrap items-center gap-4">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={14} /> {t("docs.back_home")}
            </Link>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="inline-flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4">
              ↑ {t("docs.back_top")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tecnologia;
