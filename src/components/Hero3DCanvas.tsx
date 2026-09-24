import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface Hero3DCanvasProps {
  scrollProgress: number; // 0.0 to 1.0
}

// Stage keyframes for Scrollytelling transitions
const STAGE_0_HERO = {
  // Target elevated to mid-body so rear foot stays strictly within the blue floor line during 360° rotation
  target: new THREE.Vector3(0, 0.05, 0),
  camPos: new THREE.Vector3(0, 0.90, 7.6),
  xOffsetRatio: -0.10, // Shifts model to right-center floor area
  baseRotY: 0.38, // Initial 3/4 floor resting angle
  shadowOpacity: 1.0,
  uvIntensity: 0.0,
  bgFadeOpacity: 0.0,
};

// Stage 1: Front Touch Screen Console
// In model local space, Screen_Front.001 faces -Z.
// Rotating by Math.PI brings the front glass screen with UI facing directly towards the user (+Z).
const STAGE_1_SCREEN = {
  target: new THREE.Vector3(0, 0.53, -1.16), // Center of the screen in world coordinates at rotY = Math.PI
  camPos: new THREE.Vector3(0, 0.57, 0.58), // Directly in front of screen at optimal distance
  xOffsetRatio: -0.21, // Shifts screen cleanly to the right half of the viewport
  baseRotY: Math.PI, // 180° rotation: Front Screen Display is 100% facing the user
  shadowOpacity: 0.0,
  uvIntensity: 0.0,
  bgFadeOpacity: 0.40,
};

// Stage 2: UV Sanitization Handset & Nozzle
// Calibrated precisely to position the nozzle safely below the red line / navbar
const STAGE_2_UV = {
  target: new THREE.Vector3(0.240, -0.005, 0.120), // Shifted upward in world space (+0.045) to lower the model on screen
  camPos: new THREE.Vector3(0.217, 0.023, 1.100),  // Framing camera keeping nozzle top strictly below red line (y >= 82px)
  xOffsetRatio: 0.195,                             // Positions handset cleanly on left column
  baseRotY: 0.839,                                 // ~48.1°: Elegant side-quarter perspective displaying horizontal barrel, body & aperture
  shadowOpacity: 0.0,
  uvIntensity: 0.0,
  bgFadeOpacity: 0.55,
};

// Stage 3: Ergonomic Biometric Training Chair
// Shifted to the right column with content on the left
const STAGE_3_CHAIR = {
  target: new THREE.Vector3(0.16, -0.42, -0.36), // Accurately centered on the lumbar & thoracic core of the chair
  camPos: new THREE.Vector3(0.22, -0.20, 2.38),   // Refined, eye-level studio perspective with gentle ~5° downward inclination
  xOffsetRatio: -0.19,                           // Positions the chair cleanly in the right column with generous margins
  baseRotY: -0.42,                               // ~ -24°: Continuous smooth angle without 360-deg wrapping
  shadowOpacity: 0.16,
  uvIntensity: 0.0,
  bgFadeOpacity: 0.50,
};

// Stage 4: About Us Section (0.80 - 0.88)
// Staged on the LEFT side of the screen, matching exact user reference image:
// Chair on the LEFT facing rightward/front, console post on the RIGHT
const STAGE_4_ABOUT = {
  target: new THREE.Vector3(0, -0.26, 0),
  camPos: new THREE.Vector3(0.0, 0.12, 8.0),
  xOffsetRatio: 0.312, // Accurately frames chair and machine inside left column
  baseRotY: 0.95, // Exact angle matching user reference image (chair on left, pole on right)
  baseRotZ: 0.0, // Straightened (no Z-axis tilt)
  shadowOpacity: 0.20,
  uvIntensity: 0.0,
};

// Stage 5: Sweep & Flight Reveal Keyframe across to User Dashboard (0.88 - 0.98)
// Culminates exiting past the RIGHT border of the screen, growing in size (camPos.z: 4.90)
// Base rotates a full 360 degrees (2*PI) continuously across the sweep
const STAGE_5_SWEEP_END = {
  target: new THREE.Vector3(0, 0.05, 0),
  camPos: new THREE.Vector3(0.0, 0.35, 4.90),
  xOffsetRatio: -0.90, // Shifts completely off the right edge of the screen
  baseRotY: 0.95 + Math.PI * 2.0, // Full 360-degree rotation across the sweep
  shadowOpacity: 0.0,
  uvIntensity: 0.0,
};

