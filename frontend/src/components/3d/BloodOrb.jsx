import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BloodOrb = ({ className = '' }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Check reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 120;
    const height = container.clientHeight || 120;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Geometry: Sphere
    const geometry = new THREE.SphereGeometry(1.2, 32, 32);
    
    // Physical Material (Translucent glowing crimson sphere)
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#e52521'),
      emissive: new THREE.Color('#991b1b'),
      emissiveIntensity: 0.5,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.6,
      opacity: 0.9,
      transparent: true,
    });

    const orb = new THREE.Mesh(geometry, material);
    scene.add(orb);

    // Inner glowing core
    const coreGeo = new THREE.SphereGeometry(0.7, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#ff4d4d'),
      transparent: true,
      opacity: 0.8,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Ambient & Point Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff4d4d, 3, 10);
    pointLight.position.set(2, 2, 3);
    scene.add(pointLight);

    // Floating Animation loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Floating oscillation
      orb.position.y = Math.sin(elapsedTime * 1.5) * 0.15;
      core.position.y = orb.position.y;

      // Slow rotation
      orb.rotation.y = elapsedTime * 0.4;
      orb.rotation.x = elapsedTime * 0.2;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 120;
      const h = container.clientHeight || 120;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`w-28 h-28 sm:w-32 sm:h-32 pointer-events-none relative ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-red-600/20 rounded-full blur-xl pointer-events-none animate-pulse"></div>
    </div>
  );
};

export default BloodOrb;
