import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { INITIAL_CAMERA, PLANET_COLORS } from './config.js';

export function createSceneRuntime(sceneRoot) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  sceneRoot.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PLANET_COLORS.background);

  const camera = new THREE.PerspectiveCamera(
    INITIAL_CAMERA.fov,
    window.innerWidth / window.innerHeight,
    INITIAL_CAMERA.near,
    INITIAL_CAMERA.far,
  );
  camera.position.set(...INITIAL_CAMERA.position);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.minDistance = 13;
  controls.maxDistance = 60;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.0;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.7;
  controls.zoomSpeed = 0.9;

  scene.add(new THREE.AmbientLight(PLANET_COLORS.ambientLight, 1.5));
  const dirLight = new THREE.DirectionalLight(PLANET_COLORS.directionalLight, 1.1);
  dirLight.position.set(18, 12, 14);
  scene.add(dirLight);

  const planetGeometry = new THREE.SphereGeometry(1, 96, 96);
  const planetBasePositions = Float32Array.from(planetGeometry.attributes.position.array);

  const planet = new THREE.Mesh(
    planetGeometry,
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x0d2230,
      roughness: 0.95,
      metalness: 0.05,
    }),
  );
  scene.add(planet);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshBasicMaterial({
      color: PLANET_COLORS.atmosphere,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    }),
  );
  scene.add(atmosphere);

  return {
    renderer,
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
