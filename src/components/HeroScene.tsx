import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Theme-aware colors
    const bgColor = theme === 'dark' ? 0x0A0A0A : 0xFAFAF9;
    const fogColor = theme === 'dark' ? 0x0A0A0A : 0xFAFAF9;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(fogColor, 8, 15);
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(bgColor, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = theme === 'dark' ? 1.4 : 1.2;
    mount.appendChild(renderer.domElement);

    // ── Lighting ──────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xF5F0E8, 0.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xF5F0E8, 2.5);
    keyLight.position.set(4, 6, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xC9A96E, 2.5);
    rimLight.position.set(-5, 3, -3);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xF5F0E8, 1.2, 25);
    fillLight.position.set(0, -1, 5);
    scene.add(fillLight);

    const accentLight = new THREE.SpotLight(0xC9A96E, 3, 15, Math.PI / 6, 0.3, 1);
    accentLight.position.set(2, 4, 2);
    accentLight.target.position.set(0, 0, 0);
    scene.add(accentLight);
    scene.add(accentLight.target);

    // ── Materials ─────────────────────────────────────────────
    // Rose gold metallic heel
    const roseGoldMat = new THREE.MeshStandardMaterial({
      color: 0xE8C4B8,
      metalness: 0.95,
      roughness: 0.12,
      envMapIntensity: 2.5,
    });

    // Cream/ivory leather upper
    const ivoryLeatherMat = new THREE.MeshStandardMaterial({
      color: 0xF5F0E8,
      metalness: 0.05,
      roughness: 0.65,
    });

    // Pearl white patent sole
    const pearlPatentMat = new THREE.MeshStandardMaterial({
      color: 0xFFFBF5,
      metalness: 0.3,
      roughness: 0.15,
    });

    // ── Build realistic women's stiletto pump ─────────────────
    const group = new THREE.Group();

    // === SOLE (bottom of shoe) ===
    const soleShape = new THREE.Shape();
    // Create shoe sole outline (side view)
    soleShape.moveTo(0, 0);
    soleShape.bezierCurveTo(0.3, 0, 0.5, 0.02, 0.7, 0.05); // toe curve
    soleShape.lineTo(0.75, 0.05); // toe tip
    soleShape.lineTo(0.7, 0); // bottom edge
    soleShape.bezierCurveTo(0.5, -0.02, 0.3, -0.02, 0, -0.02);
    soleShape.lineTo(-0.5, -0.02); // heel area
    soleShape.lineTo(-0.5, 0);
    soleShape.closePath();

    const soleExtrudeSettings = {
      steps: 1,
      depth: 0.35,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 8
    };

    const soleGeo = new THREE.ExtrudeGeometry(soleShape, soleExtrudeSettings);
    const sole = new THREE.Mesh(soleGeo, pearlPatentMat);
    sole.rotation.x = -Math.PI / 2;
    sole.position.set(0, 0.02, 0);
    sole.castShadow = true;
    sole.receiveShadow = true;
    group.add(sole);

    // === STILETTO HEEL ===
    const heelCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.3, 0),
      new THREE.Vector3(0, 0.6, 0),
      new THREE.Vector3(0, 0.9, 0.02),
    ]);

    const heelShape = new THREE.Shape();
    heelShape.absarc(0, 0, 0.025, 0, Math.PI * 2, false);

    const heelGeo = new THREE.ExtrudeGeometry(heelShape, {
      steps: 30,
      bevelEnabled: false,
      extrudePath: heelCurve
    });

    const heel = new THREE.Mesh(heelGeo, roseGoldMat);
    heel.position.set(0, 0.02, -0.45);
    heel.castShadow = true;
    group.add(heel);

    // Heel tip (rose gold cap)
    const heelTipGeo = new THREE.CylinderGeometry(0.04, 0.025, 0.04, 16);
    const heelTip = new THREE.Mesh(heelTipGeo, roseGoldMat);
    heelTip.position.set(0, 0.02, -0.45);
    heelTip.castShadow = true;
    group.add(heelTip);

    // Heel top cap
    const heelTopGeo = new THREE.CylinderGeometry(0.05, 0.04, 0.03, 16);
    const heelTop = new THREE.Mesh(heelTopGeo, roseGoldMat);
    heelTop.position.set(0, 0.92, -0.43);
    group.add(heelTop);

    // === SHOE UPPER (vamp - covers top of foot) ===
    const vampCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.05, 0.7),    // toe
      new THREE.Vector3(0, 0.08, 0.5),
      new THREE.Vector3(0, 0.12, 0.3),
      new THREE.Vector3(0, 0.18, 0.1),
      new THREE.Vector3(0, 0.25, -0.05),
      new THREE.Vector3(0, 0.35, -0.15),  // throat
    ]);

    const vampProfile = new THREE.Shape();
    // Create rounded profile for the vamp
    for (let i = 0; i <= 20; i++) {
      const angle = (i / 20) * Math.PI;
      const x = Math.sin(angle) * 0.16;
      const y = -Math.cos(angle) * 0.08;
      if (i === 0) vampProfile.moveTo(x, y);
      else vampProfile.lineTo(x, y);
    }

    const vampGeo = new THREE.ExtrudeGeometry(vampProfile, {
      steps: 40,
      bevelEnabled: false,
      extrudePath: vampCurve
    });

    const vamp = new THREE.Mesh(vampGeo, ivoryLeatherMat);
    vamp.castShadow = true;
    vamp.receiveShadow = true;
    group.add(vamp);

    // === HEEL COUNTER (back of shoe) ===
    const counterGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.35, 32, 1, true, 0, Math.PI);
    const counter = new THREE.Mesh(counterGeo, ivoryLeatherMat);
    counter.position.set(0, 0.2, -0.25);
    counter.rotation.y = Math.PI;
    counter.castShadow = true;
    group.add(counter);

    // === ANKLE STRAP ===
    const strapGeo = new THREE.TorusGeometry(0.145, 0.014, 16, 48, Math.PI * 1.4);
    const strap = new THREE.Mesh(strapGeo, ivoryLeatherMat);
    strap.position.set(0, 0.38, -0.15);
    strap.rotation.x = Math.PI / 2;
    strap.rotation.z = -Math.PI * 0.2;
    strap.castShadow = true;
    group.add(strap);

    // Strap buckle (rose gold)
    const buckleGeo = new THREE.BoxGeometry(0.05, 0.035, 0.012);
    const buckle = new THREE.Mesh(buckleGeo, roseGoldMat);
    buckle.position.set(0.14, 0.38, -0.15);
    buckle.castShadow = true;
    group.add(buckle);

    // Small buckle pin
    const pinGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.025, 8);
    const pin = new THREE.Mesh(pinGeo, roseGoldMat);
    pin.position.set(0.14, 0.38, -0.15);
    pin.rotation.z = Math.PI / 2;
    group.add(pin);

    // === TOE BOX ACCENT (rose gold trim) ===
    const toeAccentGeo = new THREE.TorusGeometry(0.12, 0.006, 12, 32, Math.PI);
    const toeAccent = new THREE.Mesh(toeAccentGeo, roseGoldMat);
    toeAccent.position.set(0, 0.08, 0.6);
    toeAccent.rotation.x = Math.PI / 2;
    toeAccent.rotation.y = Math.PI / 2;
    group.add(toeAccent);

    // === INSOLE (visible inside) ===
    const insoleGeo = new THREE.PlaneGeometry(0.3, 0.8);
    const insoleMat = new THREE.MeshStandardMaterial({
      color: 0xF5E6D3,
      side: THREE.DoubleSide,
      roughness: 0.8,
    });
    const insole = new THREE.Mesh(insoleGeo, insoleMat);
    insole.rotation.x = -Math.PI / 2;
    insole.position.set(0, 0.04, 0.1);
    group.add(insole);

    // ── Floating particles ────────────────────────────────────
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xE8C4B8, // Rose gold particles
      size: 0.018,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── Reflective ground plane ───────────────────────────────
    const groundGeo = new THREE.PlaneGeometry(10, 10);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      metalness: 0.3,
      roughness: 0.8,
      transparent: true,
      opacity: 0.4,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.03;
    ground.receiveShadow = true;
    scene.add(ground);

    // Position the shoe group
    group.rotation.y = -0.3;
    group.rotation.x = 0.08;
    group.rotation.z = 0.05;
    group.position.set(0.1, -0.2, 0);
    group.scale.setScalar(1.1);
    scene.add(group);

    // ── Mouse tracking ────────────────────────────────────────
    let targetRotY = -0.25;
    let targetRotX = 0.12;
    let currentRotY = -0.25;
    let currentRotX = 0.12;

    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      targetRotY = -0.3 + nx * 0.35;
      targetRotX = 0.08 - ny * 0.18;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Animation loop ────────────────────────────────────────
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse follow with easing
      currentRotY += (targetRotY - currentRotY) * 0.035;
      currentRotX += (targetRotX - currentRotX) * 0.035;
      group.rotation.y = currentRotY;
      group.rotation.x = currentRotX;

      // Gentle float with breathing effect
      group.position.y = -0.2 + Math.sin(elapsed * 0.7) * 0.08;
      const breathScale = 1.1 + Math.sin(elapsed * 0.9) * 0.012;
      group.scale.setScalar(breathScale);

      // Particles drift and rotate
      particles.rotation.y = elapsed * 0.03;
      particles.rotation.x = Math.sin(elapsed * 0.5) * 0.1;

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize handler ────────────────────────────────────────
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return <div ref={mountRef} className="w-full h-full" />;
}
