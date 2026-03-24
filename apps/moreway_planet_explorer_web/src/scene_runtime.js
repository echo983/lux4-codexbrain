import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { INITIAL_CAMERA, PLANET_COLORS, BLOOM_PARAMS } from './config.js';

export function createSceneRuntime(sceneRoot) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  sceneRoot.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000103); // Near black space

  const camera = new THREE.PerspectiveCamera(
    INITIAL_CAMERA.fov,
    window.innerWidth / window.innerHeight,
    INITIAL_CAMERA.near,
    INITIAL_CAMERA.far,
  );
  camera.position.set(
    INITIAL_CAMERA.position[0],
    INITIAL_CAMERA.position[1],
    INITIAL_CAMERA.position[2]
  );

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.minDistance = 11;
  controls.maxDistance = 60;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.0;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.7;
  controls.zoomSpeed = 0.9;

  scene.add(new THREE.AmbientLight(0x112233, 0.1)); // Very weak ambient
  const dirLight = new THREE.DirectionalLight(0xffffff, 2.5); // Very strong sun
  dirLight.position.set(18, 12, 14);
  scene.add(dirLight);

  const planetGeometry = new THREE.SphereGeometry(1, 128, 128);
  const planetBasePositions = Float32Array.from(planetGeometry.attributes.position.array);

  const planet = new THREE.Mesh(
    planetGeometry,
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      metalness: 0.1,
    }),
  );
  scene.add(planet);

  // Advanced Atmosphere Shell (Rayleigh Scattering look)
  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        glowColor: { value: new THREE.Color(0.2, 0.5, 1.0) }, // Earth blue
        p: { value: 4.5 }, // Sharpness
        c: { value: 0.25 }, // Thickness
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float c;
        uniform float p;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(max(0.0, c - dot(vNormal, vec3(0.0, 0.0, 1.0))), p);
          gl_FragColor = vec4(glowColor, intensity);
        }
      `,
    }),
  );
  scene.add(atmosphere);

  // Post-processing
  const renderPass = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    BLOOM_PARAMS.strength,
    BLOOM_PARAMS.radius,
    BLOOM_PARAMS.threshold,
  );
  const outputPass = new OutputPass();

  const composer = new EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(bloomPass);
  composer.addPass(outputPass);

  return {
    renderer,
    composer,
    scene,
    camera,
    controls,
    planet,
    atmosphere,
    planetBasePositions,
  };
}

export function updatePlanetScale(planet, atmosphere, planetRadius) {
  planet.scale.setScalar(planetRadius);
  atmosphere.scale.setScalar(planetRadius + 0.45);
}

export function updateControlBounds(camera, controls, planetRadius, pointRadius) {
  const nearestSurface = Math.max(pointRadius, planetRadius + 0.08);
  controls.minDistance = nearestSurface + 0.9;

  const verticalHalfFov = THREE.MathUtils.degToRad(camera.fov * 0.5);
  const horizontalHalfFov = Math.atan(Math.tan(verticalHalfFov) * camera.aspect);
  const limitingHalfFov = Math.min(verticalHalfFov, horizontalHalfFov);
  const requiredDistance = nearestSurface / Math.sin(Math.max(limitingHalfFov, 0.01));
  controls.maxDistance = Math.max(requiredDistance * 1.08, controls.minDistance + 6);

  if (controls.getDistance() < controls.minDistance) {
    const dir = camera.position.clone().normalize();
    camera.position.copy(dir.multiplyScalar(controls.minDistance));
  } else if (controls.getDistance() > controls.maxDistance) {
    const dir = camera.position.clone().normalize();
    camera.position.copy(dir.multiplyScalar(controls.maxDistance));
  }
  controls.update();
}

export function updateControlResponsiveness(controls, pointMeshes, basePointSize) {
  const distance = controls.getDistance();
  const span = Math.max(controls.maxDistance - controls.minDistance, 0.001);
  const normalized = THREE.MathUtils.clamp((distance - controls.minDistance) / span, 0, 1);
  const eased = normalized * normalized * (3 - 2 * normalized);
  controls.rotateSpeed = THREE.MathUtils.lerp(0.14, 0.72, eased);
  controls.zoomSpeed = THREE.MathUtils.lerp(0.55, 1.0, eased);
  controls.dampingFactor = THREE.MathUtils.lerp(0.12, 0.07, eased);
  const pointSizeScale = THREE.MathUtils.lerp(0.72, 2.35, Math.pow(eased, 0.85));
  for (const mesh of pointMeshes) {
    if (mesh?.material) {
      mesh.material.size = basePointSize * pointSizeScale;
    }
  }
}
