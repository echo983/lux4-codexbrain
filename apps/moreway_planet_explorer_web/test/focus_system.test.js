import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';

import { createFocusSystem } from '../src/focus_system.js';

function makeFakeElement() {
  return {
    style: {},
    textContent: '',
    className: '',
    offsetWidth: 120,
    offsetHeight: 26,
    classList: {
      toggle() {},
    },
  };
}

function makeFakeCanvas() {
  return {
    width: 0,
    height: 0,
    getContext() {
      return {
        clearRect() {},
        beginPath() {},
        moveTo() {},
        lineTo() {},
        stroke() {},
        fillRect() {},
        set strokeStyle(_value) {},
        set lineWidth(_value) {},
        set lineCap(_value) {},
        set fillStyle(_value) {},
        createRadialGradient() {
          return {
            addColorStop() {},
          };
        },
      };
    },
  };
}

function makeFocusSystemHarness() {
  const appended = [];
  const originalDocument = global.document;
  global.document = {
    createElement(tagName) {
      if (tagName === 'canvas') {
        return makeFakeCanvas();
      }
      return makeFakeElement();
    },
  };

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1000 / 800, 0.1, 500);
  camera.position.set(0, 0, 20);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();

  const controls = {
    minDistance: 10,
    maxDistance: 60,
    getDistance() {
      return camera.position.length();
    },
  };

  const renderer = {
    domElement: {
      getBoundingClientRect() {
        return { left: 0, top: 0, width: 1000, height: 800 };
      },
    },
  };

  const overlayLayerEl = {
    appendChild(el) {
      appended.push(el);
    },
  };

  const focusRegionBoxEl = {
    getBoundingClientRect() {
      return { left: 0, top: 0, right: 1000, bottom: 800 };
    },
  };

  const planet = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 8), new THREE.MeshBasicMaterial());
  planet.scale.setScalar(10);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute([
      0, 0, 11,
      10, 0, 1,
    ], 3),
  );
  const mesh = new THREE.Points(geometry, new THREE.PointsMaterial());
  mesh.userData.payloads = [
    { doc_id: 'visible', title: 'Visible Point' },
    { doc_id: 'occluded', title: 'Occluded Point' },
  ];

  const focusSystem = createFocusSystem({
    scene,
    camera,
    controls,
    renderer,
    overlayLayerEl,
    focusRegionBoxEl,
    pointMeshes: [mesh],
    starTexture: new THREE.Texture(),
    planet,
    basePointSize: 0.08,
    getSelectedPayload: () => null,
    onResultsChanged() {},
  });

  return {
    focusSystem,
    appended,
    restore() {
      global.document = originalDocument;
    },
  };
}

test('focus system excludes points occluded by planet body', () => {
  const harness = makeFocusSystemHarness();
  try {
    harness.focusSystem.updateFocusResults();
    const results = harness.focusSystem.getFocusResults();
    assert.equal(results.length, 1);
    assert.equal(results[0].payload.doc_id, 'visible');
  } finally {
    harness.restore();
  }
});

test('focus labels apply positive top offset into DOM position', () => {
  const harness = makeFocusSystemHarness();
  try {
    harness.focusSystem.updateFocusResults();
    harness.focusSystem.updateFocusLabels();
    const label = harness.appended[0];
    assert.equal(label.style.display, 'block');
    const top = Number.parseFloat(label.style.top);
    assert(Number.isFinite(top));
    assert(top > 400);
  } finally {
    harness.restore();
  }
});
