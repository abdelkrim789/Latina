import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';

interface Props {
  onComplete: () => void;
}

export default function IntroExperience({ onComplete }: Props) {
  const [stage, setStage] = useState<'idle' | 'opening' | 'complete'>('idle');
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 3D shoe inside box
  useEffect(() => {
    if (stage !== 'opening') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 1.5, 4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(400, 400);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 2);
    key.position.set(3, 5, 3);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xE8C4B8, 1.5);
    rim.position.set(-3, 2, -2);
    scene.add(rim);

    // Elegant heel geometry
    const group = new THREE.Group();

    // Materials - ivory and rose gold
    const ivoryMat = new THREE.MeshStandardMaterial({
      color: 0xF5F0E8,
      metalness: 0.05,
      roughness: 0.7,
    });

    const roseGoldMat = new THREE.MeshStandardMaterial({
      color: 0xE8C4B8,
      metalness: 0.95,
      roughness: 0.15,
    });

    // Sole
    const soleGeo = new THREE.CylinderGeometry(0.15, 0.18, 0.05, 64);
    const solePositions = soleGeo.attributes.position;
    for (let i = 0; i < solePositions.count; i++) {
      const z = solePositions.getZ(i);
      solePositions.setZ(i, z * 3.5);
      const t = (z * 3.5 + 0.6) / 1.2;
      const taper = t < 0.5 ? 0.7 + t * 0.6 : 1.0 - (t - 0.5) * 0.4;
      solePositions.setX(i, solePositions.getX(i) * taper);
    }
    soleGeo.computeVertexNormals();

    const sole = new THREE.Mesh(soleGeo, ivoryMat);
    group.add(sole);

    // Heel
    const heelGeo = new THREE.CylinderGeometry(0.035, 0.06, 1.0, 32);
    const heel = new THREE.Mesh(heelGeo, roseGoldMat);
    heel.position.set(0, 0.5, -0.5);
    heel.rotation.x = 0.08;
    group.add(heel);

    // Upper
    const points: THREE.Vector2[] = [];
    for (let i = 0; i <= 18; i++) {
      const t = i / 18;
      const x = 0.16 * Math.sin(t * Math.PI * 0.85) * (1 - t * 0.25);
      const y = t * 0.5;
      points.push(new THREE.Vector2(x, y));
    }
    const upperGeo = new THREE.LatheGeometry(points, 48);
    const upper = new THREE.Mesh(upperGeo, ivoryMat);
    upper.position.set(0, 0.025, 0.08);
    group.add(upper);

    // Strap
    const strapGeo = new THREE.TorusGeometry(0.14, 0.015, 16, 64, Math.PI * 1.5);
    const strap = new THREE.Mesh(strapGeo, ivoryMat);
    strap.position.set(0, 0.38, -0.08);
    strap.rotation.x = Math.PI / 2;
    group.add(strap);

    // Buckle
    const buckleGeo = new THREE.BoxGeometry(0.05, 0.035, 0.012);
    const buckle = new THREE.Mesh(buckleGeo, roseGoldMat);
    buckle.position.set(0.14, 0.38, -0.08);
    group.add(buckle);

    group.rotation.y = -0.4;
    group.rotation.x = 0.15;
    group.position.y = -0.3;
    scene.add(group);

    // Animate
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      group.rotation.y += 0.008;
      group.position.y = -0.3 + Math.sin(Date.now() * 0.001) * 0.04;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
    };
  }, [stage]);

  const handleOpen = () => {
    if (stage !== 'idle') return;
    setStage('opening');

    const tl = gsap.timeline({
      onComplete: () => {
        setStage('complete');
        setTimeout(onComplete, 800);
      }
    });

    // Glow pulse
    tl.to(glowRef.current, {
      scale: 1.3,
      opacity: 0.8,
      duration: 0.6,
      ease: 'power2.out'
    });

    // Lid opens
    tl.to(lidRef.current, {
      rotateX: -120,
      y: -80,
      z: 60,
      duration: 1.8,
      ease: 'power4.inOut'
    }, '-=0.3');

    // Box scales down and fades
    tl.to(boxRef.current, {
      scale: 0.85,
      opacity: 0.4,
      duration: 1.2,
      ease: 'power2.in'
    }, '-=1.0');

    // Fade out entire container
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut'
    }, '-=0.5');
  };

  if (stage === 'complete') return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#0A0A0A] flex items-center justify-center"
    >
      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#C9A96E] rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${8 + Math.random() * 8}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative perspective-[1200px]">
        {/* Glow */}
        <div
          ref={glowRef}
          className="absolute inset-0 -m-20 bg-[#C9A96E] opacity-0 blur-[100px] rounded-full pointer-events-none"
        />

        {/* Box container */}
        <div
          ref={boxRef}
          className="relative w-[400px] h-[280px] cursor-pointer group"
          onClick={handleOpen}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Box base */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1410] to-[#0d0805] border border-[#C9A96E]/20 shadow-2xl">
            {/* Logo embossed */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-[#C9A96E]/10 text-6xl font-serif italic tracking-[0.3em]">LATINA</div>
            </div>

            {/* 3D shoe appears when opening */}
            {stage === 'opening' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <canvas ref={canvasRef} className="w-full h-full" />
              </div>
            )}
          </div>

          {/* Lid */}
          <div
            ref={lidRef}
            className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#1a1410] to-[#0d0805] border border-[#C9A96E]/20 shadow-xl origin-bottom"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-[#C9A96E]/30 text-xs uppercase tracking-[0.5em] font-bold">Open</div>
            </div>
          </div>

          {/* Hover hint */}
          {stage === 'idle' && (
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="text-[#F5F0E8]/40 text-[10px] uppercase tracking-[0.5em] mb-2">Click to Open</div>
              <div className="w-px h-8 bg-[#C9A96E]/30 mx-auto animate-pulse" />
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-30px) translateX(10px); }
        }
      `}</style>
    </div>
  );
}
