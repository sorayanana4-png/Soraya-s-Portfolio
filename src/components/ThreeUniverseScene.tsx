import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { UNIVERSE_CARDS } from '../data/sorayaData';
import { UniverseId } from '../types/universe';

export type ThreeSceneMode = 'astrolabe' | 'motorsport' | 'studio';

interface ThreeUniverseSceneProps {
  initialMode?: ThreeSceneMode;
  heightClass?: string;
  onSelectUniverse?: (id: UniverseId) => void;
  title?: string;
}

const MODE_LABELS: { id: ThreeSceneMode; label: string; caption: string }[] = [
  {
    id: 'astrolabe',
    label: 'Astrolabe 8 Univers',
    caption: 'Glisser pour pivoter · Cliquer sur une sphère pour entrer dans l’univers',
  },
  {
    id: 'motorsport',
    label: 'Prototype 24H Le Mans',
    caption: 'Géométrie endurance célébrant l’hospitalité au Circuit de la Sarthe',
  },
  {
    id: 'studio',
    label: 'Platine Vinyle & Micro R&B',
    caption: 'Platine vinyle 3D interactive et microphone de studio vocal',
  },
];

function createVinylTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const cx = size / 2;
  const cy = size / 2;

  ctx.fillStyle = '#0d0c0e';
  ctx.fillRect(0, 0, size, size);

  for (let r = 80; r < 248; r += 3) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = r % 12 === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(cx, cy, 74, 0, Math.PI * 2);
  ctx.fillStyle = '#6E1D2A';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, 62, 0, Math.PI * 2);
  ctx.strokeStyle = '#D4A359';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createTrackSurfaceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#181e29';
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 1800; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.22)';
    ctx.fillRect(x, y, 2, 2);
  }

  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#dc2626' : '#f8fafc';
    ctx.fillRect(i * 32, 8, 32, 12);
    ctx.fillRect(i * 32, 236, 32, 12);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 1);
  return tex;
}

