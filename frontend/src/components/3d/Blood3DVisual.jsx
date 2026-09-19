import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Blood3DVisual = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check user prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene Setup
    const scene = new THREE.Scene();

    // Camera
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 12;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // Group to hold all 3D blood elements
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Blood-Cell Shaped Torus / Disk Geometry (Biconcave disc simulation)
    const cellGroup = new THREE.Group();
    
    // Create primary erythrocyte shape (flattened torus)
    const cellGeo = new THREE.TorusGeometry(2.2, 0.9, 32, 64);
    const cellMat = new THREE.MeshPhysicalMaterial({
      color: 0xE52521,
      emissive: 0x991B1B,
      emissiveIntensity: 0.35,
      roughness: 0.25,
      metalness: 0.15,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      transmission: 0.3,
      opacity: 0.92,
      transparent: true,
      reflectivity: 0.9,
    });

    const mainCell = new THREE.Mesh(cellGeo, cellMat);
    mainCell.scale.set(1, 1, 0.35); // Flatten to create biconcave blood cell disc look
    cellGroup.add(mainCell);

    // Secondary smaller floating blood cells
    const miniCells = [];
    const miniGeo = new THREE.TorusGeometry(0.7, 0.3, 24, 32);
    const positions = [
      { x: -3.2, y: 2.1, z: -1.5, rotX: 0.4, rotY: 0.8 },
      { x: 3.5, y: -1.8, z: 1.2, rotX: 0.9, rotY: 0.3 },
      { x: -2.8, y: -2.4, z: -0.5, rotX: 0.2, rotY: 1.1 },
      { x: 2.6, y: 2.6, z: -2.0, rotX: 0.7, rotY: 0.5 },
    ];

    positions.forEach((pos) => {
      const miniMat = cellMat.clone();
      miniMat.emissiveIntensity = 0.25;
      const miniCell = new THREE.Mesh(miniGeo, miniMat);
      miniCell.scale.set(0.9, 0.9, 0.3);
      miniCell.position.set(pos.x, pos.y, pos.z);
      miniCell.rotation.set(pos.rotX, pos.rotY, 0);
      cellGroup.add(miniCell);
      miniCells.push({ mesh: miniCell, speed: 0.005 + Math.random() * 0.005, offset: Math.random() * Math.PI * 2 });
    });

    mainGroup.add(cellGroup);

    // 2. Floating Crimson Micro-Particles Field
    const particleCount = window.innerWidth < 768 ? 60 : 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 16;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      particleScales[i] = Math.random() * 0.12 + 0.04;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xEF4444,
      size: 0.18,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // 3. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.8);
    mainLight.position.set(5, 8, 5);
    scene.add(mainLight);

    const redGlowLight = new THREE.PointLight(0xE52521, 3.5, 15);
    redGlowLight.position.set(0, 0, 2);
    scene.add(redGlowLight);

    const backLight = new THREE.DirectionalLight(0x38BDF8, 0.8);
    backLight.position.set(-5, -5, -5);
    scene.add(backLight);

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      targetX = (x / rect.width) * 0.8;
      targetY = (y / rect.height) * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Smooth rotation
        cellGroup.rotation.y = elapsedTime * 0.25;
        cellGroup.rotation.x = Math.sin(elapsedTime * 0.15) * 0.15;

        // Floating Y-axis sinusoidal motion
        mainCell.position.y = Math.sin(elapsedTime * 0.8) * 0.2;

        // Animate mini floating cells
        miniCells.forEach((c) => {
          c.mesh.position.y += Math.sin(elapsedTime * 1.2 + c.offset) * 0.003;
          c.mesh.rotation.x += c.speed;
          c.mesh.rotation.z += c.speed * 0.5;
        });

        // Rotate particle field
        particles.rotation.y = elapsedTime * 0.05;

        // Smooth mouse parallax interpolation
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        mainGroup.rotation.y = mouseX * 0.6;
        mainGroup.rotation.x = -mouseY * 0.6;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      cellGeo.dispose();
      cellMat.dispose();
      miniGeo.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[450px] lg:h-[520px] flex items-center justify-center">
      {/* Soft Ambient Red Glow Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/20 via-red-500/10 to-transparent rounded-full blur-3xl pointer-events-none transform scale-90"></div>
      
      {/* WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full relative z-10 cursor-grab active:cursor-grabbing" />
    </div>
  );
};

export default Blood3DVisual;
