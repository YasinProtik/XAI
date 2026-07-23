import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { useRef, Suspense, useMemo } from "react";
import * as THREE from "three";

function Crystal({ progress }: { progress: React.MutableRefObject<number> }) {
  const mesh = useRef<THREE.Mesh>(null);
  const points = useRef<THREE.Points>(null);
  const count = 4000;

  const { pos, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c1 = new THREE.Color("#78b4ff");
    const c2 = new THREE.Color("#a78bfa");
    for (let i = 0; i < count; i++) {
      // start clustered around origin (crystal position)
      const r = Math.random() * 0.6;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(p) * Math.cos(t);
      pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      pos[i * 3 + 2] = r * Math.cos(p);
      const c = c1.clone().lerp(c2, Math.random());
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { pos, colors };
  }, []);

  // target positions form 'XAI' text via sampled points on rectangles — simplified as an outward burst
  const targets = useMemo(() => {
    const t = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 2;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      t[i * 3] = r * Math.sin(ph) * Math.cos(th);
      t[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      t[i * 3 + 2] = r * Math.cos(ph) * 0.5;
    }
    return t;
  }, []);

  useFrame((state) => {
    const p = progress.current;
    if (mesh.current) {
      const scale = Math.max(0.001, 1 - p * 1.2);
      mesh.current.scale.setScalar(scale);
      mesh.current.rotation.x = state.clock.elapsedTime * 0.3;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.4;
      (mesh.current.material as THREE.MeshStandardMaterial).opacity = Math.max(0, 1 - p * 1.5);
    }
    if (points.current) {
      const attr = points.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      const swirl = state.clock.elapsedTime * 0.5;
      for (let i = 0; i < count; i++) {
        const sx = pos[i * 3];
        const sy = pos[i * 3 + 1];
        const sz = pos[i * 3 + 2];
        const tx = targets[i * 3];
        const ty = targets[i * 3 + 1];
        const tz = targets[i * 3 + 2];
        const lx = sx + (tx - sx) * p;
        const ly = sy + (ty - sy) * p;
        const lz = sz + (tz - sz) * p;
        // swirl
        const a = swirl * (0.3 + (i % 10) * 0.05);
        arr[i * 3] = lx * Math.cos(a) - lz * Math.sin(a) * p;
        arr[i * 3 + 1] = ly;
        arr[i * 3 + 2] = lx * Math.sin(a) * p + lz * Math.cos(a);
      }
      attr.needsUpdate = true;
      points.current.rotation.z = p * Math.PI * 0.5;
    }
  });

  return (
    <>
      <mesh ref={mesh}>
        <octahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial
          color="#a78bfa"
          emissive="#4f46e5"
          emissiveIntensity={2}
          metalness={0.8}
          roughness={0.1}
          transparent
          opacity={1}
          wireframe
        />
      </mesh>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pos, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          vertexColors
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
}

export function CrystalScene({ progress }: { progress: React.MutableRefObject<number> }) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 55 }} gl={{ antialias: true, alpha: true }}>
      <fog attach="fog" args={["#060816", 6, 16]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={2} color="#a78bfa" />
      <pointLight position={[-3, -3, 3]} intensity={1.5} color="#22d3ee" />
      <Suspense fallback={null}>
        <Crystal progress={progress} />
        <Sparkles count={150} scale={[16, 12, 10]} size={2} speed={0.4} color="#a78bfa" opacity={0.5} />
      </Suspense>
    </Canvas>
  );
}
