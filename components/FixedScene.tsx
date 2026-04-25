'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const values = new Float32Array(1200);
    for (let i = 0; i < 1200; i += 3) {
      values[i] = (Math.random() - 0.5) * 18;
      values[i + 1] = (Math.random() - 0.5) * 14;
      values[i + 2] = (Math.random() - 0.5) * 12;
    }
    return values;
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
      pointsRef.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled>
      <PointMaterial color="#C4435A" size={0.03} sizeAttenuation transparent opacity={0.35} depthWrite={false} />
    </Points>
  );
}

export function FixedScene() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-screen w-screen">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight color="#B87A5A" intensity={0.3} />
        <pointLight color="#C4435A" position={[2, 3, 4]} intensity={1.2} />
        <hemisphereLight color="#1E1428" groundColor="#0D0B10" intensity={0.5} />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}
