import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ConsoleButtonInfoCard, ButtonType } from './ConsoleButtonInfoCard';

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
  xOffsetRatio: 0.345, // Accurately frames chair inside circular outline with complete clearance from editorial text
  baseRotY: 0.95, // Exact angle matching user reference image (chair on left, pole on right)
  baseRotZ: 0.0, // Straightened (no Z-axis tilt)
  shadowOpacity: 0.20,
  uvIntensity: 0.0,
};

// Stage 5: Sweep & Flight Reveal Keyframe across to User Dashboard (0.88 - 0.98)
// Culminates exiting past the RIGHT border of the screen, growing in size (camPos.z: 4.90)
// Base rotates a full 360 degrees (2*PI) continuously across the sweep
// Calibrated to xOffsetRatio: -0.70 (screenX: 120vw) so the model center exits smoothly and stays in lockstep with the white fade
const STAGE_5_SWEEP_END = {
  target: new THREE.Vector3(0, 0.05, 0),
  camPos: new THREE.Vector3(0.0, 0.35, 4.90),
  xOffsetRatio: -0.70, // Shifts completely off the right edge of the screen in lockstep with white fade
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

// Adaptive Device Pixel Ratio: Cap DPR to eliminate fill-rate bottlenecks
function getAdaptivePixelRatio(): number {
  if (typeof window === 'undefined') return 1;
  const rawDpr = window.devicePixelRatio || 1;
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  const isLowEnd = typeof navigator !== 'undefined' && ((navigator.hardwareConcurrency || 4) <= 4);

  if (isMobile) {
    return Math.min(rawDpr, isLowEnd ? 1.0 : 1.25);
  } else if (isTablet) {
    return Math.min(rawDpr, 1.35);
  } else {
    // Desktop: clamp to 1.5 to prevent multi-million pixel overhead on 4K/retina screens while preserving razor sharpness
    return Math.min(rawDpr, 1.5);
  }
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({ scrollProgress }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const fadeMeshesRef = useRef<THREE.Mesh[]>([]);
  const chairMeshesRef = useRef<THREE.Mesh[]>([]);

  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Keep a live ref to scrollProgress for the 60fps render loop
  const scrollProgressRef = useRef<number>(scrollProgress);
  const wakeUpRenderLoopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
    // Wake up render loop if scrolling back into visible area
    wakeUpRenderLoopRef.current?.();
  }, [scrollProgress]);

  // Interactive Button Hotspots State (Stage 1: Front Screen)
  const [activeButton, setActiveButton] = useState<ButtonType | null>(null);
  const [anchorPos, setAnchorPos] = useState<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  const activeButtonRef = useRef<ButtonType | null>(null);
  useEffect(() => {
    activeButtonRef.current = activeButton;
  }, [activeButton]);

  const hotspotsContainerRef = useRef<HTMLDivElement | null>(null);
  const hotspotTopRef = useRef<HTMLButtonElement | null>(null);
  const hotspotLeftRef = useRef<HTMLButtonElement | null>(null);
  const hotspotRightRef = useRef<HTMLButtonElement | null>(null);
  const buttonMeshesRef = useRef<{
    top: THREE.Object3D | null;
    left: THREE.Object3D | null;
    right: THREE.Object3D | null;
  }>({ top: null, left: null, right: null });

  // Pre-calculated local centers for button meshes (avoids calculating bounding box across vertices every frame)
  const cachedButtonCentersRef = useRef<{
    top: THREE.Vector3 | null;
    left: THREE.Vector3 | null;
    right: THREE.Vector3 | null;
  }>({ top: null, left: null, right: null });

  const lastButtonPosRef = useRef<Record<string, { x: number; y: number }>>({});
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseVecRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const tempCenterRef = useRef<THREE.Vector3>(new THREE.Vector3());

  const handleButtonClick = (btn: ButtonType) => {
    setActiveButton((prev) => {
      if (prev === btn) return null;
      const pos = lastButtonPosRef.current[btn];
      if (pos) setAnchorPos(pos);
      return btn;
    });
  };

  useEffect(() => {
    const handleWinResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleWinResize, { passive: true });
    return () => window.removeEventListener('resize', handleWinResize);
  }, []);

  useEffect(() => {
    const mountElem = mountRef.current;
    if (!mountElem) return;

    let isMounted = true;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = null;

    // 2. Camera Setup
    let width = mountElem.clientWidth || window.innerWidth;
    let height = mountElem.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.copy(STAGE_0_HERO.camPos);

    const applyViewOffset = (w: number, h: number, xRatio: number, yRatio: number) => {
      const vpW = typeof window !== 'undefined' ? window.innerWidth : w;
      const aspect = w / h;
      camera.aspect = aspect;
      const isPortrait = aspect < 1.0;

      // Responsive FOV: Natural 40° FOV preserved across all devices, with slight 42° calibration for tablet portrait
      if (vpW < 768) {
        camera.fov = 41;
      } else if (vpW < 1024) {
        camera.fov = isPortrait ? 42 : 40;
      } else {
        camera.fov = 40;
      }

      camera.setViewOffset(w, h, w * xRatio, h * yRatio, w, h);
      camera.updateProjectionMatrix();
    };

    // Calculate initial offsets for Stage 0 based on screen size
    const initVpW = typeof window !== 'undefined' ? window.innerWidth : width;
    const initIsPortrait = width / height < 1.0;
    let initX = STAGE_0_HERO.xOffsetRatio;
    let initY = 0;
    if (initVpW < 768) {
      camera.position.z = 8.05;
      initX = 0.0;
      initY = -0.092;
    } else if (initVpW < 1024) {
      initX = initIsPortrait ? -0.26 : -0.16;
      initY = initIsPortrait ? -0.02 : 0;
    }
    applyViewOffset(width, height, initX, initY);

    // 3. WebGL Renderer with Tone Mapping and Alpha
    const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      precision: isMobileDevice ? 'mediump' : 'highp',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(getAdaptivePixelRatio());
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.38;

    // Optimized Shadow Map: Use PCFShadowMap on mobile for high framerate, PCFSoftShadowMap on desktop
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = isMobileDevice ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;

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
    controls.enableRotate = !isMobileDevice;
    renderer.domElement.style.touchAction = 'none';
    controls.minPolarAngle = Math.PI / 2.12;
    controls.maxPolarAngle = Math.PI / 2.12;
    controls.target.copy(STAGE_0_HERO.target);
    controlsRef.current = controls;

    // 5. Studio Lighting with Multi-Point Illumination & Realistic Directional Shadows
    const ambientLight = new THREE.AmbientLight(0xffffff, isMobileDevice ? 2.5 : 2.2);
    scene.add(ambientLight);

    // Front Camera Key Light: Brightens front face, contours, and user-facing controls
    const frontKeyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    frontKeyLight.position.set(0.5, 4.2, 6.8);
    scene.add(frontKeyLight);

    // Top-Right Sun Key Light: Casts soft directional contact shadows
    const sunLight = new THREE.DirectionalLight(0xfffbf2, 3.2);
    sunLight.position.set(4.5, 8.0, 4.0);
    sunLight.castShadow = true;
    const sunShadowRes = isMobileDevice ? 512 : 1024;
    sunLight.shadow.mapSize.width = sunShadowRes;
    sunLight.shadow.mapSize.height = sunShadowRes;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 25;
    sunLight.shadow.camera.left = -3.5;
    sunLight.shadow.camera.right = 3.5;
    sunLight.shadow.camera.top = 3.5;
    sunLight.shadow.camera.bottom = -3.5;
    sunLight.shadow.bias = -0.0003;
    sunLight.shadow.radius = isMobileDevice ? 3.0 : 6.5;
    scene.add(sunLight);

    // Left Fill Light: Fills shadow side, handset, and chair frame
    const leftFillLight = new THREE.DirectionalLight(0xf2f7ff, 2.0);
    leftFillLight.position.set(-5.0, 4.5, 4.0);
    scene.add(leftFillLight);

    // Top-Back Rim Light: Provides crisp edge definition and silhouette separation
    const rimLight = new THREE.DirectionalLight(0xffffff, 2.2);
    rimLight.position.set(-2.0, 7.0, -5.0);
    scene.add(rimLight);

    // Desktop auxiliary fills (omitted on mobile to conserve GPU fill rate)
    let skyFill: THREE.DirectionalLight | null = null;
    let floorBounce: THREE.DirectionalLight | null = null;
    if (!isMobileDevice) {
      skyFill = new THREE.DirectionalLight(0xdbeafe, 1.4);
      skyFill.position.set(6, 4, -2);
      scene.add(skyFill);

      floorBounce = new THREE.DirectionalLight(0xffedd5, 1.5);
      floorBounce.position.set(-3, -2, 3);
      scene.add(floorBounce);
    }

    // Dedicated key light for front screen display in Section 01
    const screenKeyLight = new THREE.PointLight(0xffffff, 2.8, 8);
    screenKeyLight.position.set(0, 1.2, 0.6);
    scene.add(screenKeyLight);

    // 6. Photorealistic Floor Contact Shadows
    // A. Real-time dynamic shadow mapping plane (casts actual rotating 3D shadows of the model)
    const shadowPlaneGeo = new THREE.PlaneGeometry(16, 16);
    const shadowPlaneMat = new THREE.ShadowMaterial({
      opacity: 0.22,
      transparent: true,
      depthWrite: false,
    });
    const shadowPlaneMesh = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlaneMesh.rotation.x = -Math.PI / 2;
    shadowPlaneMesh.position.set(0, -2.18, 0); // Exact base feet level
    shadowPlaneMesh.receiveShadow = true;
    scene.add(shadowPlaneMesh);

    // B. Soft, natural ambient contact occlusion disc
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
      opacity: 0.30,
    });
    const contactMesh = new THREE.Mesh(contactGeo, contactMat);
    contactMesh.rotation.x = -Math.PI / 2;
    contactMesh.position.set(0, -2.175, 0);
    scene.add(contactMesh);

    // 7. Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // 8. 3D GLTF Model Loader (1K Model)
    const primaryModelUrl = '/models/Final_Model(1K).glb';
    const fallbackModelUrl = '/models/Final_Model(1K).glb';

    const loader = new GLTFLoader();

    const onModelLoaded = (gltf: any) => {
      if (!isMounted) return;
      const model = gltf.scene;

      const fadeMeshes: THREE.Mesh[] = [];
      const chairMeshes: THREE.Mesh[] = [];

      model.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat) {
            mat.envMapIntensity = 1.6;
            if (mat.aoMap) {
              mat.aoMapIntensity = 0.60;
            }
            mat.roughness = Math.min(Math.max(mat.roughness ?? 0.35, 0.25), 0.82);
            mat.metalness = Math.min(mat.metalness ?? 0.8, 0.65);
            // Early-Z Optimization: keep materials opaque with depthWrite=true until opacity fade begins
            mat.transparent = false;
            mat.depthWrite = true;
            mat.needsUpdate = true;
          }

          // Clone materials so independent opacity animation works smoothly without global sharing conflicts
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material = mesh.material.map((m) => m.clone());
            } else {
              mesh.material = (mesh.material as THREE.Material).clone();
            }
          }

          // The chair is uniquely defined by material 'Chair_1K' or 'Chair_2K'
          const matName = (mesh.material as THREE.Material)?.name || '';
          const isChairMesh = matName === 'Chair_1K' || matName === 'Chair_2K' || matName.toLowerCase().includes('chair');

          // Identify hardware buttons on front screen console & cache their local centers
          if (mesh.name.includes('Button_1')) {
            buttonMeshesRef.current.top = mesh;
            mesh.geometry.computeBoundingBox();
            if (mesh.geometry.boundingBox) {
              const center = new THREE.Vector3();
              mesh.geometry.boundingBox.getCenter(center);
              cachedButtonCentersRef.current.top = center;
            }
          } else if (mesh.name.includes('Button_3')) {
            buttonMeshesRef.current.left = mesh;
            mesh.geometry.computeBoundingBox();
            if (mesh.geometry.boundingBox) {
              const center = new THREE.Vector3();
              mesh.geometry.boundingBox.getCenter(center);
              cachedButtonCentersRef.current.left = center;
            }
          } else if (mesh.name.includes('Button_2')) {
            buttonMeshesRef.current.right = mesh;
            mesh.geometry.computeBoundingBox();
            if (mesh.geometry.boundingBox) {
              const center = new THREE.Vector3();
              mesh.geometry.boundingBox.getCenter(center);
              cachedButtonCentersRef.current.right = center;
            }
          }

          if (isChairMesh) {
            chairMeshes.push(mesh);
          } else {
            fadeMeshes.push(mesh);
          }
        }
      });

      fadeMeshesRef.current = fadeMeshes;
      chairMeshesRef.current = chairMeshes;
      lastNonChairOpacity = -1;
      lastGlobalOpacity = -1;

      // Auto-center model inside group
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      model.position.x = -center.x;
      model.position.y = -center.y;
      model.position.z = -center.z;

      // Calibrated scale so the product fits comfortably and rotates strictly within the floor line
      const maxDim = Math.max(size.x, size.y, size.z);
      const targetScale = maxDim > 0 ? 3.05 / maxDim : 1;
      modelGroup.scale.set(targetScale, targetScale, targetScale);
      modelGroup.position.set(0, -0.65, 0);
      modelGroup.rotation.y = STAGE_0_HERO.baseRotY;

      controls.target.copy(STAGE_0_HERO.target);
      controls.update();

      modelGroup.add(model);
      setIsLoaded(true);
      wakeUpRenderLoop();
    };

    const loadModel = (url: string, isFallback: boolean = false) => {
      loader.load(
        url,
        onModelLoaded,
        (xhr) => {
          if (!isMounted) return;
          if (xhr.total > 0) {
            const percent = Math.round((xhr.loaded / xhr.total) * 100);
            setLoadingProgress(percent);
          } else {
            setLoadingProgress((prev) => Math.min(prev + 10, 95));
          }
        },
        (error) => {
          if (!isMounted) return;
          if (!isFallback) {
            console.warn(`Error loading optimized 3D model (${url}), falling back to standard asset:`, error);
            loadModel(fallbackModelUrl, true);
          } else {
            console.error('Error loading 3D GLB model:', error);
            setLoadError('Failed to load 3D model.');
          }
        }
      );
    };

    loadModel(primaryModelUrl);

    // Interaction tracking
    let isInteracting = false;
    let userTurnOffset = 0;
    controls.addEventListener('start', () => {
      isInteracting = true;
      wakeUpRenderLoop();
    });
    controls.addEventListener('end', () => {
      isInteracting = false;
    });

    // 9. Multi-Stage Animation & Render Loop (pre-allocated vectors for zero-GC 60fps rendering)
    let heroSpinAngle = STAGE_0_HERO.baseRotY; // Initial turntable angle
    let lastTime = performance.now();
    const curTarget = new THREE.Vector3().copy(STAGE_0_HERO.target);
    const curCamPos = new THREE.Vector3().copy(STAGE_0_HERO.camPos);
    const stage0CamPos = new THREE.Vector3();
    const stage1Target = new THREE.Vector3();
    const stage1CamPos = new THREE.Vector3();
    const stage2Target = new THREE.Vector3();
    const stage2CamPos = new THREE.Vector3();
    const stage3Target = new THREE.Vector3();
    const stage3CamPos = new THREE.Vector3();
    const lerpTargetVec = new THREE.Vector3();
    const lerpCamPosVec = new THREE.Vector3();
    const projVec = new THREE.Vector3();
    let curXOffsetRatio = initX;
    let curOffsetYRatio = initY;
    let curBaseRotY = STAGE_0_HERO.baseRotY;
    let curBaseRotZ = 0.0;
    let curShadowOpacity = STAGE_0_HERO.shadowOpacity;
    let curUvIntensity = STAGE_0_HERO.uvIntensity;
    let lastNonChairOpacity = -1;
    let lastGlobalOpacity = -1;
    let wasHiddenLastFrame = false;
    let isLoopRunning = false;
    let currentPointerZone = -1;

    // Checks prefers-reduced-motion to respect user accessibility preferences
    const prefersReducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animate = () => {
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const p = scrollProgressRef.current;
      const vpW = typeof window !== 'undefined' ? window.innerWidth : width;

      // Dynamic DOM pointer-events management: updates directly without causing React component re-renders
      if (mountElem) {
        const targetZone = p <= 0.14 ? 0 : (p >= 0.235 && p <= 0.365 ? 1 : 2);
        if (targetZone !== currentPointerZone) {
          currentPointerZone = targetZone;
          if (targetZone === 0) {
            mountElem.className = 'w-full h-full relative pointer-events-none md:pointer-events-auto md:cursor-grab md:active:cursor-grabbing';
          } else if (targetZone === 1) {
            mountElem.className = 'w-full h-full relative pointer-events-auto';
          } else {
            mountElem.className = 'w-full h-full relative pointer-events-none';
          }
        }
      }

      // Turntable rotation animation active on Hero section
      if (p <= 0.14) {
        if (!isInteracting && !prefersReducedMotion) {
          heroSpinAngle += delta * 0.26;
        }
      }

      // Calculate desired stage keyframe values based on scroll progress
      let destTarget: THREE.Vector3;
      let destCamPos: THREE.Vector3;
      let destXOffsetRatio: number;
      let destOffsetYRatio: number;
      let destBaseRotY: number;
      let destBaseRotZ = 0.0;
      let destShadowOpacity: number;
      let destUvIntensity: number;

      // Device-calibrated Stage targets (reusing pre-allocated vectors):
      stage0CamPos.copy(STAGE_0_HERO.camPos);
      stage1Target.copy(STAGE_1_SCREEN.target);
      stage1CamPos.copy(STAGE_1_SCREEN.camPos);
      stage2Target.copy(STAGE_2_UV.target);
      stage2CamPos.copy(STAGE_2_UV.camPos);
      stage3Target.copy(STAGE_3_CHAIR.target);
      stage3CamPos.copy(STAGE_3_CHAIR.camPos);
      const isPortraitMode = width / height < 1.0;

      // Physical offsets per stage across devices (continuous interpolation with zero stepped jumps)
      let s0X = STAGE_0_HERO.xOffsetRatio;
      let s0Y = 0.0;
      let s1X = STAGE_1_SCREEN.xOffsetRatio;
      let s1Y = 0.0;
      let s2X = STAGE_2_UV.xOffsetRatio;
      let s2Y = 0.0;
      let s3X = STAGE_3_CHAIR.xOffsetRatio;
      let s3Y = 0.0;
      let s4X = STAGE_4_ABOUT.xOffsetRatio;
      let s4Y = 0.0;
      let s5X = STAGE_5_SWEEP_END.xOffsetRatio;
      let s5Y = 0.0;

      if (vpW < 768) {
        // Mobile camera framing
        stage0CamPos.z = 8.05;

        stage1Target.x = 0.0;
        stage1CamPos.x = 0.0;
        stage1CamPos.z = 3.25;
        stage1CamPos.y = 0.54;

        stage2CamPos.z = 2.05;
        stage2CamPos.y = 0.06;
        stage2Target.y = 0.01;

        stage3CamPos.z = 5.30;
        stage3CamPos.y = -0.32;
        stage3Target.y = -0.46;

        s0X = 0.0;
        s0Y = -0.092;
        s1X = 0.0;
        s1Y = 0.065;
        s2X = -0.04;
        s2Y = 0.045;
        s3X = 0.0;
        s3Y = 0.020;
        s4X = 0.0;
        s4Y = -0.02;
        s5X = -1.25;
        s5Y = -0.08;
      } else if (vpW < 1024) {
        // Tablet framing and offsets
        if (isPortraitMode) {
          stage1Target.x = 0.01;
          stage1CamPos.x = 0.01;
          stage1CamPos.z = 2.05;
          stage1CamPos.y = 0.54;

          stage2CamPos.z = 1.68;
          stage2CamPos.y = 0.03;

          stage3CamPos.z = 2.75;
          stage3CamPos.y = -0.18;

          s0X = -0.26;
          s0Y = -0.02;
          s1X = -0.19;
          s1Y = 0.0;
          s2X = 0.20;
          s2Y = 0.20;
          s3X = -0.24;
          s3Y = 0.0;
          s4X = 0.345 * 0.85;
          s4Y = 0.0;
          s5X = -0.75;
          s5Y = 0.0;
        } else {
          s0X = -0.16;
          s0Y = 0.0;
          s1X = -0.21;
          s1Y = 0.0;
          s2X = 0.195;
          s2Y = 0.0;
          s3X = -0.19;
          s3Y = 0.0;
          s4X = 0.345 * 0.90;
          s4Y = 0.0;
          s5X = -0.75;
          s5Y = 0.0;
        }
      }

      if (p <= 0.14) {
        // Stage 0: Hero Section Turntable View
        destTarget = STAGE_0_HERO.target;
        destCamPos = stage0CamPos;
        destXOffsetRatio = s0X;
        destOffsetYRatio = s0Y;
        destBaseRotY = heroSpinAngle;
        destShadowOpacity = STAGE_0_HERO.shadowOpacity;
        destUvIntensity = STAGE_0_HERO.uvIntensity;
      } else if (p < 0.24) {
        // Transition Stage 0 -> Stage 1
        const t = smoothstep(0.14, 0.24, p);
        destTarget = lerpTargetVec.lerpVectors(STAGE_0_HERO.target, stage1Target, t);
        destCamPos = lerpCamPosVec.lerpVectors(stage0CamPos, stage1CamPos, t);
        destXOffsetRatio = THREE.MathUtils.lerp(s0X, s1X, t);
        destOffsetYRatio = THREE.MathUtils.lerp(s0Y, s1Y, t);
        destBaseRotY = interpolateAngle(heroSpinAngle, STAGE_1_SCREEN.baseRotY, t);
        destShadowOpacity = THREE.MathUtils.lerp(STAGE_0_HERO.shadowOpacity, STAGE_1_SCREEN.shadowOpacity, t);
        destUvIntensity = 0.0;
      } else if (p <= 0.36) {
        // Stage 1: Front Touch Screen Feature View
        destTarget = stage1Target;
        destCamPos = stage1CamPos;
        destXOffsetRatio = s1X;
        destOffsetYRatio = s1Y;
        destBaseRotY = STAGE_1_SCREEN.baseRotY;
        destShadowOpacity = STAGE_1_SCREEN.shadowOpacity;
        destUvIntensity = STAGE_1_SCREEN.uvIntensity;
        heroSpinAngle = STAGE_1_SCREEN.baseRotY;
      } else if (p < 0.46) {
        // Transition Stage 1 -> Stage 2
        const t = smoothstep(0.36, 0.46, p);
        destTarget = lerpTargetVec.lerpVectors(stage1Target, stage2Target, t);
        destCamPos = lerpCamPosVec.lerpVectors(stage1CamPos, stage2CamPos, t);
        destXOffsetRatio = THREE.MathUtils.lerp(s1X, s2X, t);
        destOffsetYRatio = THREE.MathUtils.lerp(s1Y, s2Y, t);
        destBaseRotY = interpolateAngle(STAGE_1_SCREEN.baseRotY, STAGE_2_UV.baseRotY, t);
        destShadowOpacity = 0.0;
        destUvIntensity = 0.0;
      } else if (p <= 0.58) {
        // Stage 2: UV Sanitization Handpiece View
        destTarget = stage2Target;
        destCamPos = stage2CamPos;
        destXOffsetRatio = s2X;
        destOffsetYRatio = s2Y;
        destBaseRotY = STAGE_2_UV.baseRotY;
        destShadowOpacity = STAGE_2_UV.shadowOpacity;
        destUvIntensity = STAGE_2_UV.uvIntensity;
        heroSpinAngle = STAGE_2_UV.baseRotY;
      } else if (p < 0.68) {
        // Transition Stage 2 -> Stage 3
        const t = smoothstep(0.58, 0.68, p);
        destTarget = lerpTargetVec.lerpVectors(stage2Target, stage3Target, t);
        destCamPos = lerpCamPosVec.lerpVectors(stage2CamPos, stage3CamPos, t);
        destXOffsetRatio = THREE.MathUtils.lerp(s2X, s3X, t);
        destOffsetYRatio = THREE.MathUtils.lerp(s2Y, s3Y, t);
        destBaseRotY = interpolateAngle(STAGE_2_UV.baseRotY, STAGE_3_CHAIR.baseRotY, t);
        destShadowOpacity = THREE.MathUtils.lerp(STAGE_2_UV.shadowOpacity, STAGE_3_CHAIR.shadowOpacity, t);
        destUvIntensity = 0.0;
      } else {
        if (vpW < 768) {
          if (p <= 0.725) {
            destTarget = stage3Target;
            destCamPos = stage3CamPos;
            destXOffsetRatio = s3X;
            destOffsetYRatio = s3Y;
            destBaseRotY = STAGE_3_CHAIR.baseRotY;
            destShadowOpacity = STAGE_3_CHAIR.shadowOpacity;
            destUvIntensity = 0.0;
            heroSpinAngle = STAGE_3_CHAIR.baseRotY;
          } else if (p < 0.795) {
            const tExit = smoothstep(0.725, 0.795, p);
            destTarget = stage3Target;
            destCamPos = lerpCamPosVec.set(
              stage3CamPos.x,
              stage3CamPos.y + 0.12 * tExit,
              stage3CamPos.z + 1.10 * tExit
            );
            destXOffsetRatio = THREE.MathUtils.lerp(s3X, -0.95, tExit);
            destOffsetYRatio = THREE.MathUtils.lerp(s3Y, 0.06, tExit);
            destBaseRotY = interpolateAngle(STAGE_3_CHAIR.baseRotY, STAGE_3_CHAIR.baseRotY + 0.32, tExit);
            destBaseRotZ = 0.0;
            destShadowOpacity = THREE.MathUtils.lerp(STAGE_3_CHAIR.shadowOpacity, 0.0, tExit);
            destUvIntensity = 0.0;
            heroSpinAngle = destBaseRotY;
          } else {
            destTarget = stage3Target;
            destCamPos = stage3CamPos;
            destXOffsetRatio = -0.95;
            destOffsetYRatio = 0.06;
            destBaseRotY = STAGE_3_CHAIR.baseRotY + 0.32;
            destBaseRotZ = 0.0;
            destShadowOpacity = 0.0;
            destUvIntensity = 0.0;
            heroSpinAngle = destBaseRotY;
          }
        } else {
          if (p <= 0.73) {
            destTarget = stage3Target;
            destCamPos = stage3CamPos;
            destXOffsetRatio = s3X;
            destOffsetYRatio = s3Y;
            destBaseRotY = STAGE_3_CHAIR.baseRotY;
            destShadowOpacity = STAGE_3_CHAIR.shadowOpacity;
            destUvIntensity = STAGE_3_CHAIR.uvIntensity;
            heroSpinAngle = STAGE_3_CHAIR.baseRotY;
          } else if (p < 0.81) {
            const t = smoothstep(0.73, 0.81, p);
            destTarget = lerpTargetVec.lerpVectors(stage3Target, STAGE_4_ABOUT.target, t);
            destCamPos = lerpCamPosVec.lerpVectors(stage3CamPos, STAGE_4_ABOUT.camPos, t);
            destXOffsetRatio = THREE.MathUtils.lerp(s3X, s4X, t);
            destOffsetYRatio = THREE.MathUtils.lerp(s3Y, s4Y, t);
            destBaseRotY = interpolateAngle(STAGE_3_CHAIR.baseRotY, STAGE_4_ABOUT.baseRotY, t);
            destBaseRotZ = THREE.MathUtils.lerp(0.0, STAGE_4_ABOUT.baseRotZ, t);
            destShadowOpacity = THREE.MathUtils.lerp(STAGE_3_CHAIR.shadowOpacity, STAGE_4_ABOUT.shadowOpacity, t);
            destUvIntensity = 0.0;
            heroSpinAngle = STAGE_4_ABOUT.baseRotY;
          } else if (p <= 0.855) {
            destTarget = STAGE_4_ABOUT.target;
            destCamPos = STAGE_4_ABOUT.camPos;
            destXOffsetRatio = s4X;
            destOffsetYRatio = s4Y;
            destBaseRotY = STAGE_4_ABOUT.baseRotY;
            destBaseRotZ = STAGE_4_ABOUT.baseRotZ;
            destShadowOpacity = STAGE_4_ABOUT.shadowOpacity;
            destUvIntensity = 0.0;
            heroSpinAngle = STAGE_4_ABOUT.baseRotY;
          } else if (p < 0.925) {
            const t = Math.min(1, Math.max(0, (p - 0.855) / 0.070));
            const ease = t * t * (3 - 2 * t);
            destTarget = lerpTargetVec.lerpVectors(STAGE_4_ABOUT.target, STAGE_5_SWEEP_END.target, ease);
            destCamPos = lerpCamPosVec.lerpVectors(STAGE_4_ABOUT.camPos, STAGE_5_SWEEP_END.camPos, ease);
            destXOffsetRatio = THREE.MathUtils.lerp(s4X, s5X, ease);
            destOffsetYRatio = THREE.MathUtils.lerp(s4Y, s5Y, ease);
            destBaseRotY = THREE.MathUtils.lerp(STAGE_4_ABOUT.baseRotY, STAGE_5_SWEEP_END.baseRotY, ease);
            destBaseRotZ = THREE.MathUtils.lerp(STAGE_4_ABOUT.baseRotZ, 0.0, ease);
            destShadowOpacity = THREE.MathUtils.lerp(STAGE_4_ABOUT.shadowOpacity, STAGE_5_SWEEP_END.shadowOpacity, ease);
            destUvIntensity = 0.0;
            heroSpinAngle = destBaseRotY;
          } else {
            destTarget = STAGE_5_SWEEP_END.target;
            destCamPos = STAGE_5_SWEEP_END.camPos;
            destXOffsetRatio = s5X;
            destOffsetYRatio = s5Y;
            destBaseRotY = STAGE_5_SWEEP_END.baseRotY;
            destBaseRotZ = 0.0;
            destShadowOpacity = 0.0;
            destUvIntensity = 0.0;
            heroSpinAngle = STAGE_5_SWEEP_END.baseRotY;
          }
        }
      }

      // Responsive lerp speed
      let lerpSpeed = p >= 0.855 ? 0.12 : p >= 0.73 ? 0.16 : 0.08;
      if (vpW < 768) {
        lerpSpeed = Math.max(0.14, Math.min(0.24, delta * 9.5));
      } else if (vpW < 1024) {
        lerpSpeed = p >= 0.855 ? 0.12 : p >= 0.73 ? 0.18 : 0.12;
      }

      curTarget.lerp(destTarget, lerpSpeed);
      curCamPos.lerp(destCamPos, lerpSpeed);
      curXOffsetRatio += (destXOffsetRatio - curXOffsetRatio) * lerpSpeed;
      curOffsetYRatio += (destOffsetYRatio - curOffsetYRatio) * lerpSpeed;

      if (p >= 0.855 && vpW >= 768) {
        curBaseRotY += (destBaseRotY - curBaseRotY) * lerpSpeed;
      } else {
        const rotDiff = ((destBaseRotY - curBaseRotY + Math.PI) % (Math.PI * 2)) - Math.PI;
        curBaseRotY += rotDiff * lerpSpeed;
      }
      curBaseRotZ += (destBaseRotZ - curBaseRotZ) * lerpSpeed;
      curShadowOpacity += (destShadowOpacity - curShadowOpacity) * lerpSpeed;
      curUvIntensity += (destUvIntensity - curUvIntensity) * 0.1;

      // Modulate visibility and opacity of non-chair parts
      let nonChairOpacity = 1.0;
      if (p > 0.58 && p < 0.66) {
        const t = smoothstep(0.58, 0.66, p);
        nonChairOpacity = 1.0 - t;
      } else if (p >= 0.66 && p <= 0.74) {
        nonChairOpacity = 0.0;
      } else if (p > 0.74 && p < 0.81) {
        if (vpW < 768) {
          nonChairOpacity = 0.0;
        } else {
          const t = smoothstep(0.74, 0.81, p);
          nonChairOpacity = t;
        }
      } else if (p >= 0.81) {
        nonChairOpacity = vpW < 768 ? 0.0 : 1.0;
      }

      // Stage 5 Model Fade
      let globalModelOpacity = 1.0;
      if (vpW < 768) {
        if (p > 0.74 && p < 0.795) {
          const tFade = smoothstep(0.74, 0.795, p);
          globalModelOpacity = 1.0 - tFade;
        } else if (p >= 0.795) {
          globalModelOpacity = 0.0;
        }
      } else {
        if (p >= 0.895 && p < 0.928) {
          const tSweepFade = smoothstep(0.895, 0.928, p);
          globalModelOpacity = 1.0 - tSweepFade;
        } else if (p >= 0.928) {
          globalModelOpacity = 0.0;
        }
      }

      const effectiveNonChair = nonChairOpacity * globalModelOpacity;
      const opacityChanged =
        Math.abs(effectiveNonChair - lastNonChairOpacity) > 0.001 ||
        Math.abs(globalModelOpacity - lastGlobalOpacity) > 0.001;

      if (opacityChanged) {
        lastNonChairOpacity = effectiveNonChair;
        lastGlobalOpacity = globalModelOpacity;

        const isFadeVis = effectiveNonChair > 0.005;
        // Early-Z Optimization: enable depth testing & disable alpha blending whenever fully opaque
        const needsFadeTransparent = effectiveNonChair < 0.995;
        for (let i = 0; i < fadeMeshesRef.current.length; i++) {
          const m = fadeMeshesRef.current[i];
          m.visible = isFadeVis;
          if (m.material) {
            const mats = Array.isArray(m.material) ? m.material : [m.material];
            for (let j = 0; j < mats.length; j++) {
              const mat = mats[j] as THREE.MeshStandardMaterial;
              if (mat.transparent !== needsFadeTransparent) {
                mat.transparent = needsFadeTransparent;
                mat.depthWrite = !needsFadeTransparent;
                mat.needsUpdate = true;
              }
              mat.opacity = effectiveNonChair;
            }
          }
        }

        const isChairVis = globalModelOpacity > 0.005;
        const needsChairTransparent = globalModelOpacity < 0.995;
        for (let i = 0; i < chairMeshesRef.current.length; i++) {
          const m = chairMeshesRef.current[i];
          m.visible = isChairVis;
          if (m.material) {
            const mats = Array.isArray(m.material) ? m.material : [m.material];
            for (let j = 0; j < mats.length; j++) {
              const mat = mats[j] as THREE.MeshStandardMaterial;
              if (mat.transparent !== needsChairTransparent) {
                mat.transparent = needsChairTransparent;
                mat.depthWrite = !needsChairTransparent;
                mat.needsUpdate = true;
              }
              mat.opacity = globalModelOpacity;
            }
          }
        }
      }

      // Update Camera & Controls
      controls.target.copy(curTarget);
      applyViewOffset(width, height, curXOffsetRatio, curOffsetYRatio);

      if (!isInteracting) {
        camera.position.copy(curCamPos);
      }

      // Model Visibility & Rotation Management
      const isVisibleProgress = vpW < 768 ? p < 0.80 : p < 0.98;
      const isModelCurrentlyVisible = isVisibleProgress && globalModelOpacity > 0.001;

      if (modelGroupRef.current) {
        modelGroupRef.current.visible = isModelCurrentlyVisible;
        if (!isInteracting) {
          if (p > 0.14) {
            userTurnOffset *= 0.88;
            if (Math.abs(userTurnOffset) < 0.0001) userTurnOffset = 0;
          } else {
            userTurnOffset *= 0.94;
            if (Math.abs(userTurnOffset) < 0.0001) userTurnOffset = 0;
          }
          modelGroupRef.current.rotation.y = curBaseRotY + userTurnOffset;
          modelGroupRef.current.rotation.z = curBaseRotZ;
        } else {
          userTurnOffset = modelGroupRef.current.rotation.y - curBaseRotY;
          if (p <= 0.14) {
            heroSpinAngle = modelGroupRef.current.rotation.y;
          }
          modelGroupRef.current.rotation.z = curBaseRotZ;
        }
      }

      // Modulate Dynamic Shadow Opacity & automatically toggle shadow pass
      const hasVisibleShadow = isModelCurrentlyVisible && curShadowOpacity > 0.01;
      shadowPlaneMesh.visible = hasVisibleShadow;
      contactMesh.visible = hasVisibleShadow;
      sunLight.castShadow = hasVisibleShadow;
      renderer.shadowMap.autoUpdate = hasVisibleShadow;

      if (hasVisibleShadow) {
        shadowPlaneMat.opacity = Math.max(0, curShadowOpacity * 0.34);
        contactMat.opacity = Math.max(0, curShadowOpacity * 0.45);
      }

      // Update camera and model world matrices BEFORE projecting 3D button hotspots
      controls.update();
      camera.updateMatrixWorld();
      if (modelGroupRef.current && isModelCurrentlyVisible) {
        modelGroupRef.current.updateMatrixWorld(true);
      }

      // ----------------------------------------------------
      // Button Hotspots Position Projection (Stage 1: 0.235 - 0.365)
      // Highly optimized: uses cached local centers with zero vertex looping
      // ----------------------------------------------------
      const isStage1Open = p >= 0.235 && p <= 0.365;
      if (hotspotsContainerRef.current) {
        if (
          isStage1Open &&
          buttonMeshesRef.current.top &&
          buttonMeshesRef.current.left &&
          buttonMeshesRef.current.right
        ) {
          const projectBtnFast = (obj: THREE.Object3D, cachedLocalCenter: THREE.Vector3 | null) => {
            const center = cachedLocalCenter
              ? tempCenterRef.current.copy(cachedLocalCenter).applyMatrix4(obj.matrixWorld)
              : obj.getWorldPosition(tempCenterRef.current);
            const proj = projVec.copy(center).project(camera);
            const screenX = (proj.x * 0.5 + 0.5) * width;
            const screenY = (-(proj.y * 0.5) + 0.5) * height;
            const visible =
              proj.z > 0 &&
              proj.z < 1 &&
              proj.x >= -1.1 &&
              proj.x <= 1.1 &&
              proj.y >= -1.1 &&
              proj.y <= 1.1;
            return { x: screenX, y: screenY, visible };
          };

          const topPos = projectBtnFast(buttonMeshesRef.current.top, cachedButtonCentersRef.current.top);
          const leftPos = projectBtnFast(buttonMeshesRef.current.left, cachedButtonCentersRef.current.left);
          const rightPos = projectBtnFast(buttonMeshesRef.current.right, cachedButtonCentersRef.current.right);

          lastButtonPosRef.current = {
            uv: { x: topPos.x, y: topPos.y },
            start: { x: leftPos.x, y: leftPos.y },
            reset: { x: rightPos.x, y: rightPos.y },
          };

          if (hotspotTopRef.current) {
            hotspotTopRef.current.style.transform = `translate3d(${topPos.x}px, ${topPos.y}px, 0)`;
            hotspotTopRef.current.style.opacity = topPos.visible ? '1' : '0';
            hotspotTopRef.current.style.pointerEvents = topPos.visible ? 'auto' : 'none';
          }
          if (hotspotLeftRef.current) {
            hotspotLeftRef.current.style.transform = `translate3d(${leftPos.x}px, ${leftPos.y}px, 0)`;
            hotspotLeftRef.current.style.opacity = leftPos.visible ? '1' : '0';
            hotspotLeftRef.current.style.pointerEvents = leftPos.visible ? 'auto' : 'none';
          }
          if (hotspotRightRef.current) {
            hotspotRightRef.current.style.transform = `translate3d(${rightPos.x}px, ${rightPos.y}px, 0)`;
            hotspotRightRef.current.style.opacity = rightPos.visible ? '1' : '0';
            hotspotRightRef.current.style.pointerEvents = rightPos.visible ? 'auto' : 'none';
          }

          hotspotsContainerRef.current.style.opacity = '1';
          hotspotsContainerRef.current.style.pointerEvents = 'auto';
        } else {
          hotspotsContainerRef.current.style.opacity = '0';
          hotspotsContainerRef.current.style.pointerEvents = 'none';
        }
      }

      // Automatically close active button info card when scrolling away from Stage 1
      if (activeButtonRef.current && (p < 0.22 || p > 0.38)) {
        setActiveButton(null);
      }

      // Skip redundant WebGL draw calls once the 3D model has completely exited
      if (isModelCurrentlyVisible || !wasHiddenLastFrame) {
        renderer.render(scene, camera);
        wasHiddenLastFrame = !isModelCurrentlyVisible;
      }

      // Smart Render Loop Pause: when model is completely off-screen and last frame was cleared,
      // pause requestAnimationFrame loop to eliminate 100% idle GPU and CPU usage!
      if (!isModelCurrentlyVisible && wasHiddenLastFrame && !isInteracting) {
        isLoopRunning = false;
        animFrameIdRef.current = null;
        return;
      }

      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    const wakeUpRenderLoop = () => {
      if (!isLoopRunning && isMounted) {
        isLoopRunning = true;
        lastTime = performance.now();
        animFrameIdRef.current = requestAnimationFrame(animate);
      }
    };

    wakeUpRenderLoopRef.current = wakeUpRenderLoop;
    wakeUpRenderLoop();

    // Raycaster click and pointermove event listeners for 3D buttons on canvas
    const handleCanvasClick = (e: MouseEvent) => {
      const p = scrollProgressRef.current;
      if (p < 0.235 || p > 0.365) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseVecRef.current.set(x, y);
      raycasterRef.current.setFromCamera(mouseVecRef.current, camera);
      const buttons = [
        buttonMeshesRef.current.top,
        buttonMeshesRef.current.left,
        buttonMeshesRef.current.right,
      ].filter(Boolean) as THREE.Object3D[];
      const hits = raycasterRef.current.intersectObjects(buttons, true);
      if (hits.length > 0) {
        const hit = hits[0].object;
        if (hit.name.includes('Button_1')) handleButtonClick('uv');
        else if (hit.name.includes('Button_3')) handleButtonClick('start');
        else if (hit.name.includes('Button_2')) handleButtonClick('reset');
      }
    };

    const handleCanvasPointerMove = (e: MouseEvent) => {
      const p = scrollProgressRef.current;
      if (p < 0.235 || p > 0.365) {
        renderer.domElement.style.cursor = '';
        return;
      }
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseVecRef.current.set(x, y);
      raycasterRef.current.setFromCamera(mouseVecRef.current, camera);
      const buttons = [
        buttonMeshesRef.current.top,
        buttonMeshesRef.current.left,
        buttonMeshesRef.current.right,
      ].filter(Boolean) as THREE.Object3D[];
      const hits = raycasterRef.current.intersectObjects(buttons, true);
      renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : '';
    };

    let touchStartClientX = 0;
    let touchStartClientY = 0;
    const handleCanvasTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartClientX = e.touches[0].clientX;
        touchStartClientY = e.touches[0].clientY;
      }
    };

    const handleCanvasTouchEnd = (e: TouchEvent) => {
      const p = scrollProgressRef.current;
      if (p < 0.235 || p > 0.365) return;
      if (e.changedTouches.length === 0) return;
      const touch = e.changedTouches[0];
      if (Math.hypot(touch.clientX - touchStartClientX, touch.clientY - touchStartClientY) > 10) {
        return;
      }
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
      mouseVecRef.current.set(x, y);
      raycasterRef.current.setFromCamera(mouseVecRef.current, camera);
      const buttons = [
        buttonMeshesRef.current.top,
        buttonMeshesRef.current.left,
        buttonMeshesRef.current.right,
      ].filter(Boolean) as THREE.Object3D[];
      const hits = raycasterRef.current.intersectObjects(buttons, true);
      if (hits.length > 0) {
        e.preventDefault();
        const hit = hits[0].object;
        if (hit.name.includes('Button_1')) handleButtonClick('uv');
        else if (hit.name.includes('Button_3')) handleButtonClick('start');
        else if (hit.name.includes('Button_2')) handleButtonClick('reset');
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);
    renderer.domElement.addEventListener('touchstart', handleCanvasTouchStart, { passive: true });
    renderer.domElement.addEventListener('touchend', handleCanvasTouchEnd, { passive: false });
    renderer.domElement.addEventListener('pointermove', handleCanvasPointerMove);

    // Optimized Resize & Visibility Observers
    const handleResize = () => {
      if (!mountElem) return;
      width = mountElem.clientWidth || window.innerWidth;
      height = mountElem.clientHeight || window.innerHeight;

      camera.aspect = width / height;
      applyViewOffset(width, height, curXOffsetRatio, curOffsetYRatio);
      renderer.setSize(width, height);
      renderer.setPixelRatio(getAdaptivePixelRatio());

      const isMobileNow = window.innerWidth < 768;
      controls.enableRotate = !isMobileNow;
      wakeUpRenderLoop();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Page Visibility API: Stop rendering when tab is hidden, resume when tab is active
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animFrameIdRef.current) {
          cancelAnimationFrame(animFrameIdRef.current);
          animFrameIdRef.current = null;
        }
        isLoopRunning = false;
      } else {
        wakeUpRenderLoop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Comprehensive Resource Disposal on Unmount
    return () => {
      isMounted = false;
      wakeUpRenderLoopRef.current = null;
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      renderer.domElement.removeEventListener('click', handleCanvasClick);
      renderer.domElement.removeEventListener('touchstart', handleCanvasTouchStart);
      renderer.domElement.removeEventListener('touchend', handleCanvasTouchEnd);
      renderer.domElement.removeEventListener('pointermove', handleCanvasPointerMove);

      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }

      controls.dispose();
      pmremGenerator.dispose();
      envTexture.dispose();
      roomEnv.dispose();

      // Traverse and thoroughly dispose of all scene geometries, materials, and textures
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          if (mesh.material) {
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            for (const mat of mats) {
              const m = mat as THREE.MeshStandardMaterial;
              if (m.map) m.map.dispose();
              if (m.normalMap) m.normalMap.dispose();
              if (m.roughnessMap) m.roughnessMap.dispose();
              if (m.metalnessMap) m.metalnessMap.dispose();
              if (m.aoMap) m.aoMap.dispose();
              if (m.envMap) m.envMap.dispose();
              m.dispose();
            }
          }
        }
      });

      shadowPlaneGeo.dispose();
      shadowPlaneMat.dispose();
      contactGeo.dispose();
      contactMat.dispose();
      contactTexture.dispose();

      renderer.dispose();
      renderer.forceContextLoss();

      if (mountElem.contains(renderer.domElement)) {
        mountElem.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-20">
      {/* 3D WebGL Canvas Layer (pointer-events managed directly on DOM ref for zero React re-render overhead) */}
      <div
        ref={mountRef}
        style={{ touchAction: 'none' }}
        className="w-full h-full relative pointer-events-none"
      />

      {/* Interactive Hotspots for Feature 01 Buttons */}
      <div
        ref={hotspotsContainerRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-150 ease-out z-30"
        style={{ opacity: 0 }}
      >
        {/* Top Button Hotspot: UV Sanitization */}
        <button
          ref={hotspotTopRef}
          onClick={(e) => {
            e.stopPropagation();
            handleButtonClick('uv');
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            handleButtonClick('uv');
          }}
          className="absolute -top-3 -left-3 sm:-top-3.5 sm:-left-3.5 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full group cursor-pointer active:scale-90 pointer-events-auto z-10"
          title="Top Button: UV Sanitization"
          aria-label="UV Sanitization Button"
        >
          {/* Radar Ring */}
          <span className="pointer-events-none absolute inset-0 rounded-full bg-purple-400 opacity-60 animate-ping" />
          {/* Glass Halo */}
          <span
            className={`pointer-events-none absolute inset-0 rounded-full bg-purple-500/25 backdrop-blur-xs border border-purple-400/90 shadow-[0_0_12px_rgba(168,85,247,0.7)] group-hover:scale-125 transition-all ${
              activeButton === 'uv'
                ? 'scale-125 ring-2 ring-purple-400 ring-offset-2 ring-offset-slate-900'
                : ''
            }`}
          />
          {/* Solid Core Dot */}
          <span className="pointer-events-none relative w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white shadow-[0_0_8px_#a855f7] border border-purple-400 flex items-center justify-center">
            <span className="pointer-events-none w-1 h-1 rounded-full bg-purple-600" />
          </span>
        </button>

        {/* Left Button Hotspot: Start */}
        <button
          ref={hotspotLeftRef}
          onClick={(e) => {
            e.stopPropagation();
            handleButtonClick('start');
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            handleButtonClick('start');
          }}
          className="absolute -top-3 -left-3 sm:-top-3.5 sm:-left-3.5 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full group cursor-pointer active:scale-90 pointer-events-auto z-10"
          title="Left Button: Start"
          aria-label="Start Button"
        >
          {/* Radar Ring */}
          <span className="pointer-events-none absolute inset-0 rounded-full bg-emerald-400 opacity-60 animate-ping" />
          {/* Glass Halo */}
          <span
            className={`pointer-events-none absolute inset-0 rounded-full bg-emerald-500/25 backdrop-blur-xs border border-emerald-400/90 shadow-[0_0_12px_rgba(16,185,129,0.7)] group-hover:scale-125 transition-all ${
              activeButton === 'start'
                ? 'scale-125 ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900'
                : ''
            }`}
          />
          {/* Solid Core Dot */}
          <span className="pointer-events-none relative w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white shadow-[0_0_8px_#10b981] border border-emerald-400 flex items-center justify-center">
            <span className="pointer-events-none w-1 h-1 rounded-full bg-emerald-600" />
          </span>
        </button>

        {/* Right Button Hotspot: Reset */}
        <button
          ref={hotspotRightRef}
          onClick={(e) => {
            e.stopPropagation();
            handleButtonClick('reset');
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            handleButtonClick('reset');
          }}
          className="absolute -top-3 -left-3 sm:-top-3.5 sm:-left-3.5 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full group cursor-pointer active:scale-90 pointer-events-auto z-10"
          title="Right Button: Reset"
          aria-label="Reset Button"
        >
          {/* Radar Ring */}
          <span className="pointer-events-none absolute inset-0 rounded-full bg-rose-400 opacity-60 animate-ping" />
          {/* Glass Halo */}
          <span
            className={`pointer-events-none absolute inset-0 rounded-full bg-rose-500/25 backdrop-blur-xs border border-rose-400/90 shadow-[0_0_12px_rgba(244,63,94,0.7)] group-hover:scale-125 transition-all ${
              activeButton === 'reset'
                ? 'scale-125 ring-2 ring-rose-400 ring-offset-2 ring-offset-slate-900'
                : ''
            }`}
          />
          {/* Solid Core Dot */}
          <span className="pointer-events-none relative w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white shadow-[0_0_8px_#f43f5e] border border-rose-400 flex items-center justify-center">
            <span className="pointer-events-none w-1 h-1 rounded-full bg-rose-600" />
          </span>
        </button>
      </div>

      {/* Animated Popover Information Card (Only displays when a button is clicked) */}
      <ConsoleButtonInfoCard
        activeButton={activeButton}
        onClose={() => setActiveButton(null)}
        anchorPos={anchorPos}
        isMobile={isMobile}
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
              {isMobile ? 'High-Performance Mobile Asset' : 'High-Precision 2K Asset'}
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
