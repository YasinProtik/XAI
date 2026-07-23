import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Sparkles } from "@react-three/drei";
import { useMemo, useRef, Suspense } from "react";
import * as THREE from "three";

function AICore({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const inst = useRef<THREE.InstancedMesh>(null);
  const count = 900;

  const { positions, speeds, radii } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const radii = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 1.6 + Math.random() * 2.2;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(p) * Math.cos(t);
      positions[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      positions[i * 3 + 2] = r * Math.cos(p);
      speeds[i] = 0.2 + Math.random() * 0.8;
      radii[i] = r;
    }
    return { positions, speeds, radii };
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y += delta * 0.08;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, mouse.current.y * 0.3, 0.04);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, mouse.current.x * 0.2, 0.04);
    }
    if (core.current) {
      const s = 1 + Math.sin(t * 1.4) * 0.04;
      core.current.scale.setScalar(s);
    }
    if (inst.current) {
      for (let i = 0; i < count; i++) {
        const sp = speeds[i];
        const r = radii[i];
        const angle = t * sp * 0.3;
        const x = positions[i * 3];
        const y = positions[i * 3 + 1];
        const z = positions[i * 3 + 2];
        // rotate around y
        const cx = x * Math.cos(angle) - z * Math.sin(angle);
        const cz = x * Math.sin(angle) + z * Math.cos(angle);
        dummy.position.set(cx, y + Math.sin(t + i) * 0.05, cz);
        const scale = 0.015 + (r < 2 ? 0.02 : 0.008);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        inst.current.setMatrixAt(i, dummy.matrix);
      }
      inst.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={group}>
      {/* Core sphere */}
      <mesh ref={core}>
        <icosahedronGeometry args={[0.9, 4]} />
        <meshStandardMaterial
          color="#78b4ff"
          emissive="#3a6bff"
          emissiveIntensity={1.5}
          roughness={0.2}
          metalness={0.4}
          wireframe
        />
      </mesh>
      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.35} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Orbiting particles */}
      <instancedMesh ref={inst} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#9fd2ff" blending={THREE.AdditiveBlending} transparent opacity={0.9} />
      </instancedMesh>
      {/* Connection rings */}
      {[1.8, 2.4, 3.0].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.4, i * 0.3, 0]}>
          <torusGeometry args={[r, 0.003, 16, 128]} />
          <meshBasicMaterial color={i % 2 ? "#a78bfa" : "#22d3ee"} transparent opacity={0.5} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

function FloatingGeo() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = clock.elapsedTime * 0.05;
  });
  const shapes = useMemo(
    () =>
      new Array(14).fill(0).map((_, i) => ({
        pos: [(Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6] as [number, number, number],
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
        type: i % 3,
        scale: 0.1 + Math.random() * 0.15,
      })),
    [],
  );
  return (
    <group ref={group}>
      {shapes.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot} scale={s.scale}>
          {s.type === 0 ? (
            <boxGeometry args={[1, 1, 1]} />
          ) : s.type === 1 ? (
            <octahedronGeometry args={[1, 0]} />
          ) : (
            <tetrahedronGeometry args={[1, 0]} />
          )}
          <meshStandardMaterial color="#8ab4ff" emissive="#2a4d9f" emissiveIntensity={0.4} wireframe />
        </mesh>
      ))}
    </group>
  );
}

function Rig({ mouse, scrollProgress }: { mouse: React.MutableRefObject<{ x: number; y: number }>; scrollProgress: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  useFrame(() => {
    const p = scrollProgress.current;
    const zoom = 6 - p * 4;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.current.x * 0.6, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.current.y * 0.4, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, zoom, 0.05);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function HeroScene({
  mouse,
  scrollProgress,
}: {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  scrollProgress: React.MutableRefObject<number>;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={55} />
      <fog attach="fog" args={["#060816", 5, 14]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 3, 5]} intensity={2} color="#78b4ff" />
      <pointLight position={[-5, -3, -5]} intensity={1.5} color="#a78bfa" />
      <pointLight position={[0, 0, 3]} intensity={1} color="#22d3ee" />
      <Suspense fallback={null}>
        <AICore mouse={mouse} />
        <FloatingGeo />
        <Sparkles count={200} scale={[14, 10, 8]} size={2} speed={0.3} color="#9fd2ff" opacity={0.6} />
        <Sparkles count={100} scale={[20, 14, 10]} size={1} speed={0.15} color="#a78bfa" opacity={0.4} />
      </Suspense>
      <Rig mouse={mouse} scrollProgress={scrollProgress} />
    </Canvas>
  );
}
