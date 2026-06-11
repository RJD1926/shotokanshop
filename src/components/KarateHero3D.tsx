import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float } from "@react-three/drei";
import * as THREE from "three";

function TorusKnot() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} scale={1.2}>
        <torusKnotGeometry args={[1, 0.3, 128, 32, 2, 3]} />
        <meshStandardMaterial
          color="#c62828"
          metalness={0.6}
          roughness={0.2}
          emissive="#8b0000"
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  );
}

function FloatingParticles() {
  const count = 50;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial color="#ff4444" emissive="#ff0000" emissiveIntensity={0.5} />
      {
        (() => {
          const dummy = new THREE.Object3D();
          for (let i = 0; i < count; i++) {
            dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
            dummy.updateMatrix();
            meshRef.current?.setMatrixAt(i, dummy.matrix);
          }
          return null;
        })()
      }
    </instancedMesh>
  );
}

function Rings() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <ringGeometry args={[2 + i * 0.8, 2.1 + i * 0.8, 64]} />
          <meshBasicMaterial color="#c62828" transparent opacity={0.3 - i * 0.08} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

export default function KarateHero3D() {
  return (
    <div className="h-[500px] w-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffcccc" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#cc0000" />
        <TorusKnot />
        <Rings />
        <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
