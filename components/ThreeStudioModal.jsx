import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useApp } from '../lib/AppContext';

export default function ThreeStudioModal() {
  const { studioProduct, setStudioProduct } = useApp();
  const mountRef = useRef(null);
  const [materialType, setMaterialType] = useState('gold'); // 'gold' | 'bronze' | 'marble'
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    if (!studioProduct || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e1f16); // Deep rich emerald studio darkness
    scene.fog = new THREE.FogExp2(0x0e1f16, 0.035);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 4.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(0xfff7e8, 1.2);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.SpotLight(0xfff2cc, 5.0, 20, Math.PI / 4, 0.4, 1.2);
    mainKeyLight.position.set(4, 5, 4);
    mainKeyLight.castShadow = true;
    scene.add(mainKeyLight);

    const rimGoldLight = new THREE.DirectionalLight(0xd4af37, 3.5);
    rimGoldLight.position.set(-4, 3, -3);
    scene.add(rimGoldLight);

    const bottomFillLight = new THREE.DirectionalLight(0x386641, 1.5);
    bottomFillLight.position.set(0, -3, 2);
    scene.add(bottomFillLight);

    // Studio Pedestal / Plinth
    const plinthGeo = new THREE.CylinderGeometry(1.6, 1.7, 0.25, 64);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x1a211e,
      roughness: 0.35,
      metalness: 0.1,
    });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.y = -0.95;
    plinth.receiveShadow = true;
    scene.add(plinth);

    // Gold Trim Ring around plinth
    const ringGeo = new THREE.TorusGeometry(1.62, 0.02, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xc5a059,
      metalness: 0.95,
      roughness: 0.2,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.82;
    scene.add(ring);

    // Root model group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Materials definition
    const getMaterial = (type) => {
      if (type === 'gold') {
        return new THREE.MeshStandardMaterial({
          color: 0xefc050,
          metalness: 0.88,
          roughness: 0.22,
          envMapIntensity: 1.5,
        });
      }
      if (type === 'bronze') {
        return new THREE.MeshStandardMaterial({
          color: 0x8a5d3b,
          metalness: 0.75,
          roughness: 0.35,
        });
      }
      return new THREE.MeshStandardMaterial({
        color: 0xf5f3ee,
        metalness: 0.05,
        roughness: 0.4,
      });
    };

    let activeMat = getMaterial(materialType);

    // Build procedural 3D sculpture representation based on model3d_id or title
    const modelType = studioProduct.model3d_id || 'aurelius';

    if (modelType === 'odette' || studioProduct.category === 'Clocks') {
      // Clock Ring Escapement & Pendulum
      const outerRing = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.06, 24, 64), activeMat);
      outerRing.castShadow = true;
      modelGroup.add(outerRing);

      const centerHub = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32), activeMat);
      centerHub.rotation.x = Math.PI / 2;
      modelGroup.add(centerHub);

      // Radial spokes
      for (let i = 0; i < 8; i++) {
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.85, 0.025), activeMat);
        spoke.rotation.z = (i * Math.PI) / 4;
        modelGroup.add(spoke);
      }

      // Pendulum Bob
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.75, 16), activeMat);
      stem.position.y = -0.55;
      modelGroup.add(stem);

      const bob = new THREE.Mesh(new THREE.SphereGeometry(0.18, 32, 32), activeMat);
      bob.scale.set(1, 1, 0.4);
      bob.position.y = -0.92;
      modelGroup.add(bob);
    } else if (modelType === 'ascend' || studioProduct.category === 'Vastu Masterpieces') {
      // Celestial Sacred Geometry Obelisk
      const obeliskGeo = new THREE.ConeGeometry(0.65, 1.8, 4);
      const obelisk = new THREE.Mesh(obeliskGeo, activeMat);
      obelisk.castShadow = true;
      modelGroup.add(obelisk);

      // Embedded Emerald Core
      const coreGeo = new THREE.OctahedronGeometry(0.3, 0);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 0.4,
        roughness: 0.1,
        metalness: 0.9,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.y = 0.2;
      modelGroup.add(core);

      // Concentric orbiting rings
      const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.02, 16, 48), activeMat);
      innerRing.rotation.x = Math.PI / 3;
      modelGroup.add(innerRing);
    } else {
      // Aurelius — Gilded Stallion Monumental Torso
      // Stylized majestic equestrian arch curve
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.3, -0.6, 0),
        new THREE.Vector3(-0.25, -0.1, 0.1),
        new THREE.Vector3(0.0, 0.4, 0.15),
        new THREE.Vector3(0.35, 0.7, 0.05),
        new THREE.Vector3(0.55, 0.55, -0.05),
        new THREE.Vector3(0.4, 0.35, -0.15),
      ]);
      const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.2, 16, false);
      const torso = new THREE.Mesh(tubeGeo, activeMat);
      torso.castShadow = true;
      modelGroup.add(torso);

      // Head facet
      const headGeo = new THREE.ConeGeometry(0.24, 0.6, 6);
      const head = new THREE.Mesh(headGeo, activeMat);
      head.position.set(0.48, 0.5, 0);
      head.rotation.z = -Math.PI / 3;
      modelGroup.add(head);

      // Sweeping mane fin
      const maneGeo = new THREE.TorusGeometry(0.5, 0.05, 16, 32, Math.PI);
      const mane = new THREE.Mesh(maneGeo, activeMat);
      mane.position.set(0.05, 0.45, 0);
      mane.rotation.z = -Math.PI / 4;
      modelGroup.add(mane);
    }

    // Interactive Drag Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      modelGroup.rotation.y += deltaX * 0.008;
      modelGroup.rotation.x += deltaY * 0.004;
      modelGroup.rotation.x = Math.max(-0.4, Math.min(0.4, modelGroup.rotation.x));

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support for mobile
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      modelGroup.rotation.y += deltaX * 0.01;
      prevMouseX = e.touches[0].clientX;
    };
    const onTouchEnd = () => {
      isDragging = false;
    };

    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (isRotating && !isDragging) {
        modelGroup.rotation.y += 0.006;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [studioProduct, materialType, isRotating]);

  if (!studioProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md">
      <div className="relative w-full h-full max-w-6xl max-h-[92vh] m-4 bg-[#0A1C13] rounded-3xl border border-[#C5A059]/40 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="p-6 bg-[#07130D]/90 border-b border-[#C5A059]/30 flex items-center justify-between text-[#FCF9F3]">
          <div className="flex items-center gap-3">
            <span className="badge-gold">
              <span className="material-symbols-outlined text-xs">view_in_ar</span>
              <span>3D Studio Inspector</span>
            </span>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#FCF9F3]">
                {studioProduct.title}
              </h3>
              <p className="text-xs text-[#C5A059] font-medium">{studioProduct.subtitle}</p>
            </div>
          </div>

          <button
            onClick={() => setStudioProduct(null)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#FCF9F3] hover:text-[#D4AF37] transition-colors"
            title="Exit 3D Studio"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* 3D Canvas Area */}
        <div className="relative flex-1 w-full min-h-[450px]">
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Floating Instructions */}
          <div className="absolute top-4 left-6 pointer-events-none">
            <span className="bg-[#0A1C13]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#C5A059]/30 text-[11px] font-bold text-[#FCF9F3] tracking-wider uppercase flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#D4AF37]">360</span>
              <span>Drag to rotate • 360° Studio Lighting</span>
            </span>
          </div>

          {/* Bottom Floating Controls */}
          <div className="absolute bottom-6 inset-x-0 flex flex-wrap items-center justify-center gap-4 px-6 pointer-events-auto">
            {/* Material Finishes */}
            <div className="flex items-center gap-2 bg-[#07130D]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-[#C5A059]/30 shadow-lg">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#C5A059] mr-1">
                Finish:
              </span>
              <button
                onClick={() => setMaterialType('gold')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  materialType === 'gold'
                    ? 'bg-[#C5A059] text-[#0A1C13] shadow'
                    : 'text-[#FCF9F3] hover:text-[#D4AF37]'
                }`}
              >
                24K Antiqued Gold
              </button>
              <button
                onClick={() => setMaterialType('bronze')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  materialType === 'bronze'
                    ? 'bg-[#8a5d3b] text-white shadow'
                    : 'text-[#FCF9F3] hover:text-[#D4AF37]'
                }`}
              >
                Burnished Bronze
              </button>
              <button
                onClick={() => setMaterialType('marble')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  materialType === 'marble'
                    ? 'bg-white text-[#0A1C13] shadow'
                    : 'text-[#FCF9F3] hover:text-[#D4AF37]'
                }`}
              >
                Carrara Plaster
              </button>
            </div>

            {/* Orbit / Auto Rotate Toggle */}
            <div className="flex items-center gap-2 bg-[#07130D]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-[#C5A059]/30 shadow-lg">
              <button
                onClick={() => setIsRotating(!isRotating)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#FCF9F3] hover:text-[#D4AF37]"
              >
                <span className="material-symbols-outlined text-base">
                  {isRotating ? 'pause_circle' : 'play_circle'}
                </span>
                <span>{isRotating ? 'Pause Orbit' : 'Auto Orbit'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
