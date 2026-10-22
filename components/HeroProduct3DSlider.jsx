import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { useApp } from '../lib/AppContext';

export default function HeroProduct3DSlider({ products = [] }) {
  const { addToCart, setIsShowroomOpen, setStudioProduct } = useApp();

  // Curated masterwork artifacts
  const defaultItems = [
    {
      id: 'prod-1',
      title: 'Aurelius — Gilded Stallion Sculpture',
      subtitle: 'Artisanal Ascending Horse in 24K Gold Leaf & Marble Plinth',
      price: 14800,
      vastu: 'North-East (Kubera Zone)',
      badge: 'The Corner-Office Favourite',
      image: '/images/products/Elegant Horse Sculpture in Warm Interior.png',
      model3d_id: 'aurelius',
      shortName: 'Aurelius',
      description: 'Hand-cast brass finished in genuine 24K gold leaf on a honed Italian Carrara marble pedestal.',
    },
    {
      id: 'prod-4',
      title: 'Aquila — Imperial Gilded Eagle Vignette',
      subtitle: 'Vigorous Spreading Eagle on Honed Obsidian Rock Plinth',
      price: 18500,
      vastu: 'South / South-West (Solar Fame Zone)',
      badge: 'Executive Gifting Choice',
      image: '/images/products/Golden Eagle Luxe Centerpiece.png',
      model3d_id: 'eagle',
      shortName: 'Aquila',
      description: 'Monumental wingspan cast in sculpted bronze with multi-layered gold leaf gilding.',
    },
    {
      id: 'prod-2',
      title: 'Odette — Astronomical Pendulum Clock',
      subtitle: '8-Day Mechanical Escapement in Burnished Brass & Sapphire',
      price: 26500,
      vastu: 'North (Mercury Intellect Zone)',
      badge: 'Horological Provenance',
      image: '/images/products/Teal Ring with Golden Stag Sculpture.png',
      model3d_id: 'odette',
      shortName: 'Odette',
      description: 'Hand-tuned mechanical 8-day escapement pendulum movement in burnished brass with sapphire glass.',
    },
    {
      id: 'prod-5',
      title: 'Vespera — Emerald & Gold Wave Sculpture',
      subtitle: 'Harmonized Kinetic Ocean Geometry with 24K Trim',
      price: 12400,
      vastu: 'East (Indra Vitality Zone)',
      badge: 'Atelier Signature',
      image: '/images/products/Emerald and Gold Wave Sculpture.png',
      model3d_id: 'wave',
      shortName: 'Vespera',
      description: 'Fluid mathematical ribbon sculpture aligning spatial kinetic flow and serene high energy.',
    },
    {
      id: 'prod-3',
      title: 'Ascend — Sacred Geometry Obelisk',
      subtitle: 'Harmonized 9-Chakra Alignment Pillar in Antique Bronze',
      price: 9800,
      vastu: 'Brahmasthan (Universal Center)',
      badge: 'Vastu Masterpiece',
      image: '/images/products/Elegant Horse Sculpture on Pedestal.png',
      model3d_id: 'ascend',
      shortName: 'Ascend',
      description: 'Sacred geometric pyramid and floating emerald gemstone core aligning directional cosmic energy.',
    },
  ];

  const items = products.length >= 3 ? products.slice(0, 5).map((p, i) => ({
    ...p,
    shortName: p.title ? p.title.split('—')[0].trim().split(' ')[0] : `Masterwork 0${i + 1}`,
    model3d_id: p.model3d_id || (i === 1 ? 'eagle' : i === 2 ? 'odette' : i === 3 ? 'wave' : i === 4 ? 'ascend' : 'aurelius'),
  })) : defaultItems;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);

  const canvasMountRef = useRef(null);
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const [sectionTilt, setSectionTilt] = useState({ x: 0, y: 0 });
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, isHovered: false });

  const activeItem = items[currentIndex] || items[0];

  const handleSectionMouseMove = (e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const normX = (x - 0.5) * 2;
    const normY = (y - 0.5) * 2;

    setSectionTilt({
      x: normY * -3,
      y: normX * 4,
    });

    if (!cardTilt.isHovered) {
      setCardTilt((prev) => ({
        ...prev,
        x: normY * -6,
        y: normX * 8,
        glareX: Math.round(x * 100),
        glareY: Math.round(y * 100),
      }));
    }
  };

  const handleSectionMouseLeave = () => {
    setSectionTilt({ x: 0, y: 0 });
    if (!cardTilt.isHovered) {
      setCardTilt({ x: 0, y: 0, glareX: 50, glareY: 50, isHovered: false });
    }
  };

  const handleCardMouseMove = (e) => {
    e.stopPropagation();
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const normX = (x - 0.5) * 2;
    const normY = (y - 0.5) * 2;

    setCardTilt({
      x: normY * -14, // dynamic 3D pitch
      y: normX * 16,  // dynamic 3D yaw
      glareX: Math.round(x * 100),
      glareY: Math.round(y * 100),
      isHovered: true,
    });
  };

  const handleCardMouseLeave = () => {
    setCardTilt({ x: 0, y: 0, glareX: 50, glareY: 50, isHovered: false });
  };

  // Auto-advance progress slider
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = 60;
    const duration = 6500;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % items.length);
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isAutoPlay, items.length, currentIndex]);

  const handleNext = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleJump = (idx) => {
    setProgress(0);
    setCurrentIndex(idx);
  };

  // -------------------------------------------------------------
  // Full-Section Immersive 3D WebGL Canvas Engine
  // -------------------------------------------------------------
  useEffect(() => {
    if (!canvasMountRef.current) return;

    const container = canvasMountRef.current;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 700;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    // Adjusted camera distance and position for majestic full-screen framing
    camera.position.set(0, 0.95, 4.2);

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 3. Studio Illumination
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.5);
    scene.add(ambientLight);

    const keySpot = new THREE.SpotLight(0xffeedd, 5.2, 25, Math.PI / 4, 0.35, 1.2);
    keySpot.position.set(4.5, 6, 4.5);
    keySpot.castShadow = true;
    scene.add(keySpot);

    const rimGold = new THREE.DirectionalLight(0xd4af37, 3.6);
    rimGold.position.set(-5, 4, -3);
    scene.add(rimGold);

    const bottomFill = new THREE.DirectionalLight(0x1d4330, 1.2);
    bottomFill.position.set(0, -3, 2.5);
    scene.add(bottomFill);

    // 4. Museum Pedestal
    const plinthGroup = new THREE.Group();
    const plinthMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(1.65, 1.75, 0.25, 64),
      new THREE.MeshStandardMaterial({ color: 0x111c16, roughness: 0.32, metalness: 0.18 })
    );
    plinthMesh.position.y = -1.15;
    plinthMesh.receiveShadow = true;
    plinthGroup.add(plinthMesh);

    const goldRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.68, 0.03, 16, 64),
      new THREE.MeshStandardMaterial({ color: 0xc5a059, metalness: 0.95, roughness: 0.18 })
    );
    goldRing.rotation.x = Math.PI / 2;
    goldRing.position.y = -1.02;
    plinthGroup.add(goldRing);
    scene.add(plinthGroup);

    // 5. 24K Gold Leaf Masterwork Material
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xdfb15b,
      metalness: 0.9,
      roughness: 0.22,
      emissive: 0x3d2805,
      emissiveIntensity: 0.2,
    });

    // 6. Procedural 3D Sculpture Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    const modelId = activeItem.model3d_id || 'aurelius';

    if (modelId === 'odette' || activeItem.category === 'Clocks') {
      // Astronomical Pendulum Clock Model
      const outerRing = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.055, 24, 64), goldMat);
      outerRing.castShadow = true;
      modelGroup.add(outerRing);

      const centerCore = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.1, 32), goldMat);
      centerCore.rotation.x = Math.PI / 2;
      modelGroup.add(centerCore);

      for (let i = 0; i < 8; i++) {
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.85, 0.025), goldMat);
        spoke.rotation.z = (i * Math.PI) / 4;
        modelGroup.add(spoke);
      }

      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.75, 16), goldMat);
      stem.position.y = -0.55;
      modelGroup.add(stem);

      const bob = new THREE.Mesh(new THREE.SphereGeometry(0.18, 32, 32), goldMat);
      bob.scale.set(1, 1, 0.35);
      bob.position.y = -0.92;
      modelGroup.add(bob);
    } else if (modelId === 'eagle') {
      // Aquila Imperial Gilded Eagle Model
      const body = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.15, 16), goldMat);
      body.position.set(0, -0.2, 0);
      body.rotation.x = 0.25;
      body.castShadow = true;
      modelGroup.add(body);

      for (let w = -1; w <= 1; w += 2) {
        for (let f = 0; f < 6; f++) {
          const feather = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.95 - f * 0.08, 8), goldMat);
          feather.position.set(w * (0.22 + f * 0.16), 0.22 + f * 0.15, 0.05 - f * 0.03);
          feather.rotation.z = w * (-0.75 - f * 0.12);
          feather.rotation.y = w * 0.2;
          modelGroup.add(feather);
        }
      }

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 16), goldMat);
      head.position.set(0, 0.55, 0.16);
      modelGroup.add(head);

      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.28, 8), goldMat);
      beak.position.set(0, 0.48, 0.35);
      beak.rotation.x = Math.PI / 2.2;
      modelGroup.add(beak);
    } else if (modelId === 'ascend' || activeItem.category === 'Vastu Masterpieces') {
      // Ascend Sacred Geometry Obelisk Model
      const obelisk = new THREE.Mesh(new THREE.ConeGeometry(0.65, 1.8, 4), goldMat);
      obelisk.castShadow = true;
      modelGroup.add(obelisk);

      const emeraldCore = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.3, 0),
        new THREE.MeshStandardMaterial({
          color: 0x10b981,
          emissive: 0x047857,
          emissiveIntensity: 0.6,
          metalness: 0.9,
          roughness: 0.1,
        })
      );
      emeraldCore.position.y = 0.15;
      modelGroup.add(emeraldCore);

      const orbitRing = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.022, 16, 48), goldMat);
      orbitRing.rotation.x = Math.PI / 3;
      modelGroup.add(orbitRing);
    } else if (modelId === 'wave') {
      // Vespera Kinetic Wave Sculpture
      for (let i = 0; i < 9; i++) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.3 + i * 0.11, 0.03, 16, 48),
          i % 2 === 0
            ? goldMat
            : new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.85, roughness: 0.2 })
        );
        ring.rotation.x = (i * Math.PI) / 8;
        ring.rotation.y = (i * Math.PI) / 10;
        ring.position.y = -0.3 + i * 0.1;
        modelGroup.add(ring);
      }
    } else {
      // Aurelius Gilded Stallion Sculpture
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.25, -0.6, 0),
        new THREE.Vector3(-0.2, -0.1, 0.1),
        new THREE.Vector3(0.0, 0.4, 0.12),
        new THREE.Vector3(0.32, 0.7, 0.05),
        new THREE.Vector3(0.52, 0.52, -0.05),
        new THREE.Vector3(0.36, 0.32, -0.15),
      ]);
      const torso = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.2, 16, false), goldMat);
      torso.castShadow = true;
      modelGroup.add(torso);

      const head = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.6, 6), goldMat);
      head.position.set(0.48, 0.5, 0);
      head.rotation.z = -Math.PI / 3;
      modelGroup.add(head);

      for (let i = 0; i < 6; i++) {
        const mane = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.6 - i * 0.05, 0.22), goldMat);
        mane.position.set(-0.06 + i * 0.11, 0.75 - i * 0.12, -0.1);
        mane.rotation.z = -0.35 - i * 0.1;
        modelGroup.add(mane);
      }
    }

    // 7. Interactive Drag & Spin Physics
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let dragVelocity = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevX;
      const deltaY = e.clientY - prevY;

      dragVelocity = deltaX * 0.009;
      modelGroup.rotation.y += deltaX * 0.008;
      modelGroup.rotation.x += deltaY * 0.004;
      modelGroup.rotation.x = Math.max(-0.35, Math.min(0.35, modelGroup.rotation.x));

      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevX = e.touches[0].clientX;
        prevY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevX;
      modelGroup.rotation.y += deltaX * 0.01;
      prevX = e.touches[0].clientX;
    };
    const onTouchEnd = () => {
      isDragging = false;
    };

    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    dom.addEventListener('touchmove', onTouchMove, { passive: true });
    dom.addEventListener('touchend', onTouchEnd);

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 8. 60 FPS Render Loop with Levitation Physics
    let animFrame;
    let clock = new THREE.Clock();

    const render = () => {
      const elapsed = clock.getElapsedTime();

      // Smooth floating harmonic movement
      modelGroup.position.y = Math.sin(elapsed * 1.5) * 0.09;

      if (!isDragging) {
        dragVelocity *= 0.94;
        modelGroup.rotation.y += 0.006 + dragVelocity;
        modelGroup.rotation.x *= 0.96;
      }

      renderer.render(scene, camera);
      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrame);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);
      dom.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, [currentIndex, activeItem.model3d_id, activeItem.category]);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => {
        setIsAutoPlay(true);
        handleSectionMouseLeave();
      }}
      className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#FBF8F2] via-[#F5EFE4] to-[#ECE3D2] border border-[#C5A059]/35 shadow-2xl min-h-[720px] lg:min-h-[800px] flex flex-col justify-between select-none"
      style={{
        transform: `perspective(1400px) rotateX(${sectionTilt.x}deg) rotateY(${sectionTilt.y}deg)`,
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 1. Subtle Golden Radiance & Grid Atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 45%, rgba(197, 160, 89, 0.35) 0%, transparent 65%),
            radial-gradient(circle at 20% 80%, rgba(23, 54, 38, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.2) 0%, transparent 50%)`,
        }}
      />

      {/* 2. FULL-SECTION 3D WEBGL STAGE (Spans whole container, not a small box!) */}
      <div
        ref={canvasMountRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10"
        data-cursor="3d"
        data-cursor-text="DRAG 360°"
        title="Click and drag to spin 3D masterwork 360°"
      />

      {/* 3. TOP EDITORIAL BANNER & BADGES */}
      <div className="relative z-20 pt-8 px-6 sm:px-12 lg:px-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pointer-events-none">
        <div className="pointer-events-auto inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#173626]/90 border border-[#C5A059]/40 backdrop-blur-md shadow-md">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#FCF9F3]">
            {activeItem.badge || 'The Corner-Office Favourite'}
          </span>
          <span className="text-[#C5A059] opacity-60">•</span>
          <span className="text-[11px] font-semibold text-[#D4AF37]">
            {activeItem.vastu || 'Kubera Zone'}
          </span>
        </div>

        {/* 3D Drag Status Prompt */}
        <div className="pointer-events-auto hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-[#173626]/12 shadow-sm text-[11px] text-[#173626] font-semibold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[15px] text-[#C5A059] animate-spin" style={{ animationDuration: '6s' }}>360</span>
          <span>Full-Stage 3D Rotation • Drag to Inspect</span>
        </div>
      </div>

      {/* 4. MID-STAGE FLOATING EDITORIAL HEADLINE & ACTIVE PRODUCT CARD */}
      <div className="relative z-20 px-6 sm:px-12 lg:px-16 py-6 pointer-events-none flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 mt-auto mb-auto">
        {/* Left Side: Brand Philosophy & CTAs */}
        <div className="max-w-xl space-y-4 pointer-events-auto">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#0A1C13] leading-[1.12] drop-shadow-sm">
            Objects that <span className="italic font-normal underline decoration-[#C5A059]/70 underline-offset-8">hold</span> the room.
          </h1>

          <p className="text-sm sm:text-base text-[#35433B] leading-relaxed max-w-lg font-normal drop-shadow-sm">
            Sculptural décor, astronomical clocks and gilded Vastu pieces — chosen one by one for discerning homes, executive penthouses, and private estates.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link
              href="/shop"
              className="btn-primary btn-gold-sheen py-3.5 px-8 text-xs font-bold tracking-wider shadow-lg transform hover:-translate-y-0.5 transition-all"
              data-cursor="button"
            >
              <span>Explore Collection</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>

            <button
              onClick={() => setIsShowroomOpen(true)}
              className="btn-outline py-3 px-6 text-xs font-bold tracking-wider hover:bg-[#173626] hover:text-[#FCF9F3] bg-white/60 backdrop-blur-sm transition-all"
              data-cursor="button"
            >
              <span>Book Showroom Visit</span>
            </button>
          </div>
        </div>

        {/* Right Side: 3D Movement Floating Active Masterpiece Dossier Card Box */}
        <div
          ref={cardRef}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          className={`relative pointer-events-auto bg-[#0A1C13]/92 text-[#FCF9F3] border border-[#C5A059]/50 backdrop-blur-xl p-6 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65),0_0_30px_rgba(197,160,89,0.25)] max-w-sm w-full transition-all duration-200 ease-out overflow-hidden group ${
            !cardTilt.isHovered ? 'animate-float-slow' : ''
          }`}
          style={{
            transform: `perspective(900px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg) translateZ(32px) ${
              cardTilt.isHovered ? 'scale3d(1.03, 1.03, 1.03)' : 'scale3d(1, 1, 1)'
            }`,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
          data-cursor="view"
          data-cursor-text="INSPECT"
        >
          {/* Dynamic Specular Glass Glare Sheen Reflection */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-2xl"
            style={{
              background: `radial-gradient(circle at ${cardTilt.glareX}% ${cardTilt.glareY}%, rgba(212, 175, 55, 0.3) 0%, rgba(255, 255, 255, 0.12) 28%, transparent 65%)`,
              opacity: cardTilt.isHovered ? 1 : 0.35,
            }}
          />

          {/* 3D Depth Layer 1: Badge & Masterwork Index */}
          <div
            className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-[#C5A059] mb-1.5 transition-transform duration-200"
            style={{ transform: 'translateZ(18px)' }}
          >
            <span>Masterwork 0{currentIndex + 1} / 0{items.length}</span>
            <span className="bg-[#173626] px-2 py-0.5 rounded text-white border border-[#C5A059]/30 flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
              3D Interactive
            </span>
          </div>

          {/* 3D Depth Layer 2: Masterpiece Title */}
          <h2
            className="font-serif text-xl sm:text-2xl font-bold text-white mb-1 tracking-tight transition-transform duration-200 drop-shadow"
            style={{ transform: 'translateZ(26px)' }}
          >
            {activeItem.title}
          </h2>

          {/* 3D Depth Layer 3: Subtitle / Provenance */}
          <p
            className="text-xs text-[#D8E2CB]/85 line-clamp-2 mb-3 leading-relaxed transition-transform duration-200"
            style={{ transform: 'translateZ(20px)' }}
          >
            {activeItem.subtitle || activeItem.description}
          </p>

          {/* 3D Depth Layer 4: Price & CTAs */}
          <div
            className="flex items-baseline justify-between border-t border-white/10 pt-3 transition-transform duration-200"
            style={{ transform: 'translateZ(34px)' }}
          >
            <div className="font-serif text-2xl font-bold text-[#D4AF37] drop-shadow-[0_2px_10px_rgba(212,175,55,0.45)]">
              ${Number(activeItem.price).toLocaleString()}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => addToCart(activeItem, 1)}
                className="btn-gold py-1.5 px-3.5 text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-transform"
                data-cursor="button"
              >
                Acquire
              </button>
              <Link
                href={`/products/${activeItem.id}`}
                className="py-1.5 px-3 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/20 hover:border-[#C5A059]/60"
                data-cursor="button"
              >
                Dossier
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 5. FULL-WIDTH NAVIGATION CHEVRONS (Placed on outer edges of the entire section) */}
      <button
        onClick={handlePrev}
        aria-label="Previous Masterpiece"
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#0A1C13]/85 hover:bg-[#0A1C13] text-[#FCF9F3] hover:text-[#D4AF37] border border-[#C5A059]/50 flex items-center justify-center transition-all shadow-xl transform hover:scale-110 active:scale-95"
        data-cursor="button"
        title="Previous Masterpiece"
      >
        <span className="material-symbols-outlined text-2xl">chevron_left</span>
      </button>

      <button
        onClick={handleNext}
        aria-label="Next Masterpiece"
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#0A1C13]/85 hover:bg-[#0A1C13] text-[#FCF9F3] hover:text-[#D4AF37] border border-[#C5A059]/50 flex items-center justify-center transition-all shadow-xl transform hover:scale-110 active:scale-95"
        data-cursor="button"
        title="Next Masterpiece"
      >
        <span className="material-symbols-outlined text-2xl">chevron_right</span>
      </button>

      {/* 6. BOTTOM FULL-WIDTH SLIDER PROGRESS & MASTERWORK TRACK */}
      <div className="relative z-20 pb-6 px-6 sm:px-12 lg:px-16 pointer-events-auto">
        {/* Full-width Golden Progress Line */}
        <div className="w-full bg-[#173626]/20 rounded-full h-[3px] mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#FFF4C2] transition-all duration-75 shadow-[0_0_10px_#D4AF37]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Masterwork Navigation Track Pills */}
        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {items.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => handleJump(idx)}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  idx === currentIndex
                    ? 'bg-[#173626] text-[#FCF9F3] shadow-md border border-[#C5A059]'
                    : 'bg-white/70 text-[#424843] hover:bg-white hover:text-[#173626] border border-transparent'
                }`}
                data-cursor="button"
              >
                <span className="text-[#C5A059] font-mono">0{idx + 1}</span>
                <span>{item.shortName}</span>
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-[#5D6B62] uppercase tracking-widest">
            <span>24K Gilded</span>
            <span>•</span>
            <span>Directional Vastu</span>
            <span>•</span>
            <span>White-Glove Courier</span>
          </div>
        </div>
      </div>
    </section>
  );
}
