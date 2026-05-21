'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, Points, PointMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Glitch, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { GlitchMode } from 'postprocessing';

const CHROMATIC_OFFSET = new THREE.Vector2(0.0005, 0.0005);
const GLITCH_DELAY = new THREE.Vector2(5, 15);
const GLITCH_DURATION = new THREE.Vector2(0.1, 0.2);
const GLITCH_STRENGTH = new THREE.Vector2(0.05, 0.2);

function NebulaParticles() {
  const COUNT = 3000;

  const positions = useMemo(() => {
    const p = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 20 * Math.sqrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = r * Math.cos(phi);
    }
    return p;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#e8d5a3"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function GlowingNodes() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const COUNT = 100;

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      for (let i = 0; i < COUNT; i++) {
        const x = Math.sin(time * 0.2 + i * 0.1) * 15;
        const y = Math.cos(time * 0.15 + i * 0.1) * 15;
        const z = Math.sin(time * 0.1 + i * 0.1) * 15;
        dummy.position.set(x, y, z);
        dummy.rotation.x = time + i;
        dummy.rotation.y = time * 0.5 + i;
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <octahedronGeometry args={[0.5, 0]} />
      <meshPhysicalMaterial
        color="#e8d5a3"
        emissive="#c9b070"
        emissiveIntensity={2}
        wireframe={true}
        transparent
        opacity={0.8}
      />
    </instancedMesh>
  );
}

export default function Universe3D() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full bg-[#050010]">
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} color="#c9b070" intensity={2} />

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={1} fade speed={2} />
        <NebulaParticles />
        <GlowingNodes />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.2}
          maxPolarAngle={Math.PI / 2 + 0.2}
          minPolarAngle={Math.PI / 2 - 0.2}
        />

        <EffectComposer enableNormalPass={false} multisampling={0}>
          <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} intensity={0.8} />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={CHROMATIC_OFFSET}
          />
          <Glitch
            delay={GLITCH_DELAY}
            duration={GLITCH_DURATION}
            strength={GLITCH_STRENGTH}
            mode={GlitchMode.SPORADIC}
            ratio={0.05}
          />
        </EffectComposer>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-[#050010]/20 via-transparent to-[#050010]" />
    </div>
  );
}