import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, useGLTF, OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Preload the realistic lung 3D model
useGLTF.preload('/realistic_human_lungs.glb');

interface Pollution3DProps {
  aqi: number; // 25 to 500
  isPurifying?: boolean;
  viewMode?: 'full' | 'bronchi';
}

// ----------------------------------------------------------------------
// 1. Biological Lung with Dynamic Anthracosis (Tissue Pollution Degradation)
// ----------------------------------------------------------------------
const DynamicPollutedLung = ({
  aqi,
  isPurifying,
}: {
  aqi: number;
  isPurifying: boolean;
}) => {
  const { scene } = useGLTF('/realistic_human_lungs.glb');
  const groupRef = useRef<THREE.Group>(null);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);
  const { size } = useThree();

  const isMobile = size.width < 768;
  // Scaled up so the 3D model itself fills the frame prominently
  const baseScale = isMobile ? 2.65 : 3.45;

  // Normalized pollution factor: 0 (clean) to 1 (lethal attack)
  const pollutionFactor = Math.min(1, Math.max(0, (aqi - 50) / 400));

  // Store original materials and create dynamic customizable instances
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  useEffect(() => {
    materialsRef.current = [];
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        // Clone material so we can mutate without affecting other components
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => m.clone());
          materialsRef.current.push(...(mesh.material as THREE.MeshStandardMaterial[]));
        } else if (mesh.material) {
          mesh.material = mesh.material.clone();
          materialsRef.current.push(mesh.material as THREE.MeshStandardMaterial);
        }
      }
    });
  }, [clonedScene]);

  // Healthy coral vs severe anthracotic soot color targets
  const healthyColor = useMemo(() => new THREE.Color('#d47b7b'), []);
  const diseasedColor = useMemo(() => new THREE.Color('#1c1c22'), []);
  const currentColor = useRef(new THREE.Color('#d47b7b'));

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Target color based on pollution or purifying burst
    const target = isPurifying ? healthyColor : healthyColor.clone().lerp(diseasedColor, pollutionFactor);
    currentColor.current.lerp(target, 0.08);

    // Apply color and roughness to lung meshes
    materialsRef.current.forEach((mat) => {
      if (mat) {
        if (mat.color && typeof mat.color.copy === 'function') {
          mat.color.copy(currentColor.current);
        }
        if ('roughness' in mat) {
          mat.roughness = THREE.MathUtils.lerp(0.35, 0.95, pollutionFactor);
        }
        if (mat.emissive && typeof mat.emissive.set === 'function') {
          if (pollutionFactor > 0.6 && !isPurifying) {
            mat.emissive.set('#380e0e');
            mat.emissiveIntensity = 0.4 * pollutionFactor;
          } else {
            mat.emissive.set('#000000');
            mat.emissiveIntensity = 0;
          }
        }
      }
    });

    // Realistic Breathing Mechanics:
    // When healthy: Deep, rhythmic, elastic tidal volume
    // When attacked by high PM2.5: Rapid, shallow, spastic breathing (hypoxic struggle)
    const breathSpeed = THREE.MathUtils.lerp(1.5, 3.8, pollutionFactor);
    const breathDepth = THREE.MathUtils.lerp(0.06, 0.015, pollutionFactor);
    const breathe = Math.sin(t * breathSpeed) * breathDepth;

    // Involuntary coughing shudder at extreme pollution
    const shudder =
      pollutionFactor > 0.75
        ? (Math.random() - 0.5) * 0.008 * (Math.sin(t * 12) > 0.8 ? 1 : 0)
        : 0;

    groupRef.current.scale.set(
      baseScale + breathe + shudder,
      baseScale + breathe + shudder,
      baseScale + breathe + shudder
    );

    // Slow organic posture drift
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.25;
    groupRef.current.rotation.x = Math.cos(t * 0.15) * 0.06;
  });

  return (
    <group ref={groupRef} position={[0, -0.32, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
};

// ----------------------------------------------------------------------
// 2. Swarm of Inhaled PM2.5 / PM10 Toxic Particulate Matter
// ----------------------------------------------------------------------
const ToxicParticulateSwarm = ({ aqi, isPurifying }: { aqi: number; isPurifying: boolean }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 350;

  // Particle positions and random drift velocities
  const [positions, velocities, originalPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const orig = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Cylinder distribution simulating air funnelling towards trachea
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.25 + Math.random() * 1.5;
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.2) * 2.5;
      const z = Math.sin(angle) * radius;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;

      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = -0.015 - Math.random() * 0.03; // Inhalation downward velocity
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return [pos, vel, orig];
  }, [count]);

  const pollutionFactor = Math.min(1, Math.max(0, (aqi - 50) / 400));

  useFrame(() => {
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.attributes.position;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;

      if (isPurifying) {
        // Shockwave explosion: Push toxic particles outward away from center
        array[idx] += (array[idx] || 0.1) * 0.06;
        array[idx + 1] += (Math.random() - 0.5) * 0.04;
        array[idx + 2] += (array[idx + 2] || 0.1) * 0.06;

        if (Math.abs(array[idx]) > 6 || Math.abs(array[idx + 2]) > 6) {
          array[idx] = originalPositions[idx];
          array[idx + 1] = 2.0 + Math.random() * 0.5;
          array[idx + 2] = originalPositions[idx + 2];
        }
      } else {
        // Normal suction: Inhalation pulls particles downward and inward toward trachea (x=0, y=0.8, z=0)
        const targetX = 0;
        const targetZ = 0;

        array[idx] += (targetX - array[idx]) * 0.008 + velocities[idx];
        array[idx + 1] += velocities[idx + 1] * (0.8 + pollutionFactor * 1.5);
        array[idx + 2] += (targetZ - array[idx + 2]) * 0.008 + velocities[idx + 2];

        // Reset particles once inhaled deep past diaphragm
        if (array[idx + 1] < -2.2) {
          array[idx] = originalPositions[idx];
          array[idx + 1] = 2.4 + Math.random() * 0.6;
          array[idx + 2] = originalPositions[idx + 2];
        }
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color={isPurifying ? '#0284c7' : aqi > 200 ? '#b91c1c' : '#4b5563'}
        transparent
        opacity={isPurifying ? 0.4 : Math.min(0.85, 0.35 + pollutionFactor * 0.55)}
      />
    </points>
  );
};

// ----------------------------------------------------------------------
// 3. Shockwave Cleansing Pulse (Triggered during Purify Action)
// ----------------------------------------------------------------------
const CleansingShockwave = ({ active }: { active: boolean }) => {
  const waveRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!waveRef.current) return;
    if (active) {
      const t = state.clock.getElapsedTime();
      const scale = (t * 6) % 5;
      waveRef.current.scale.set(scale, scale, scale);
      if (waveRef.current.material) {
        (waveRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - scale / 4.5);
      }
    }
  });

  return (
    <mesh ref={waveRef} position={[0, -0.4, 0]} visible={active}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color="#ff6900"
        transparent
        opacity={0.8}
        wireframe
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Fallback Error Boundary to ensure zero page breaks under any circumstance
class CanvasErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn("Pollution 3D Canvas error caught safely:", error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-card/60 p-6 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
            <span className="text-lg">⚠</span>
          </div>
          <p className="text-xs text-muted-foreground font-mono">Biometric Atmospheric Model Active</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// ----------------------------------------------------------------------
// 4. Main 3D Canvas
// ----------------------------------------------------------------------
export const PollutionAttack3D: React.FC<Pollution3DProps> = ({
  aqi,
  isPurifying = false,
}) => {
  const pollutionFactor = Math.min(1, Math.max(0, (aqi - 50) / 400));

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <CanvasErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 4.4], fov: 40 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          style={{ background: 'transparent' }}
        >
        <Suspense fallback={null}>
          {/* Studio-quality clean lighting calibrated for offwhite frame */}
          <ambientLight intensity={1.2} />
          
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.8}
            color="#ffffff"
          />

          <directionalLight
            position={[-5, 2, -3]}
            intensity={0.8}
            color="#ffe9e3"
          />

          {/* Hazardous alert light in toxic red/orange */}
          <pointLight
            position={[0, -0.5, 3]}
            intensity={pollutionFactor * 2.5}
            color="#dc2626"
            distance={5}
          />

          <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
            {/* Morphing Biological Model */}
            <DynamicPollutedLung aqi={aqi} isPurifying={isPurifying} />

            {/* Inhaled PM2.5/PM10 Swarm */}
            <ToxicParticulateSwarm aqi={aqi} isPurifying={isPurifying} />

            {/* Cleansing Shield Shockwave */}
            <CleansingShockwave active={isPurifying} />
          </Float>

          {/* Ambient particulate dust */}
          <Sparkles
            count={Math.floor(15 + pollutionFactor * 50)}
            scale={3.5}
            size={2.2}
            speed={0.4 + pollutionFactor * 0.8}
            color={isPurifying ? '#0284c7' : pollutionFactor > 0.6 ? '#dc2626' : '#6b7280'}
          />

          <hemisphereLight args={["#ffffff", "#333333", 0.8]} />

          <OrbitControls
            enableZoom={true}
            minDistance={2.4}
            maxDistance={7.0}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.7}
            minPolarAngle={Math.PI / 2.5}
            dampingFactor={0.06}
          />
        </Suspense>
      </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
};

export default PollutionAttack3D;
