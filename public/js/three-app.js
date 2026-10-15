/* ==========================================================================
   Luxignia — 3D Interactive Three.js Renderer Engine
   (Supports Hero Canvas, Studio Modal Inspector, and Product Catalogs)
   ========================================================================== */

class Luxignia3DEngine {
  constructor() {
    this.activeStudioInstance = null;
  }

  // Create 3D Hero Scene
  initHeroCanvas(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff6e8, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.8);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.2);
    rimLight.position.set(-5, 4, -3);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xffe5b4, 1.5, 10);
    fillLight.position.set(0, -1, 3);
    scene.add(fillLight);

    // Group
    const artGroup = new THREE.Group();
    scene.add(artGroup);

    // Materials
    const marbleMaterial = new THREE.MeshPhongMaterial({ color: 0xf8f7f4, shininess: 90, specular: 0x444444 });
    const goldMaterial = new THREE.MeshPhongMaterial({ color: 0xdfb15b, emissive: 0x3d2805, shininess: 120, specular: 0xfff0aa });
    const darkGoldMaterial = new THREE.MeshPhongMaterial({ color: 0xb38634, shininess: 80, specular: 0xe8ca76 });
    const gemMaterial = new THREE.MeshPhongMaterial({ color: 0x1d5c48, shininess: 150, transparent: true, opacity: 0.9 });

    // Plinth
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.4, 0.28, 36), marbleMaterial);
    plinth.position.y = -1.4;
    plinth.receiveShadow = true;
    artGroup.add(plinth);

    const goldRing = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.035, 16, 50), goldMaterial);
    goldRing.rotation.x = Math.PI / 2;
    goldRing.position.y = -1.25;
    artGroup.add(goldRing);

    // Sculptural Horse Crest & Ribbons
    const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.45, 1.8, 20), goldMaterial);
    spine.position.set(0, -0.4, 0);
    spine.rotation.z = -0.25;
    artGroup.add(spine);

    const crest = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.9, 16), goldMaterial);
    crest.position.set(-0.35, 0.8, 0.2);
    crest.rotation.z = 0.55;
    crest.rotation.x = 0.2;
    artGroup.add(crest);

    // Mane Ribbons
    for (let i = 0; i < 7; i++) {
      const mane = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7 - i * 0.05, 0.25), i % 2 === 0 ? goldMaterial : darkGoldMaterial);
      mane.position.set(-0.1 + i * 0.12, 0.9 - i * 0.15, -0.15 - i * 0.05);
      mane.rotation.z = -0.4 - i * 0.1;
      mane.rotation.y = 0.3;
      artGroup.add(mane);
    }

    // Wings
    for (let j = 0; j < 9; j++) {
      const featherL = new THREE.Mesh(new THREE.ConeGeometry(0.09, 1.3 - j * 0.08, 8), goldMaterial);
      featherL.position.set(0.18 + j * 0.15, 0.3 + j * 0.18, 0.1 + j * 0.04);
      featherL.rotation.z = -0.75 - j * 0.12;
      artGroup.add(featherL);
    }

    // Emerald Gem Core
    const gem = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4, 1), gemMaterial);
    gem.position.set(0, 0.3, 0);
    artGroup.add(gem);

    // Drag Interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    container.addEventListener('pointerdown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const deltaMove = { x: e.clientX - previousMousePosition.x, y: e.clientY - previousMousePosition.y };
      artGroup.rotation.y += deltaMove.x * 0.008;
      artGroup.rotation.x += deltaMove.y * 0.008;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointerup', () => { isDragging = false; });

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);
      if (!isDragging) {
        artGroup.rotation.y += 0.004;
      }
      gem.rotation.y -= 0.01;
      gem.rotation.x += 0.005;
      renderer.render(scene, camera);
    }
    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  // Create Studio Modal Full 3D Inspector
  initStudioModal(containerId, modelType = 'aurelius') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfcf9f3);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfff6e8, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.5);
    keyLight.position.set(5, 7, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc5a059, 2.0);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Create 3D Artifact Mesh depending on modelType
    let mainMaterial = new THREE.MeshPhongMaterial({ color: 0xdfb15b, shininess: 120, specular: 0xfff0aa });
    const marbleMat = new THREE.MeshPhongMaterial({ color: 0xf8f7f4, shininess: 80 });

    if (modelType === 'odette') {
      // Clock escapement pendulum
      const base = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.3, 0.3, 32), marbleMat);
      base.position.y = -1.5;
      modelGroup.add(base);

      const dialRing = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.08, 16, 100), mainMaterial);
      dialRing.position.y = 0.3;
      modelGroup.add(dialRing);

      const pendulum = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 16), mainMaterial);
      pendulum.position.set(0, -0.4, 0);
      modelGroup.add(pendulum);

      const weight = new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 32), mainMaterial);
      weight.position.set(0, -1.3, 0);
      modelGroup.add(weight);
    } else if (modelType === 'ascend') {
      // Obelisk pyramid
      const base = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.3, 1.6), marbleMat);
      base.position.y = -1.5;
      modelGroup.add(base);

      const obelisk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.9, 3.2, 4), mainMaterial);
      obelisk.position.y = 0.2;
      obelisk.rotation.y = Math.PI / 4;
      modelGroup.add(obelisk);

      const coreCrystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.4),
        new THREE.MeshPhongMaterial({ color: 0x1d5c48, transparent: true, opacity: 0.9, shininess: 180 })
      );
      coreCrystal.position.y = 0.2;
      modelGroup.add(coreCrystal);
    } else {
      // Aurelius Stallion / General Sculpture
      const base = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.4, 0.28, 36), marbleMat);
      base.position.y = -1.4;
      modelGroup.add(base);

      const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.45, 2.0, 20), mainMaterial);
      spine.position.set(0, -0.3, 0);
      spine.rotation.z = -0.2;
      modelGroup.add(spine);

      const crest = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.1, 16), mainMaterial);
      crest.position.set(-0.35, 1.0, 0.2);
      crest.rotation.z = 0.55;
      modelGroup.add(crest);
    }

    // Drag interaction
    let isDragging = false;
    let autoOrbit = true;
    let prevMouse = { x: 0, y: 0 };

    container.addEventListener('pointerdown', (e) => {
      isDragging = true;
      autoOrbit = false;
      prevMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      modelGroup.rotation.y += dx * 0.01;
      modelGroup.rotation.x += dy * 0.01;
      prevMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointerup', () => { isDragging = false; });

    let animationId;
    function animateStudio() {
      animationId = requestAnimationFrame(animateStudio);
      if (autoOrbit && !isDragging) {
        modelGroup.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    }
    animateStudio();

    // Controls interface
    this.activeStudioInstance = {
      setMaterial: (hexColor) => {
        mainMaterial.color.setHex(hexColor);
      },
      setWireframe: (enabled) => {
        mainMaterial.wireframe = enabled;
      },
      toggleAutoOrbit: () => {
        autoOrbit = !autoOrbit;
        return autoOrbit;
      },
      resetView: () => {
        modelGroup.rotation.set(0, 0, 0);
        autoOrbit = true;
      },
      destroy: () => {
        cancelAnimationFrame(animationId);
        renderer.dispose();
      }
    };
  }
}

window.luxEngine = new Luxignia3DEngine();