export function ThreeUniverseScene({
  initialMode = 'astrolabe',
  heightClass = 'h-[440px] md:h-[520px]',
  onSelectUniverse,
  title = 'Scène 3D interactive',
}: ThreeUniverseSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<ThreeSceneMode>(initialMode);
  const [dockOpen, setDockOpen] = useState(true);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [resetTick, setResetTick] = useState(0);
  const [spinning, setSpinning] = useState(true);

  const modeRef = useRef<ThreeSceneMode>(mode);
  const spinningRef = useRef<boolean>(spinning);
  const onSelectRef = useRef(onSelectUniverse);

  modeRef.current = mode;
  spinningRef.current = spinning;
  onSelectRef.current = onSelectUniverse;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 480;

    let isSoftwareGl = false;
    try {
      const probe = document.createElement('canvas').getContext('webgl2');
      if (probe) {
        const dbg = probe.getExtension('WEBGL_debug_renderer_info');
        const rendererStr = dbg
          ? String(probe.getParameter(dbg.UNMASKED_RENDERER_WEBGL))
          : String(probe.getParameter(probe.RENDERER));
        isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(rendererStr);
      }
    } catch {
      isSoftwareGl = false;
    }

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSoftwareGl ? 1 : 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0E0E14');
    scene.fog = new THREE.Fog('#0E0E14', 10, 26);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 60);
    camera.position.set(4.8, 3.2, 5.4);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.minDistance = 2.6;
    controls.maxDistance = 12;

    const hemi = new THREE.HemisphereLight('#bfd9ff', '#271e1a', 0.55);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight('#fff1da', 2.4);
    keyLight.position.set(5, 7, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#60a5fa', 0.9);
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);

    const stageGeo = new THREE.CircleGeometry(7, 64);
    const stageMat = new THREE.MeshStandardMaterial({
      color: '#14141d',
      roughness: 0.78,
      metalness: 0.15,
    });
    const stageMesh = new THREE.Mesh(stageGeo, stageMat);
    stageMesh.rotation.x = -Math.PI / 2;
    stageMesh.position.y = -0.95;
    stageMesh.receiveShadow = true;
    scene.add(stageMesh);

    const createdTextures: THREE.Texture[] = [];

    const astrolabeGroup = new THREE.Group();
    const brassMat = new THREE.MeshPhysicalMaterial({
      color: '#d4a359',
      metalness: 0.88,
      roughness: 0.24,
      clearcoat: 0.35,
    });
    const obsidianMat = new THREE.MeshStandardMaterial({
      color: '#1c1917',
      metalness: 0.35,
      roughness: 0.45,
    });

    const basePedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.35, 0.26, 48), obsidianMat);
    basePedestal.position.y = -0.82;
    basePedestal.castShadow = true;
    basePedestal.receiveShadow = true;
    astrolabeGroup.add(basePedestal);

    const brassCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.48, 0.65, 32), brassMat);
    brassCollar.position.y = -0.4;
    brassCollar.castShadow = true;
    astrolabeGroup.add(brassCollar);

    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.045, 20, 84), brassMat);
    outerRing.position.y = 0.65;
    outerRing.rotation.x = 0.38;
    outerRing.castShadow = true;
    astrolabeGroup.add(outerRing);

    const innerRing = new THREE.Mesh(new THREE.TorusGeometry(1.38, 0.032, 18, 72), brassMat);
    innerRing.position.y = 0.65;
    innerRing.rotation.y = 0.65;
    innerRing.rotation.x = -0.35;
    astrolabeGroup.add(innerRing);

    const coreSun = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 32, 32),
      new THREE.MeshPhysicalMaterial({
        color: '#f5c469',
        emissive: '#78350f',
        emissiveIntensity: 0.45,
        metalness: 0.6,
        roughness: 0.18,
      })
    );
    coreSun.position.y = 0.65;
    coreSun.castShadow = true;
    astrolabeGroup.add(coreSun);

    const orbitPivot = new THREE.Group();
    orbitPivot.position.y = 0.65;
    astrolabeGroup.add(orbitPivot);

    const interactiveSpheres: THREE.Mesh[] = [];
    UNIVERSE_CARDS.forEach((u, i) => {
      const angle = (i / UNIVERSE_CARDS.length) * Math.PI * 2;
      const radius = i % 2 === 0 ? 1.85 : 1.38;
      const yOffset = Math.sin(angle * 2) * 0.35;
      const planetMat = new THREE.MeshPhysicalMaterial({
        color: u.accentHex,
        emissive: u.accentHex,
        emissiveIntensity: 0.22,
        roughness: 0.25,
        metalness: 0.25,
        clearcoat: 0.6,
      });
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 24), planetMat);
      sphere.position.set(Math.cos(angle) * radius, yOffset, Math.sin(angle) * radius);
      sphere.castShadow = true;
      sphere.userData = { universeId: u.id, label: `${u.number} · ${u.title}` };
      orbitPivot.add(sphere);
      interactiveSpheres.push(sphere);
    });
    scene.add(astrolabeGroup);

    const carGroup = new THREE.Group();
    const trackTex = createTrackSurfaceTexture();
    trackTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    createdTextures.push(trackTex);

    const trackDeck = new THREE.Mesh(
      new THREE.BoxGeometry(5.6, 0.14, 3.0),
      new THREE.MeshStandardMaterial({ map: trackTex, roughness: 0.85, metalness: 0.05 })
    );
    trackDeck.position.y = -0.88;
    trackDeck.receiveShadow = true;
    carGroup.add(trackDeck);

    const chassisMat = new THREE.MeshPhysicalMaterial({
      color: '#0f2557',
      metalness: 0.65,
      roughness: 0.22,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
    });
    const trimCarbonMat = new THREE.MeshStandardMaterial({
      color: '#111827',
      metalness: 0.35,
      roughness: 0.55,
    });
    const crimsonAccentMat = new THREE.MeshStandardMaterial({
      color: '#e11d48',
      emissive: '#9f1239',
      emissiveIntensity: 0.25,
      roughness: 0.3,
    });

    const carBody = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.42, 1.35), chassisMat);
    carBody.position.y = -0.45;
    carBody.castShadow = true;
    carGroup.add(carBody);

    const canopy = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.38, 0.72, 10, 20),
      new THREE.MeshPhysicalMaterial({
        color: '#090d16',
        metalness: 0.2,
        roughness: 0.08,
        clearcoat: 1,
      })
    );
    canopy.rotation.z = Math.PI / 2;
    canopy.scale.set(0.75, 1.15, 0.9);
    canopy.position.set(0.15, -0.18, 0);
    canopy.castShadow = true;
    carGroup.add(canopy);

    const frontSplitter = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 1.48), crimsonAccentMat);
    frontSplitter.position.set(1.68, -0.64, 0);
    carGroup.add(frontSplitter);

    const rearWing = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.07, 1.5), crimsonAccentMat);
    rearWing.position.set(-1.55, 0.14, 0);
    rearWing.castShadow = true;
    carGroup.add(rearWing);

    const wingPylon = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.45, 0.14), trimCarbonMat);
    wingPylon.position.set(-1.5, -0.12, 0);
    carGroup.add(wingPylon);

    const tireMat = new THREE.MeshStandardMaterial({ color: '#171717', roughness: 0.85, metalness: 0.1 });
    const rimMat = new THREE.MeshStandardMaterial({ color: '#e5e7eb', roughness: 0.25, metalness: 0.9 });
    const wheelOffsets: [number, number][] = [
      [1.08, 0.72],
      [1.08, -0.72],
      [-1.08, 0.72],
      [-1.08, -0.72],
    ];
    wheelOffsets.forEach(([wx, wz]) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.24, 24), tireMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(wx, -0.52, wz);
      wheel.castShadow = true;
      carGroup.add(wheel);

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.25, 16), rimMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.set(wx, -0.52, wz);
      carGroup.add(rim);
    });
    scene.add(carGroup);

    const studioGroup = new THREE.Group();
    const walnutMat = new THREE.MeshStandardMaterial({
      color: '#432818',
      roughness: 0.48,
      metalness: 0.08,
    });
    const chromeMat = new THREE.MeshPhysicalMaterial({
      color: '#e5e7eb',
      metalness: 0.95,
      roughness: 0.14,
    });

    const plinth = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.34, 2.4), walnutMat);
    plinth.position.set(-0.25, -0.72, 0);
    plinth.castShadow = true;
    plinth.receiveShadow = true;
    studioGroup.add(plinth);

    const platter = new THREE.Mesh(new THREE.CylinderGeometry(0.98, 1.0, 0.08, 48), chromeMat);
    platter.position.set(-0.55, -0.5, 0);
    platter.castShadow = true;
    studioGroup.add(platter);

    const vinylTex = createVinylTexture();
    vinylTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    createdTextures.push(vinylTex);

    const vinylDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.94, 0.94, 0.03, 56),
      new THREE.MeshPhysicalMaterial({
        map: vinylTex,
        roughness: 0.28,
        metalness: 0.12,
        clearcoat: 0.75,
      })
    );
    vinylDisc.position.set(-0.55, -0.44, 0);
    vinylDisc.castShadow = true;
    studioGroup.add(vinylDisc);

    const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 16), brassMat);
    spindle.position.set(-0.55, -0.39, 0);
    studioGroup.add(spindle);

    const tonearmPivot = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.14, 24), chromeMat);
    tonearmPivot.position.set(0.75, -0.46, -0.72);
    studioGroup.add(tonearmPivot);

    const tonearmRod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.25, 16), chromeMat);
    tonearmRod.rotation.z = Math.PI / 2;
    tonearmRod.rotation.y = 0.58;
    tonearmRod.position.set(0.28, -0.37, -0.38);
    studioGroup.add(tonearmRod);

    const micBase = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.08, 32), obsidianMat);
    micBase.position.set(1.75, -0.88, 0.45);
    micBase.castShadow = true;
    studioGroup.add(micBase);

    const micPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.35, 16), chromeMat);
    micPole.position.set(1.75, -0.2, 0.45);
    micPole.castShadow = true;
    studioGroup.add(micPole);

    const micCapsule = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.17, 0.28, 12, 24),
      new THREE.MeshPhysicalMaterial({
        color: '#d4a359',
        metalness: 0.9,
        roughness: 0.25,
      })
    );
    micCapsule.position.set(1.75, 0.58, 0.45);
    micCapsule.castShadow = true;
    studioGroup.add(micCapsule);
    scene.add(studioGroup);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const onPointerMove = (ev: PointerEvent) => {
      if (modeRef.current !== 'astrolabe') {
        setHoveredLabel(null);
        renderer.domElement.style.cursor = 'grab';
        return;
      }
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(interactiveSpheres, false);
      if (hits.length > 0) {
        const label = hits[0].object.userData.label as string;
        setHoveredLabel(label);
        renderer.domElement.style.cursor = 'pointer';
      } else {
        setHoveredLabel(null);
        renderer.domElement.style.cursor = 'grab';
      }
    };

    const onPointerDown = (ev: PointerEvent) => {
      pointerDownPos = { x: ev.clientX, y: ev.clientY };
    };

    const onPointerUp = (ev: PointerEvent) => {
      if (modeRef.current !== 'astrolabe') return;
      const dist = Math.hypot(ev.clientX - pointerDownPos.x, ev.clientY - pointerDownPos.y);
      if (dist > 6) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(interactiveSpheres, false);
      if (hits.length > 0 && onSelectRef.current) {
        const uid = hits[0].object.userData.universeId as UniverseId;
        onSelectRef.current(uid);
      }
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    let rafId = 0;
    let lastDraw = 0;
    let prevTime = performance.now();

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      if (isSoftwareGl && now - lastDraw < 65) {
        return;
      }
      lastDraw = now;

      const dt = Math.min((now - prevTime) / 1000, 0.1);
      prevTime = now;

      const activeMode = modeRef.current;
      astrolabeGroup.visible = activeMode === 'astrolabe';
      carGroup.visible = activeMode === 'motorsport';
      studioGroup.visible = activeMode === 'studio';

      if (spinningRef.current) {
        if (activeMode === 'astrolabe') {
          orbitPivot.rotation.y += dt * 0.38;
          outerRing.rotation.z += dt * 0.14;
          innerRing.rotation.x += dt * 0.18;
        } else if (activeMode === 'motorsport') {
          carGroup.rotation.y += dt * 0.28;
        } else if (activeMode === 'studio') {
          vinylDisc.rotation.y -= dt * 1.45;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      controls.dispose();
      pmrem.dispose();
      envRT.dispose();
      createdTextures.forEach((t) => t.dispose());
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [resetTick]);

  const activeMeta = MODE_LABELS.find((m) => m.id === mode) || MODE_LABELS[0];

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#0E0E14]">
      <div ref={mountRef} className={`w-full ${heightClass}`} />

      <div className="absolute top-4 left-4 pointer-events-none bg-[#12121A]/90 border border-white/15 rounded-xl px-4 py-2.5 text-white max-w-sm">
        <p className="text-[11px] font-semibold text-amber-300">{title}</p>
        <p className="text-xs text-stone-300 mt-0.5">{hoveredLabel || activeMeta.caption}</p>
      </div>

      <div className="absolute bottom-3 inset-x-3 flex justify-center pointer-events-none">
        <div className="pointer-events-auto bg-[#14141E]/95 border border-white/15 rounded-xl px-3 py-2 flex flex-wrap items-center gap-2 text-xs text-white shadow-xl">
          {dockOpen && (
            <>
              <div className="flex flex-wrap items-center gap-1.5">
                {MODE_LABELS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      mode === m.id
                        ? 'bg-amber-400 text-stone-950'
                        : 'bg-white/10 text-stone-200 hover:bg-white/20'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setSpinning((v) => !v)}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 cursor-pointer"
              >
                {spinning ? 'Mettre en pause' : 'Reprendre l’animation'}
              </button>
              <button
                type="button"
                aria-label="Réinitialiser la caméra"
                onClick={() => setResetTick((t) => t + 1)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setDockOpen((v) => !v)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 cursor-pointer"
          >
            {dockOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            <span>{dockOpen ? 'Masquer' : 'Contrôles 3D'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
