# 🔭 AR Archaeology Platform — Developer Documentation

> Plataforma open source de Realidad Aumentada para excavaciones arqueológicas.
> Desarrollada por Maker Lab (Espacio Vivo, Ferrol) para FIRST LEGO League 2026.

---

## 📋 Índice

1. [Visión general](#visión-general)
2. [Arquitectura del sistema](#arquitectura-del-sistema)
3. [Requisitos](#requisitos)
4. [Quick Start](#quick-start)
5. [Stack tecnológico](#stack-tecnológico)
6. [Guía de desarrollo](#guía-de-desarrollo)
   - [WebXR — Sesión AR](#webxr--sesión-ar)
   - [Three.js — Escena 3D](#threejs--escena-3d)
   - [Hit Testing — Detección de superficies](#hit-testing--detección-de-superficies)
   - [Carga de modelos GLB](#carga-de-modelos-glb)
   - [Anclaje de objetos](#anclaje-de-objetos)
7. [Escaneo con Scaniverse (LiDAR)](#escaneo-con-scaniverse-lidar)
8. [Estructura de archivos](#estructura-de-archivos)
9. [Despliegue](#despliegue)
10. [Compatibilidad](#compatibilidad)
11. [Errores conocidos y soluciones](#errores-conocidos-y-soluciones)
12. [Historial de iteraciones](#historial-de-iteraciones)
13. [API Reference](#api-reference)
14. [Contribuir](#contribuir)
15. [Licencia](#licencia)

---

## Visión general

Esta plataforma permite **visualizar objetos arqueológicos en Realidad Aumentada** directamente desde el navegador del móvil, sin instalar apps. El usuario apunta con la cámara al espacio de excavación y los objetos aparecen anclados en su posición real.

### ¿Qué problema resuelve?

En una excavación arqueológica, mover un objeto antes de documentarlo correctamente puede destruir información para siempre. Nuestra herramienta permite:

- **Visualizar** objetos en su posición original tras ser extraídos
- **Documentar** la disposición espacial con precisión milimétrica (LiDAR)
- **Compartir** la experiencia con cualquier persona que tenga un iPhone

### Principio de diseño

```
El iPhone YA SABE dónde está en el espacio.
No necesitamos calcular su posición externamente.
Solo necesitamos darle los objetos 3D para renderizar.
```

---

## Arquitectura del sistema

```
┌─────────────────────────────────────────────────────┐
│                    USUARIO                          │
│              (iPhone + Safari)                      │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                  SAFARI (iOS)                       │
│                                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │   WebXR API │  │   WebGL 2    │  │  ARKit    │ │
│  │  (sesión AR)│  │ (renderizado)│  │ (tracking)│ │
│  └──────┬──────┘  └──────┬───────┘  └─────┬─────┘ │
│         │                │                 │       │
│         ▼                ▼                 ▼       │
│  ┌──────────────────────────────────────────────┐  │
│  │              NUESTRA WEBAPP                   │  │
│  │                                               │  │
│  │  ┌──────────┐  ┌───────────┐  ┌───────────┐ │  │
│  │  │ Three.js │  │ GLTFLoader│  │ Hit Test  │ │  │
│  │  │ (escena) │  │ (modelos) │  │ (anclaje) │ │  │
│  │  └──────────┘  └───────────┘  └───────────┘ │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                SERVIDOR WEB                         │
│  (archivos estáticos: HTML + JS + GLB)              │
│  No hay backend — todo corre en el cliente          │
└─────────────────────────────────────────────────────┘
```

**Punto clave:** No hay servidor de procesamiento. Todo el tracking y renderizado ocurre en el dispositivo del usuario. El servidor solo sirve archivos estáticos.

---

## Requisitos

### Para usuarios

| Requisito | Mínimo |
|-----------|--------|
| Dispositivo | iPhone 12 Pro o superior (necesita LiDAR) |
| Sistema | iOS 16+ |
| Navegador | Safari (obligatorio — Chrome en iOS no accede a ARKit) |

### Para desarrolladores

| Herramienta | Versión | Uso |
|-------------|---------|-----|
| Node.js | 18+ | Servidor de desarrollo local (opcional) |
| Three.js | r150+ | Motor 3D |
| Scaniverse | Última | Escaneo LiDAR (solo iPhone Pro/Max) |
| Editor | VS Code, Cursor, o cualquiera | Código |
| Servidor web | Cualquiera con HTTPS | **HTTPS obligatorio** para WebXR |

> ⚠️ **HTTPS es obligatorio.** WebXR no funciona en HTTP sin cifrar. Para desarrollo local puedes usar `npx serve --ssl` o `vite --https`.

---

## Quick Start

### Opción 1: Desarrollo local

```bash
# 1. Clonar el repositorio
git clone https://github.com/maker-lab-ferrol/ar-archaeology.git
cd ar-archaeology

# 2. Instalar dependencias (opcional, para dev server)
npm install

# 3. Arrancar servidor HTTPS local
npm run dev
# → https://localhost:3000

# 4. Abrir en Safari del iPhone (misma red WiFi)
# → https://TU_IP_LOCAL:3000
```

### Opción 2: Despliegue directo

```bash
# Subir los archivos a cualquier hosting con HTTPS
# Estructura mínima:
#   index.html
#   app.js
#   models/
#     └── escaneo.glb
#     └── objetos/
#         ├── vasija.glb
#         └── moneda.glb
```

### Opción 3: Versión mínima (un solo archivo)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AR Demo</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r150/three.min.js"></script>
  <script src="https://unpkg.com/three@0.150.0/examples/js/webxr/ARButton.js"></script>
</head>
<body>
<script>
  // Escena básica
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
  
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);
  
  // Botón AR
  document.body.appendChild(ARButton.createButton(renderer, {
    requiredFeatures: ['hit-test']
  }));
  
  // Luz
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  scene.add(new THREE.DirectionalLight(0xffffff, 1.0));
  
  // Reticle (indicador de superficie)
  const reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  );
  reticle.visible = false;
  scene.add(reticle);
  
  // Variables de hit test
  let hitTestSource = null;
  let hitTestSourceRequested = false;
  
  // Colocar objeto al tocar
  const controller = renderer.xr.getController(0);
  controller.addEventListener('select', () => {
    if (reticle.visible) {
      const geo = new THREE.SphereGeometry(0.05, 32, 32);
      const mat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.3, metalness: 0.8 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.setFromMatrixPosition(reticle.matrix);
      scene.add(mesh);
    }
  });
  scene.add(controller);
  
  // Bucle de renderizado
  renderer.setAnimationLoop((timestamp, frame) => {
    if (frame) {
      const referenceSpace = renderer.xr.getReferenceSpace();
      const session = renderer.xr.getSession();
      
      // Solicitar hit test source
      if (!hitTestSourceRequested) {
        session.requestReferenceSpace('viewer').then(viewerSpace => {
          session.requestHitTestSource({ space: viewerSpace }).then(source => {
            hitTestSource = source;
          });
        });
        hitTestSourceRequested = true;
      }
      
      // Procesar hit test
      if (hitTestSource) {
        const results = frame.getHitTestResults(hitTestSource);
        if (results.length > 0) {
          const hit = results[0];
          reticle.visible = true;
          reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
        } else {
          reticle.visible = false;
        }
      }
    }
    renderer.render(scene, camera);
  });
</script>
</body>
</html>
```

> ☝️ Este ejemplo coloca esferas doradas en el suelo al tocar. Funciona en Safari (iOS) con WebXR.

---

## Stack tecnológico

### Componentes activos (solución final)

| Tecnología | Rol | ¿Por qué? |
|-----------|-----|-----------|
| **WebXR API** | Tracking del dispositivo en el espacio | API nativa del navegador, accede a ARKit sin apps |
| **Three.js r150** | Motor de renderizado 3D | Estándar de la industria, excelente documentación, soporte WebXR |
| **GLTFLoader** | Carga de modelos 3D | Formato estándar web, un archivo con geometría + texturas |
| **Scaniverse** | Escaneo LiDAR del espacio | Gratis, exporta GLB, precisión milimétrica |
| **ARKit** (bajo Safari) | Fusión de sensores para tracking | Cámara + giroscopio + acelerómetro + LiDAR en tiempo real |

### Componentes descartados (historial)

| Tecnología | Fase | Motivo del descarte |
|-----------|------|-------------------|
| Mattercraft (ZapWorks) | 1 | Sin anclaje espacial — objetos "pegados" a la pantalla |
| Immersal SDK | 2 | Solo funciona con Unity (app nativa), no web |
| OpenCV + ORB sintético | 3 | 0 matches entre descriptores generados y fotos reales |
| OpenCV + ORB real + solvePnP | 4 | Latencia alta, falsos positivos, bug de coordenadas Y↑/Y↓ |
| Serveo (túnel SSH) | 4 | Caídas cada 15-30 min |
| Cloudflare Tunnel | 4 | Más estable, pero el enfoque servidor era incorrecto |

---

## Guía de desarrollo

### WebXR — Sesión AR

WebXR es la API del navegador que nos da acceso al tracking AR. En Safari (iOS), usa ARKit internamente.

#### Comprobar soporte

```javascript
async function checkXRSupport() {
  if (!navigator.xr) {
    console.log('WebXR no disponible en este navegador');
    return false;
  }
  
  const supported = await navigator.xr.isSessionSupported('immersive-ar');
  if (!supported) {
    console.log('AR no soportado en este dispositivo');
    return false;
  }
  
  return true;
}
```

#### Iniciar sesión AR

```javascript
async function startARSession() {
  const session = await navigator.xr.requestSession('immersive-ar', {
    requiredFeatures: ['hit-test', 'local-floor'],
    optionalFeatures: ['depth-sensing', 'light-estimation']
  });
  
  // Vincular el renderer de Three.js a la sesión XR
  renderer.xr.setReferenceSpaceType('local-floor');
  await renderer.xr.setSession(session);
  
  return session;
}
```

**Features disponibles:**

| Feature | Uso | Obligatoria? |
|---------|-----|-------------|
| `hit-test` | Detectar superficies reales (suelo, paredes) | ✅ Sí |
| `local-floor` | Referencia al nivel del suelo | ✅ Sí |
| `depth-sensing` | Datos de profundidad del LiDAR | ❌ Opcional |
| `light-estimation` | Iluminación ambiente real | ❌ Opcional |
| `anchors` | Anclajes persistentes | ❌ Opcional |

#### Ciclo de vida de la sesión

```
requestSession() → session.start → onXRFrame (loop) → session.end
                                        │
                                        ├── getViewerPose()     → posición/orientación cámara
                                        ├── getHitTestResults() → intersecciones con superficies
                                        └── render()            → dibujar frame
```

---

### Three.js — Escena 3D

#### Setup del renderer para AR

```javascript
import * as THREE from 'three';

// El renderer DEBE tener alpha: true para que se vea la cámara AR detrás
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true          // ← IMPRESCINDIBLE para AR
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limitar a 2x en iOS
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;  // ← Activar modo XR

// NO usar shadowMap en iOS — causa crashes en Safari
// renderer.shadowMap.enabled = true;  ← NO HACER ESTO

// NO usar fog — puede fallar en iOS
// scene.fog = new THREE.FogExp2(...)  ← NO HACER ESTO
```

> ⚠️ **Regla de iOS:** No usar `shadowMap`, `fog`, ni `PCFSoftShadowMap`. Causan crashes silenciosos en Safari.

#### Iluminación para AR

```javascript
// La iluminación debe simular el entorno real
// Ambient para base + directional para sombras suaves

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Opcional: usar light estimation de WebXR para igualar la luz real
// Esto requiere 'light-estimation' en optionalFeatures
```

#### Materiales recomendados

```javascript
// Para objetos arqueológicos — aspecto realista
const ceramicMaterial = new THREE.MeshStandardMaterial({
  color: 0xc4783e,     // terracota
  roughness: 0.85,     // mate
  metalness: 0.05      // no metálico
});

// Para objetos metálicos (monedas, herramientas)
const metalMaterial = new THREE.MeshStandardMaterial({
  color: 0xb8860b,     // oro oscuro
  roughness: 0.3,      // semi-pulido
  metalness: 0.9       // muy metálico
});

// Para el escaneo LiDAR (referencia visual)
const scanMaterial = new THREE.MeshBasicMaterial({
  color: 0x4f8ef7,
  wireframe: true,      // solo líneas — se ve el entorno real
  transparent: true,
  opacity: 0.15
});
```

---

### Hit Testing — Detección de superficies

El hit test es lo que permite colocar objetos "en el suelo real". Lanza un rayo invisible desde el centro de la pantalla y detecta dónde choca con una superficie.

```javascript
let hitTestSource = null;

// Solicitar fuente de hit test (una vez)
async function setupHitTest(session) {
  const viewerSpace = await session.requestReferenceSpace('viewer');
  hitTestSource = await session.requestHitTestSource({ space: viewerSpace });
}

// En cada frame: buscar intersecciones
function processHitTest(frame, referenceSpace) {
  if (!hitTestSource) return null;
  
  const results = frame.getHitTestResults(hitTestSource);
  
  if (results.length > 0) {
    const hit = results[0];
    const pose = hit.getPose(referenceSpace);
    
    return {
      position: pose.transform.position,
      orientation: pose.transform.orientation,
      matrix: pose.transform.matrix
    };
  }
  
  return null;
}
```

#### Visualizar el reticle

```javascript
// Crear reticle (punto de mira AR)
const reticleGeometry = new THREE.RingGeometry(0.15, 0.2, 32);
reticleGeometry.rotateX(-Math.PI / 2);
const reticleMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide
});
const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
reticle.matrixAutoUpdate = false;  // ← Importante: actualizamos la matrix manualmente
reticle.visible = false;
scene.add(reticle);

// En el render loop:
function updateReticle(frame, referenceSpace) {
  const hit = processHitTest(frame, referenceSpace);
  if (hit) {
    reticle.visible = true;
    reticle.matrix.fromArray(hit.matrix);
  } else {
    reticle.visible = false;
  }
}
```

---

### Carga de modelos GLB

```javascript
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

// Cargar modelo de Scaniverse (escaneo del espacio)
async function loadScanModel(url) {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        
        // Hacer semitransparente como referencia visual
        model.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshBasicMaterial({
              color: 0x4f8ef7,
              wireframe: true,
              transparent: true,
              opacity: 0.15
            });
          }
        });
        
        resolve(model);
      },
      (progress) => {
        const pct = (progress.loaded / progress.total * 100).toFixed(0);
        console.log(`Cargando modelo: ${pct}%`);
      },
      reject
    );
  });
}

// Cargar objeto arqueológico
async function loadArtifact(url, scale = 1) {
  return new Promise((resolve, reject) => {
    loader.load(url, (gltf) => {
      const model = gltf.scene;
      model.scale.set(scale, scale, scale);
      resolve(model);
    }, null, reject);
  });
}

// Uso:
const scan = await loadScanModel('models/escaneo_termas.glb');
scene.add(scan);

const vasija = await loadArtifact('models/objetos/vasija.glb', 0.1);
// Se añade a la escena cuando el usuario toque
```

#### Formatos soportados

| Formato | Extensión | Soporte | Notas |
|---------|-----------|---------|-------|
| **GLB** | `.glb` | ✅ Recomendado | Binario, un solo archivo |
| **GLTF** | `.gltf` + `.bin` + texturas | ✅ Soportado | Múltiples archivos |
| **OBJ** | `.obj` + `.mtl` | ⚠️ Legacy | Usar solo si no hay GLB |
| **FBX** | `.fbx` | ❌ Evitar | Pesado, no estándar web |

> 💡 **Siempre exportar de Scaniverse como GLB.** Es el formato más eficiente y compatible para web.

---

### Anclaje de objetos

Colocar un objeto donde el usuario toca la pantalla:

```javascript
const controller = renderer.xr.getController(0);

controller.addEventListener('select', onSelect);

function onSelect() {
  if (!reticle.visible) return;
  
  // Opción 1: Objeto primitivo
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.05, 0.1, 16),
    new THREE.MeshStandardMaterial({ color: 0xc4783e, roughness: 0.8 })
  );
  mesh.position.setFromMatrixPosition(reticle.matrix);
  mesh.quaternion.setFromRotationMatrix(reticle.matrix);
  scene.add(mesh);
  
  // Opción 2: Modelo GLB precargado (clonar)
  const artifact = loadedArtifact.clone();
  artifact.position.setFromMatrixPosition(reticle.matrix);
  scene.add(artifact);
}
```

#### Anclaje con posición predefinida (nuestro caso)

En nuestro proyecto, los objetos no se colocan donde el usuario toca, sino en posiciones predefinidas relativas al escaneo LiDAR:

```javascript
// Posiciones de los hallazgos en coordenadas del escaneo
const ARTIFACT_POSITIONS = [
  { id: 'vasija_01',  model: 'vasija.glb',  pos: [1.2, 0.0, -0.5], rot: [0, 0.3, 0] },
  { id: 'moneda_01',  model: 'moneda.glb',  pos: [0.8, 0.0, 0.2],  rot: [0, 0, 0] },
  { id: 'columna_01', model: 'columna.glb', pos: [-0.5, 0.0, 1.1], rot: [0, 1.2, 0] },
];

// Cargar y posicionar todos los hallazgos
async function loadAllArtifacts() {
  for (const artifact of ARTIFACT_POSITIONS) {
    const model = await loadArtifact(`models/objetos/${artifact.model}`);
    model.position.set(...artifact.pos);
    model.rotation.set(...artifact.rot);
    model.visible = false;  // Oculto inicialmente
    model.userData.id = artifact.id;
    scene.add(model);
    artifacts.push(model);
  }
}

// Revelar un hallazgo (al tocar cerca o por UI)
function revealArtifact(id) {
  const artifact = artifacts.find(a => a.userData.id === id);
  if (artifact) {
    artifact.visible = true;
    // Animación de aparición
    artifact.scale.set(0, 0, 0);
    animateScale(artifact, 1.0, 500); // 500ms para escalar a tamaño real
  }
}
```

---

## Escaneo con Scaniverse (LiDAR)

### Proceso paso a paso

```
1. PREPARAR EL ESPACIO
   └─ Iluminación uniforme (evitar sombras duras)
   └─ Marcar la zona con cinta si es necesario
   └─ Limpiar objetos que no queremos escanear

2. ESCANEAR
   └─ Abrir Scaniverse → "New Scan"
   └─ Modo "Area" para espacios grandes
   └─ Moverse lentamente en un patrón serpentino
   └─ Mantener el iPhone a 1-1.5m del suelo
   └─ Cubrir la zona desde múltiples ángulos
   └─ Duración típica: 2-5 minutos

3. PROCESAR
   └─ Scaniverse procesa automáticamente
   └─ Elegir calidad "High" (no Ultra — archivo muy pesado)
   └─ Recortar la malla si capturó áreas innecesarias

4. EXPORTAR
   └─ Share → Export → GLB
   └─ Tamaño típico: 5-30 MB según área
   └─ Si es >20MB, re-escanear con calidad "Medium"

5. OPTIMIZAR (opcional pero recomendado)
   └─ Usar gltf-transform para reducir tamaño:
       npx @gltf-transform/cli optimize escaneo.glb escaneo_opt.glb
   └─ O usar Blender: importar → decimate modifier → exportar
```

### Consejos para buenos escaneos

| ✅ Hacer | ❌ Evitar |
|----------|----------|
| Luz uniforme y difusa | Luz directa del sol (sombras duras) |
| Movimientos lentos y suaves | Movimientos bruscos (blur) |
| Cubrir esquinas y bordes | Superficies reflectantes (cristal, metal pulido) |
| Escanear a 1-1.5m de distancia | Estar demasiado lejos (>3m) pierde detalle |
| Hacer múltiples pasadas | Una sola pasada rápida |

---

## Estructura de archivos

```
ar-archaeology/
├── index.html              # Página principal con UI
├── app.js                  # Lógica principal de la app AR
├── styles.css              # Estilos de la interfaz
│
├── lib/                    # Dependencias (o usar CDN)
│   ├── three.min.js
│   ├── GLTFLoader.js
│   └── ARButton.js
│
├── models/
│   ├── escaneo.glb         # Malla 3D del espacio (Scaniverse)
│   └── objetos/
│       ├── vasija.glb      # Modelos de los hallazgos
│       ├── moneda.glb
│       ├── columna.glb
│       └── ...
│
├── config/
│   └── artifacts.json      # Posiciones de los hallazgos
│
├── docs/
│   ├── DOCS.md             # Esta documentación
│   ├── ARCHITECTURE.md     # Detalle de arquitectura
│   └── ITERATIONS.md       # Historial de fases
│
├── package.json
├── README.md
└── LICENSE
```

### `config/artifacts.json`

```json
{
  "site": "Termas de Caldoval",
  "scan_model": "models/escaneo.glb",
  "artifacts": [
    {
      "id": "vasija_01",
      "name": "Vasija romana",
      "model": "models/objetos/vasija.glb",
      "position": [1.2, 0.0, -0.5],
      "rotation": [0, 0.3, 0],
      "scale": 1.0,
      "description": "Vasija de cerámica sigillata, siglo II d.C.",
      "discovered": "2026-01-15"
    }
  ]
}
```

---

## Despliegue

### Requisito crítico: HTTPS

WebXR **requiere HTTPS**. No funciona en HTTP plano. Opciones:

```bash
# Desarrollo local con HTTPS
npx serve --ssl .                    # serve con certificado auto-firmado
npx vite --https                     # si usas Vite
python3 -m http.server --certfile cert.pem --keyfile key.pem 8443

# Producción — cualquier hosting con SSL
# GitHub Pages, Netlify, Vercel, Cloudflare Pages, hosting tradicional...
```

### GitHub Pages (gratuito)

```bash
# 1. Push a GitHub
git push origin main

# 2. En Settings → Pages → Source: main / root
# URL: https://tu-usuario.github.io/ar-archaeology/
```

### Hosting tradicional (nuestro caso)

```bash
# Subir por SCP
scp -r . usuario@servidor:/ruta/publica/fll/

# O por FTP
# Asegurar que el hosting tiene SSL activo
```

---

## Compatibilidad

### Navegadores

| Navegador | AR (WebXR) | Demo 3D (Three.js) | Notas |
|-----------|-----------|-------------------|-------|
| Safari iOS 16+ | ✅ | ✅ | Único que accede a ARKit |
| Chrome iOS | ❌ | ✅ | No accede a ARKit (limitación de Apple) |
| Chrome Android | ✅ | ✅ | Usa ARCore en vez de ARKit |
| Firefox | ❌ | ✅ | No soporta WebXR AR |
| Safari macOS | ❌ | ✅ | Sin cámara AR |

### Dispositivos iPhone

| Modelo | LiDAR | WebXR AR | Calidad tracking |
|--------|-------|---------|-----------------|
| iPhone 12 Pro / Max | ✅ | ✅ | Excelente |
| iPhone 13 Pro / Max | ✅ | ✅ | Excelente |
| iPhone 14 Pro / Max | ✅ | ✅ | Excelente |
| iPhone 15 Pro / Max | ✅ | ✅ | Excelente |
| iPhone 12 / 13 / 14 / 15 (no Pro) | ❌ | ✅ | Buena (sin LiDAR) |
| iPhone 11 o anterior | ❌ | ⚠️ | Limitada |

> 💡 Los modelos sin LiDAR también soportan WebXR AR — el tracking funciona con cámara + sensores. Pero el escaneo con Scaniverse necesita LiDAR.

### Reglas de compatibilidad iOS

```javascript
// ⚠️ NO usar en iOS:
renderer.shadowMap.enabled = true;          // ❌ Crash silencioso
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // ❌
scene.fog = new THREE.FogExp2();            // ❌ Puede fallar
mesh.castShadow = true;                     // ❌ Si shadowMap activo

// ✅ Seguro en iOS:
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); // ✅ Limitar pixelRatio
const PARTICLE_COUNT = /iPhone|iPad/.test(navigator.userAgent) ? 30 : 100; // ✅ Reducir
```

---

## Errores conocidos y soluciones

### Error: "WebXR not available"

**Causa:** Navegador no compatible o no es HTTPS.
```javascript
// Solución: comprobar y mostrar mensaje claro
if (!navigator.xr) {
  showMessage('Abre esta web en Safari (iPhone) para usar AR');
}
```

### Error: Objetos aparecen bajo el suelo

**Causa:** Bug de sistema de coordenadas (Y↑ vs Y↓).
```javascript
// Three.js / WebXR usan Y↑
// Si el modelo viene de software con Y↓ (OpenCV, Blender Z-up):
model.rotation.x = -Math.PI / 2;  // Rotar 90° para corregir
```

### Error: El modelo GLB no se ve

**Causa común:** Escala incorrecta. Scaniverse exporta en metros.
```javascript
// Si el modelo es gigante:
model.scale.set(0.01, 0.01, 0.01);

// Si es invisible (demasiado pequeño):
model.scale.set(100, 100, 100);

// Para verificar el tamaño:
const box = new THREE.Box3().setFromObject(model);
const size = new THREE.Vector3();
box.getSize(size);
console.log('Tamaño del modelo:', size);  // Debería ser ~metros
```

### Error: Safari crash en iOS

**Causa:** `shadowMap`, `fog`, o demasiados polígonos.
```javascript
// Reducir complejidad del escaneo:
// En Blender: Decimate modifier → ratio 0.3
// O con gltf-transform:
// npx @gltf-transform/cli simplify input.glb output.glb --ratio 0.3
```

### Error: Hit test no detecta suelo

**Causa:** Superficie no detectada por ARKit.
```
Soluciones:
1. Mover el iPhone lentamente para que ARKit mapee el entorno
2. Asegurar buena iluminación (ARKit necesita ver texturas)
3. No apuntar a superficies reflectantes o transparentes
4. Esperar 2-3 segundos tras iniciar AR para que calibre
```

---

## Historial de iteraciones

| Fase | Tecnología | Resultado | Lección |
|------|-----------|-----------|---------|
| 1 | Mattercraft (ZapWorks) | ❌ Sin anclaje | Necesitamos posicionamiento espacial real |
| 2 | Immersal SDK | ❌ Solo nativo | La accesibilidad web es requisito |
| 3 | OpenCV + ORB sintético | ❌ 0 matches | Los datos sintéticos no sustituyen a reales |
| 4 | OpenCV + ORB real + solvePnP | ⚠️ Inestable | Server-side tracking es demasiado lento para AR |
| 5 | **WebXR + Scaniverse** | ✅ **Producción** | Usar el hardware del dispositivo, no reinventar la rueda |

**Estadísticas del proceso:**
- 5 tecnologías probadas
- 15.000 descriptores sintéticos generados (inútiles)
- 112.000 descriptores ORB reales extraídos
- 1 solución final que funciona

---

## API Reference

### Funciones principales

#### `initAR()`
Inicializa la sesión WebXR y configura Three.js.

```javascript
/**
 * @returns {Promise<void>}
 * @throws {Error} Si WebXR no está disponible
 */
async function initAR() { ... }
```

#### `loadSite(configUrl)`
Carga la configuración del sitio arqueológico y todos los modelos.

```javascript
/**
 * @param {string} configUrl - URL del archivo artifacts.json
 * @returns {Promise<{scan: THREE.Object3D, artifacts: THREE.Object3D[]}>}
 */
async function loadSite(configUrl) { ... }
```

#### `placeObject(model, hitPose)`
Coloca un objeto 3D en la posición del hit test.

```javascript
/**
 * @param {THREE.Object3D} model - Modelo a colocar
 * @param {XRPose} hitPose - Pose devuelta por hit test
 */
function placeObject(model, hitPose) { ... }
```

#### `revealArtifact(id)`
Muestra un hallazgo oculto con animación.

```javascript
/**
 * @param {string} id - ID del hallazgo (de artifacts.json)
 * @returns {boolean} true si se encontró y reveló
 */
function revealArtifact(id) { ... }
```

### Eventos

| Evento | Cuándo | Datos |
|--------|--------|-------|
| `ar:ready` | Sesión AR iniciada | `{ session }` |
| `ar:hit` | Superficie detectada | `{ position, orientation }` |
| `ar:place` | Objeto colocado | `{ model, position }` |
| `ar:reveal` | Hallazgo revelado | `{ id, model }` |
| `ar:error` | Error de AR | `{ code, message }` |

---

## Contribuir

### Cómo añadir un nuevo sitio arqueológico

1. Escanear el espacio con Scaniverse → exportar GLB
2. Crear modelos 3D de los hallazgos (o usar primitivas)
3. Crear `artifacts.json` con las posiciones
4. Probar en Safari del iPhone

### Cómo mejorar el tracking

El tracking lo hace ARKit → no tenemos control directo. Pero podemos mejorar la experiencia:

- Reducir el tamaño del GLB (menos polígonos = más FPS)
- Usar `requestAnimationFrame` limpio (no bloquear el hilo principal)
- Limitar el `pixelRatio` a 2 en dispositivos de alta densidad

### Convenciones de código

```
- JavaScript moderno (ES2020+)
- Nombres en inglés para código, español para UI
- Comentarios en español
- Archivos GLB < 20MB
- Commits en español: "añade modelo vasija al sitio Caldoval"
```

---

## Licencia

```
MIT License

Copyright (c) 2026 Maker Lab - Espacio Vivo, Ferrol

Se permite cualquier uso, modificación y distribución.
Construido para que otros lo repliquen y mejoren. 🌍
```

---

## Links

- 📄 **Web del proyecto:** [rocketmaker.app/fll](https://rocketmaker.app/fll/)
- 💻 **Código fuente:** [github.com/maker-lab-ferrol/ar-archaeology](https://github.com/maker-lab-ferrol/ar-archaeology)
- 🏫 **Maker Lab:** [espaciovivo.gal](https://espaciovivo.gal)
- 📡 **Scaniverse:** [scaniverse.com](https://scaniverse.com)
- 🎮 **Three.js docs:** [threejs.org/docs](https://threejs.org/docs/)
- 🌐 **WebXR spec:** [immersive-web.github.io](https://immersive-web.github.io/webxr/)

---

> 🔭 *Construido por estudiantes de Maker Lab (Espacio Vivo, Ferrol) para FIRST LEGO League 2026.*
> *Tecnología open source — comparte, mejora, aprende.*
