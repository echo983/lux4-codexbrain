import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';

import { applyPlanetSurfaceRelief, sampleSurfaceValueBilinear } from '../src/planet_surface.js';

test('sampleSurfaceValueBilinear interpolates and wraps longitude', () => {
  const surfaceMap = {
    lon_steps: 2,
    lat_steps: 2,
    values: [
      0, 100,
      200, 255,
    ],
  };
  const centered = sampleSurfaceValueBilinear(surfaceMap, 0.25, 0.5);
  assert(centered > 90 && centered < 180);

  const wrappedA = sampleSurfaceValueBilinear(surfaceMap, -0.1, 0.3);
  const wrappedB = sampleSurfaceValueBilinear(surfaceMap, 0.9, 0.3);
  assert.equal(Math.round(wrappedA), Math.round(wrappedB));
});

test('applyPlanetSurfaceRelief adjusts geometry positions', () => {
  const geometry = new THREE.SphereGeometry(1, 8, 8);
  const positions = geometry.attributes.position.array.slice();
  const planet = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
  const surfaceMap = {
    lon_steps: 4,
    lat_steps: 4,
    land_threshold: 120,
    values: new Array(16).fill(200),
  };

  applyPlanetSurfaceRelief(planet, positions, surfaceMap);

  const updated = geometry.attributes.position.array;
  let changed = 0;
  for (let i = 0; i < updated.length; i += 1) {
    if (Math.abs(updated[i] - positions[i]) > 1e-6) {
      changed += 1;
      break;
    }
  }
  assert.equal(changed, 1);
});