function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

// Shortest-path angle interpolation to prevent any sudden 360-degree wrapping
function interpolateAngle(from: number, to: number, t: number): number {
  const diff = ((to - from + Math.PI) % (Math.PI * 2)) - Math.PI;
  return from + diff * t;
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({ scrollProgress }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const fadeMeshesRef = useRef<THREE.Mesh[]>([]);

  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Keep a live ref to scrollProgress for the 60fps render loop
  const scrollProgressRef = useRef<number>(scrollProgress);
  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const mountElem = mountRef.current;
    if (!mountElem) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = null;

    // 2. Camera Setup
    let width = mountElem.clientWidth;
    let height = mountElem.clientHeight;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.copy(STAGE_0_HERO.camPos);
    (window as any).__THREE_CAMERA__ = camera;

    const applyViewOffset = (w: number, h: number, xRatio: number) => {
      // Use viewport width (matching Tailwind CSS @media breakpoints) to avoid scrollbar width discrepancies
      const vpW = typeof window !== 'undefined' ? window.innerWidth : w;
      const aspect = w / h;
      camera.aspect = aspect;
      const isPortrait = aspect < 1.0;

      // Responsive FOV: Natural 40° FOV preserved across all devices, with slight 42° calibration for tablet portrait
      const p = scrollProgressRef.current;
      if (vpW < 768) {
        camera.fov = 41;
      } else if (vpW < 1024) {
        camera.fov = isPortrait ? 42 : 40;
      } else {
        // Desktop / Laptop: 100% UNCHANGED
        camera.fov = 40;
      }

      // On portrait/mobile, keep horizontal offset subtle so model stays balanced without drifting off screen or colliding with text
      let responsiveRatio = xRatio;
      let offsetY = 0;
      if (vpW < 768) {
        // Mobile: Centered horizontally on hero, vertically balanced right beneath the CTA buttons with no awkward void
        if (p < 0.15) {
          responsiveRatio = 0.0;
          offsetY = -h * 0.088;
        } else if (p < 0.44) {
          // Feature 01 Touch Screen: Perfectly centered horizontally, elevated into the optical center between header and bottom dock
          responsiveRatio = 0.0;
          offsetY = h * 0.082;
        } else if (p < 0.60) {
          // Feature 02 UV Handpiece: Centered horizontally, elevated into the optical center between header and bottom dock
          responsiveRatio = -0.04;
          offsetY = h * 0.055;
        } else {
          responsiveRatio = xRatio * 0.35;
        }
      } else if (vpW < 1024) {
        // Tablet: Shift model cleanly to right column on Hero
        if (p < 0.15) {
          responsiveRatio = isPortrait ? -0.26 : -0.16;
          offsetY = isPortrait ? -h * 0.02 : 0;
        } else if (p < 0.44) {
          // Feature 01 Touch Screen: Position console center at x ≈ 530px, completely clear of left column (0-280px)
          responsiveRatio = isPortrait ? -0.19 : -0.21;
          offsetY = 0;
        } else if (p < 0.60) {
          // Feature 02 UV Handpiece: Shifted cleanly to LEFT column on tablet (x ≈ 210px), elevated to crop console out of top frame
          responsiveRatio = isPortrait ? 0.20 : 0.195;
          offsetY = isPortrait ? h * 0.20 : 0;
        } else {
          responsiveRatio = isPortrait ? xRatio * 0.85 : xRatio * 0.90;
        }
      }
      camera.setViewOffset(w, h, w * responsiveRatio, offsetY, w, h);
      camera.updateProjectionMatrix();
    };

    applyViewOffset(width, height, STAGE_0_HERO.xOffsetRatio);

    // 3. WebGL Renderer with Tone Mapping and Alpha
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.38;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mountElem.appendChild(renderer.domElement);

    // Studio Image-Based Lighting (IBL) environment via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(roomEnv).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = 1.35;

    // 4. OrbitControls: Single-Axis Horizontal Turntable Only (Zero tilt, Zero zoom, Zero pan)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enableZoom = false; // Zoom explicitly disabled
    controls.enablePan = false;  // Pan explicitly disabled
    controls.minPolarAngle = Math.PI / 2.12;
    controls.maxPolarAngle = Math.PI / 2.12;
    controls.target.copy(STAGE_0_HERO.target);
    controlsRef.current = controls;

    // 5. Studio Lighting with Multi-Point Illumination & Realistic Directional Shadows
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    // Front Camera Key Light: Brightens front face, contours, and user-facing controls
    const frontKeyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    frontKeyLight.position.set(0.5, 4.2, 6.8);
    scene.add(frontKeyLight);

    // Top-Right Sun Key Light: Casts soft directional contact shadows
    const sunLight = new THREE.DirectionalLight(0xfffbf2, 3.2);
    sunLight.position.set(4.5, 8.0, 4.0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 25;
    sunLight.shadow.camera.left = -3.5;
    sunLight.shadow.camera.right = 3.5;
    sunLight.shadow.camera.top = 3.5;
    sunLight.shadow.camera.bottom = -3.5;
    sunLight.shadow.bias = -0.0003;
    sunLight.shadow.radius = 6.5; // Soft, diffuse blurred shadow edges
    scene.add(sunLight);

    // Left Fill Light: Fills shadow side, handset, and chair frame
    const leftFillLight = new THREE.DirectionalLight(0xf2f7ff, 2.0);
    leftFillLight.position.set(-5.0, 4.5, 4.0);
    scene.add(leftFillLight);

    // Top-Back Rim Light: Provides crisp edge definition and silhouette separation
    const rimLight = new THREE.DirectionalLight(0xffffff, 2.2);
    rimLight.position.set(-2.0, 7.0, -5.0);
    scene.add(rimLight);

    // Sky Fill: Soft ambient overhead radiance
    const skyFill = new THREE.DirectionalLight(0xdbeafe, 1.4);
    skyFill.position.set(6, 4, -2);
    scene.add(skyFill);

    // Floor Bounce: Warm underglow bounce
    const floorBounce = new THREE.DirectionalLight(0xffedd5, 1.5);
    floorBounce.position.set(-3, -2, 3);
    scene.add(floorBounce);

    // Dedicated key light for front screen display in Section 01
    const screenKeyLight = new THREE.PointLight(0xffffff, 2.8, 8);
    screenKeyLight.position.set(0, 1.2, 0.6);
    scene.add(screenKeyLight);

    // 6. Photorealistic Floor Contact Shadows
    // A. Real-time dynamic shadow mapping plane (casts actual rotating 3D shadows of the model)
    const shadowPlaneGeo = new THREE.PlaneGeometry(16, 16);
    const shadowPlaneMat = new THREE.ShadowMaterial({
      opacity: 0.22, // Toned down for a soft, realistic studio feel
      transparent: true,
      depthWrite: false,
    });
    const shadowPlaneMesh = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlaneMesh.rotation.x = -Math.PI / 2;
    shadowPlaneMesh.position.set(0, -2.18, 0); // Exact base feet level
    shadowPlaneMesh.receiveShadow = true;
    scene.add(shadowPlaneMesh);

    // B. Soft, natural ambient contact occlusion disc (grounds the base center smoothly without fake static spots)
    const contactCanvas = document.createElement('canvas');
    contactCanvas.width = 512;
    contactCanvas.height = 512;
    const contactCtx = contactCanvas.getContext('2d');
    if (contactCtx) {
      const grad = contactCtx.createRadialGradient(256, 256, 10, 256, 256, 220);
      grad.addColorStop(0, 'rgba(25, 18, 14, 0.26)');
      grad.addColorStop(0.35, 'rgba(30, 22, 17, 0.12)');
      grad.addColorStop(0.70, 'rgba(35, 26, 20, 0.03)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      contactCtx.fillStyle = grad;
      contactCtx.beginPath();
      contactCtx.arc(256, 256, 220, 0, Math.PI * 2);
      contactCtx.fill();
    }
    const contactTexture = new THREE.CanvasTexture(contactCanvas);
    const contactGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const contactMat = new THREE.MeshBasicMaterial({
      map: contactTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.30, // Softened ambient contact
    });
    const contactMesh = new THREE.Mesh(contactGeo, contactMat);
    contactMesh.rotation.x = -Math.PI / 2;
    contactMesh.position.set(0, -2.175, 0); // Directly at base contact level
    scene.add(contactMesh);

    // 7. Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // 8. GLTF Model Loader
    const loader = new GLTFLoader();
    loader.load(
      '/models/Final_Model(2K).glb',
      (gltf) => {
        const model = gltf.scene;

        // Isolate ONLY the ergonomic chair meshes so that in Feature 03,
        // absolutely nothing else (no vertical column, no runner bar, no screen, no gun) is visible.
        const fadeMeshes: THREE.Mesh[] = [];

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mat) {
              mat.envMapIntensity = 1.6;
              // Soften ambient occlusion in crevices so dark recesses don't crush to pitch black
              if (mat.aoMap) {
                mat.aoMapIntensity = 0.60;
              }
              // Give materials a clean satin sheen
              mat.roughness = Math.min(Math.max(mat.roughness ?? 0.35, 0.25), 0.82);
              // Scale down metalness multiplier slightly so surfaces catch rich diffuse light
              mat.metalness = Math.min(mat.metalness ?? 0.8, 0.65);
              mat.needsUpdate = true;
            }

            // The chair is uniquely and exclusively defined by material 'Chair_2K'
            const matName = (mesh.material as THREE.Material)?.name || '';
            const isChairMesh = matName === 'Chair_2K';

            if (!isChairMesh) {
              // This is NOT the chair (it is the screen, gun, column, or base structure).
              // Clone its material so we can independently fade it out to 0 opacity in Feature 03.
              if (mesh.material) {
                if (Array.isArray(mesh.material)) {
                  mesh.material = mesh.material.map((m) => {
                    const cloned = m.clone();
                    cloned.transparent = true;
                    return cloned;
                  });
                } else {
                  mesh.material = (mesh.material as THREE.Material).clone();
                  (mesh.material as THREE.Material).transparent = true;
                }
              }
              fadeMeshes.push(mesh);
            }
          }
        });

        fadeMeshesRef.current = fadeMeshes;
        (window as any).__THREE_DEBUG__ = {
          fadeCount: fadeMeshes.length,
          meshes: fadeMeshes.map((m) => ({ name: m.name, mat: (m.material as any)?.name })),
        };

        // Auto-center model inside group
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.x = -center.x;
        model.position.y = -center.y;
        model.position.z = -center.z;

        // Perfectly calibrated scale so the product fits comfortably and rotates strictly within the blue floor line
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = maxDim > 0 ? 3.05 / maxDim : 1;
        modelGroup.scale.set(targetScale, targetScale, targetScale);
        modelGroup.position.set(0, -0.65, 0);
        modelGroup.rotation.y = STAGE_0_HERO.baseRotY;

        controls.target.copy(STAGE_0_HERO.target);
        controls.update();

        modelGroup.add(model);
        (window as any).__MODEL_GROUP__ = modelGroup;
        setIsLoaded(true);
      },
      (xhr) => {
        if (xhr.total > 0) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadingProgress(percent);
        } else {
          setLoadingProgress((prev) => Math.min(prev + 5, 95));
        }
      },
      (error) => {
        console.error('Error loading 3D GLB model:', error);
        setLoadError('Failed to load 3D model.');
      }
    );

    // Interaction tracking
    let isInteracting = false;
    let userTurnOffset = 0;
    controls.addEventListener('start', () => {
      isInteracting = true;
    });
    controls.addEventListener('end', () => {
      isInteracting = false;
    });

    // 9. Multi-Stage Animation & Render Loop
    let heroSpinAngle = STAGE_0_HERO.baseRotY; // Initial turntable angle
    let lastTime = performance.now();
    const curTarget = new THREE.Vector3().copy(STAGE_0_HERO.target);
    const curCamPos = new THREE.Vector3().copy(STAGE_0_HERO.camPos);
    let curXOffsetRatio = STAGE_0_HERO.xOffsetRatio;
    let curBaseRotY = STAGE_0_HERO.baseRotY;
    let curBaseRotZ = 0.0;
    let curShadowOpacity = STAGE_0_HERO.shadowOpacity;
    let curUvIntensity = STAGE_0_HERO.uvIntensity;

    const animate = () => {
      // Keep canvas and viewport dimensions 100% in sync with real DOM element on every frame
      if (mountElem) {
        const liveW = mountElem.clientWidth;
        const liveH = mountElem.clientHeight;
        if (liveW > 0 && liveH > 0 && (liveW !== width || liveH !== height)) {
          width = liveW;
          height = liveH;
          renderer.setSize(width, height);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
      }

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const p = scrollProgressRef.current;

      // Full 3D product turntable rotation animation active on Hero section
      if (p <= 0.14) {
        if (!isInteracting) {
          heroSpinAngle += delta * 0.26; // Continuous full 360-degree rotation animation
        }
      }

      // Calculate desired stage keyframe values based on scroll progress
      let destTarget: THREE.Vector3;
      let destCamPos: THREE.Vector3;
      let destXOffsetRatio: number;
      let destBaseRotY: number;
      let destBaseRotZ = 0.0;
      let destShadowOpacity: number;
      let destUvIntensity: number;

      // Device-calibrated Stage 1 targets:
      // Desktop: Exactly STAGE_1_SCREEN (target: (0, 0.53, -1.16), camPos: (0, 0.57, 0.58))
      // Mobile (< 768): Calibrated pullback (camPos.z = 2.30) so full console fits within 390px phone width
      // Tablet portrait (768 <= vpW < 1024): Calibrated pullback (camPos.z = 1.95) so console fits neatly on right side
      const stage1Target = STAGE_1_SCREEN.target.clone();
      const stage1CamPos = STAGE_1_SCREEN.camPos.clone();
      const stage2Target = STAGE_2_UV.target.clone();
      const stage2CamPos = STAGE_2_UV.camPos.clone();
      const vpW = typeof window !== 'undefined' ? window.innerWidth : width;
      const isPortraitMode = width / height < 1.0;

      if (vpW < 768) {
        stage1Target.x = 0.01;
        stage1CamPos.x = 0.01;
        stage1CamPos.z = 2.50; // Scales console so wings, buttons, and display have comfortable margins on phone
        stage1CamPos.y = 0.53;

        // Stage 2 UV Handpiece on Mobile:
        // Pull back camera so full handpiece (barrel, body, handle, cable) fits comfortably between header and dock
        stage2CamPos.z = 1.95;
        stage2CamPos.y = 0.06;
        stage2Target.y = 0.01;
      } else if (vpW < 1024 && isPortraitMode) {
        stage1Target.x = 0.01;
        stage1CamPos.x = 0.01;
        stage1CamPos.z = 2.05; // Balanced framing on tablet portrait with comfortable margins
        stage1CamPos.y = 0.54;

        // Stage 2 UV Handpiece on Tablet Portrait:
        // Scale handpiece cleanly to fit inside left column (x ≈ 0-420px) without overlapping right side text
        stage2CamPos.z = 1.68;
        stage2CamPos.y = 0.03;
      }

      if (p <= 0.14) {
        // Stage 0: Hero Section Turntable View
        destTarget = STAGE_0_HERO.target;
        destCamPos = STAGE_0_HERO.camPos;
        destXOffsetRatio = STAGE_0_HERO.xOffsetRatio;
        destBaseRotY = heroSpinAngle;
        destShadowOpacity = STAGE_0_HERO.shadowOpacity;
        destUvIntensity = STAGE_0_HERO.uvIntensity;
      } else if (p < 0.24) {
        // Transition Stage 0 -> Stage 1 (Smoothly transitions to front screen angle)
        const t = smoothstep(0.14, 0.24, p);
        destTarget = new THREE.Vector3().lerpVectors(STAGE_0_HERO.target, stage1Target, t);
        destCamPos = new THREE.Vector3().lerpVectors(STAGE_0_HERO.camPos, stage1CamPos, t);
        destXOffsetRatio = THREE.MathUtils.lerp(STAGE_0_HERO.xOffsetRatio, STAGE_1_SCREEN.xOffsetRatio, t);
        destBaseRotY = interpolateAngle(heroSpinAngle, STAGE_1_SCREEN.baseRotY, t);
        destShadowOpacity = THREE.MathUtils.lerp(STAGE_0_HERO.shadowOpacity, STAGE_1_SCREEN.shadowOpacity, t);
        destUvIntensity = 0.0;
      } else if (p <= 0.36) {
        // Stage 1: Front Touch Screen Feature View (100% locked)
        destTarget = stage1Target;
        destCamPos = stage1CamPos;
        destXOffsetRatio = STAGE_1_SCREEN.xOffsetRatio;
        destBaseRotY = STAGE_1_SCREEN.baseRotY; // Math.PI
        destShadowOpacity = STAGE_1_SCREEN.shadowOpacity;
        destUvIntensity = STAGE_1_SCREEN.uvIntensity;
        heroSpinAngle = STAGE_1_SCREEN.baseRotY;
      } else if (p < 0.46) {
        // Transition Stage 1 -> Stage 2 (Smoothly transitions to UV nozzle angle)
        const t = smoothstep(0.36, 0.46, p);
        destTarget = new THREE.Vector3().lerpVectors(stage1Target, stage2Target, t);
        destCamPos = new THREE.Vector3().lerpVectors(stage1CamPos, stage2CamPos, t);
        destXOffsetRatio = THREE.MathUtils.lerp(STAGE_1_SCREEN.xOffsetRatio, STAGE_2_UV.xOffsetRatio, t);
        destBaseRotY = interpolateAngle(STAGE_1_SCREEN.baseRotY, STAGE_2_UV.baseRotY, t);
        destShadowOpacity = 0.0;
        destUvIntensity = 0.0;
      } else if (p <= 0.58) {
        // Stage 2: UV Sanitization Handpiece View (100% locked)
        destTarget = stage2Target;
        destCamPos = stage2CamPos;
        destXOffsetRatio = STAGE_2_UV.xOffsetRatio;
        destBaseRotY = STAGE_2_UV.baseRotY; // ~0.839
        destShadowOpacity = STAGE_2_UV.shadowOpacity;
        destUvIntensity = STAGE_2_UV.uvIntensity;
        heroSpinAngle = STAGE_2_UV.baseRotY;
      } else if (p < 0.68) {
        // Transition Stage 2 -> Stage 3 (Smoothly transitions to Ergonomic Chair view)
        const t = smoothstep(0.58, 0.68, p);
        destTarget = new THREE.Vector3().lerpVectors(stage2Target, STAGE_3_CHAIR.target, t);
        destCamPos = new THREE.Vector3().lerpVectors(stage2CamPos, STAGE_3_CHAIR.camPos, t);
        destXOffsetRatio = THREE.MathUtils.lerp(STAGE_2_UV.xOffsetRatio, STAGE_3_CHAIR.xOffsetRatio, t);
        destBaseRotY = interpolateAngle(STAGE_2_UV.baseRotY, STAGE_3_CHAIR.baseRotY, t);
        destShadowOpacity = THREE.MathUtils.lerp(STAGE_2_UV.shadowOpacity, STAGE_3_CHAIR.shadowOpacity, t);
        destUvIntensity = 0.0;
      } else if (p <= 0.73) {
        // Stage 3: Ergonomic Biometric Training Chair (100% locked in right column)
        destTarget = STAGE_3_CHAIR.target;
        destCamPos = STAGE_3_CHAIR.camPos;
        destXOffsetRatio = STAGE_3_CHAIR.xOffsetRatio; // -0.19
        destBaseRotY = STAGE_3_CHAIR.baseRotY; // -0.42 rad (~ -24°)
        destShadowOpacity = STAGE_3_CHAIR.shadowOpacity;
        destUvIntensity = STAGE_3_CHAIR.uvIntensity;
        heroSpinAngle = STAGE_3_CHAIR.baseRotY;
      } else if (p < 0.81) {
        // Transition Stage 3 -> Stage 4 About Us (Descends downwards, pulling back and gliding into left column of Our Story)
        const t = smoothstep(0.73, 0.81, p);
        destTarget = new THREE.Vector3().lerpVectors(STAGE_3_CHAIR.target, STAGE_4_ABOUT.target, t);
        destCamPos = new THREE.Vector3().lerpVectors(STAGE_3_CHAIR.camPos, STAGE_4_ABOUT.camPos, t);
        destXOffsetRatio = THREE.MathUtils.lerp(STAGE_3_CHAIR.xOffsetRatio, STAGE_4_ABOUT.xOffsetRatio, t);
        destBaseRotY = interpolateAngle(STAGE_3_CHAIR.baseRotY, STAGE_4_ABOUT.baseRotY, t);
        destBaseRotZ = THREE.MathUtils.lerp(0.0, STAGE_4_ABOUT.baseRotZ, t);
        destShadowOpacity = THREE.MathUtils.lerp(STAGE_3_CHAIR.shadowOpacity, STAGE_4_ABOUT.shadowOpacity, t);
        destUvIntensity = 0.0;
        heroSpinAngle = STAGE_4_ABOUT.baseRotY;
      } else if (p <= 0.88) {
        // Stage 4: About Us Section (100% locked in left column, full machine framed)
        destTarget = STAGE_4_ABOUT.target;
        destCamPos = STAGE_4_ABOUT.camPos;
        destXOffsetRatio = STAGE_4_ABOUT.xOffsetRatio;
        destBaseRotY = STAGE_4_ABOUT.baseRotY;
        destBaseRotZ = STAGE_4_ABOUT.baseRotZ;
        destShadowOpacity = STAGE_4_ABOUT.shadowOpacity;
        destUvIntensity = 0.0;
        heroSpinAngle = STAGE_4_ABOUT.baseRotY;
      } else if (p < 0.98) {
        // Stage 5: Cinematic Sweep & Reveal across to User Dashboard (360° rotation, growing in scale, gliding to right)
        const t = (p - 0.88) / (0.98 - 0.88);
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        destTarget = new THREE.Vector3().lerpVectors(STAGE_4_ABOUT.target, STAGE_5_SWEEP_END.target, ease);
        destCamPos = new THREE.Vector3().lerpVectors(STAGE_4_ABOUT.camPos, STAGE_5_SWEEP_END.camPos, ease);
        destXOffsetRatio = THREE.MathUtils.lerp(STAGE_4_ABOUT.xOffsetRatio, STAGE_5_SWEEP_END.xOffsetRatio, ease);
        destBaseRotY = THREE.MathUtils.lerp(STAGE_4_ABOUT.baseRotY, STAGE_5_SWEEP_END.baseRotY, ease);
        destBaseRotZ = THREE.MathUtils.lerp(STAGE_4_ABOUT.baseRotZ, 0.0, ease);
        destShadowOpacity = THREE.MathUtils.lerp(STAGE_4_ABOUT.shadowOpacity, STAGE_5_SWEEP_END.shadowOpacity, ease);
        destUvIntensity = 0.0;
        heroSpinAngle = destBaseRotY;
      } else {
        // Culmination: Model Exited Completely Past Right Border
        destTarget = STAGE_5_SWEEP_END.target;
        destCamPos = STAGE_5_SWEEP_END.camPos;
        destXOffsetRatio = STAGE_5_SWEEP_END.xOffsetRatio; // -0.90
        destBaseRotY = STAGE_5_SWEEP_END.baseRotY;
        destBaseRotZ = 0.0;
        destShadowOpacity = 0.0;
        destUvIntensity = 0.0;
        heroSpinAngle = STAGE_5_SWEEP_END.baseRotY;
      }

      // Smooth damping (lerp) towards destination keyframe (crisp responsive tracking during sweep)
      const lerpSpeed = p >= 0.73 ? 0.16 : 0.08;
      curTarget.lerp(destTarget, lerpSpeed);
      curCamPos.lerp(destCamPos, lerpSpeed);
      curXOffsetRatio += (destXOffsetRatio - curXOffsetRatio) * lerpSpeed;
      if (p >= 0.88) {
        // Continuous directional rotation during Stage 5 sweep (no modulo wrapping)
        curBaseRotY += (destBaseRotY - curBaseRotY) * lerpSpeed;
      } else {
        // Shortest-distance angular difference prevents any 360-degree rapid spin discontinuity between features
        const rotDiff = ((destBaseRotY - curBaseRotY + Math.PI) % (Math.PI * 2)) - Math.PI;
        curBaseRotY += rotDiff * lerpSpeed;
      }
      curBaseRotZ += (destBaseRotZ - curBaseRotZ) * lerpSpeed;
      curShadowOpacity += (destShadowOpacity - curShadowOpacity) * lerpSpeed;
      curUvIntensity += (destUvIntensity - curUvIntensity) * 0.1;

      // Modulate visibility and opacity of non-chair parts (screen, gun, front column)
      // 100% visible on Hero, Stage 1 (Screen), and Stage 2 (UV Gun) (p <= 0.58)
      // Smoothly dissolves away during transition (0.58 -> 0.66)
      // 100% hidden in Stage 3 (Chair) so only the chair is visible (0.66 -> 0.74)
      // Smoothly restores to 1.0 during descent into About Us (0.74 -> 0.81)
      // 100% visible throughout About Us and Dashboard sweep (0.81 -> 1.00)
      let nonChairOpacity = 1.0;
      if (p > 0.58 && p < 0.66) {
        const t = smoothstep(0.58, 0.66, p);
        nonChairOpacity = 1.0 - t;
      } else if (p >= 0.66 && p <= 0.74) {
        nonChairOpacity = 0.0;
      } else if (p > 0.74 && p < 0.81) {
        const t = smoothstep(0.74, 0.81, p);
        nonChairOpacity = t;
      } else if (p >= 0.81) {
        nonChairOpacity = 1.0;
      }
      (window as any).__SCROLL_STATE__ = { p, nonChairOpacity, fadeCount: fadeMeshesRef.current.length };

      if (fadeMeshesRef.current.length > 0) {
        const isVis = nonChairOpacity > 0.005;
        for (let i = 0; i < fadeMeshesRef.current.length; i++) {
          const m = fadeMeshesRef.current[i];
          m.visible = isVis;
          if (m.material) {
            if (Array.isArray(m.material)) {
              m.material.forEach((mat) => {
                mat.opacity = nonChairOpacity;
              });
            } else {
              (m.material as THREE.Material).opacity = nonChairOpacity;
            }
          }
        }
      }

      // Update Camera & Controls
      controls.target.copy(curTarget);
      applyViewOffset(width, height, curXOffsetRatio);

      if (!isInteracting) {
        camera.position.copy(curCamPos);
      }

      // Model Visibility & Rotation Management
      if (modelGroupRef.current) {
        modelGroupRef.current.visible = p < 0.98;
        if (!isInteracting) {
          if (p > 0.14) {
            // When scrolling into feature sections, damp any leftover mouse drag offset to 0
            userTurnOffset *= 0.88;
            if (Math.abs(userTurnOffset) < 0.0001) userTurnOffset = 0;
          } else {
            // On Hero, userTurnOffset smoothly returns to 0 as continuous rotation runs
            userTurnOffset *= 0.94;
            if (Math.abs(userTurnOffset) < 0.0001) userTurnOffset = 0;
          }
          modelGroupRef.current.rotation.y = curBaseRotY + userTurnOffset;
          modelGroupRef.current.rotation.z = curBaseRotZ;
        } else {
          // While user is actively dragging the mouse on turntable
          userTurnOffset = modelGroupRef.current.rotation.y - curBaseRotY;
          if (p <= 0.14) {
            heroSpinAngle = modelGroupRef.current.rotation.y;
          }
          modelGroupRef.current.rotation.z = curBaseRotZ;
        }
      }

      // Modulate Dynamic Shadow Opacity based on stage
      shadowPlaneMat.opacity = Math.max(0, curShadowOpacity * 0.34);
      contactMat.opacity = Math.max(0, curShadowOpacity * 0.45);

      controls.update();
      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountElem) return;
      width = mountElem.clientWidth;
      height = mountElem.clientHeight;

      applyViewOffset(width, height, curXOffsetRatio);
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      controls.dispose();
      pmremGenerator.dispose();
      envTexture.dispose();
      renderer.dispose();
      if (mountElem.contains(renderer.domElement)) {
        mountElem.removeChild(renderer.domElement);
      }
    };
  }, []);

    return (
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-20">
        {/* 3D WebGL Canvas Layer (passes pointer events on Hero turntable only) */}
        <div
          ref={mountRef}
          style={{ touchAction: 'pan-y' }}
          className={`w-full h-full relative ${
            scrollProgress <= 0.14 ? 'cursor-grab active:cursor-grabbing pointer-events-auto' : 'pointer-events-none'
          }`}
        />

      {/* Loading HUD */}
      {!isLoaded && !loadError && (
        <div className="absolute inset-0 z-30 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center gap-5">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
            <div className="absolute inset-0 rounded-full border-2 border-[#FF5E1E] border-t-transparent animate-spin" />
            <div className="absolute inset-2 rounded-full border-2 border-slate-100" />
            <div className="absolute inset-2 rounded-full border-2 border-[#FF5E1E]/50 border-b-transparent animate-spin [animation-duration:1.5s]" />
            <span className="text-xs font-mono text-slate-900 font-bold">
              {loadingProgress}%
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-mono tracking-widest text-slate-900 font-bold uppercase">
              Loading 3D Product System
            </span>
            <span className="text-[10px] font-mono text-slate-500 tracking-wider">
              High-Precision 2K Asset
            </span>
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {loadError && (
        <div className="absolute inset-0 z-30 bg-white flex flex-col items-center justify-center gap-3 text-red-600 font-mono text-sm">
          <span>{loadError}</span>
        </div>
      )}
    </div>
  );
};
