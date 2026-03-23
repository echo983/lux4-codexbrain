import test from 'node:test';
import assert from 'node:assert/strict';

import {
  computeDistortion,
  computeLandBandWeights,
  computeLandEcology,
} from '../src/material_ecology.js';

test('computeDistortion is periodic across longitude wraps', () => {
  const a = computeDistortion(0.1, 0.3);
  const b = computeDistortion(1.1, 0.3);
  assert(Math.abs(a - b) < 1e-9);
});

test('computeLandEcology returns clamped values', () => {
  const fields = computeLandEcology({
    su: 0.25,
    sv: 0.4,
    compressed: 0.6,
    distortion: 0.3,
  });
  assert(fields.moisture >= 0 && fields.moisture <= 1);
  assert(fields.dryness >= 0 && fields.dryness <= 1);
  assert(fields.vegetation >= 0 && fields.vegetation <= 1);
  assert(fields.coldness >= 0 && fields.coldness <= 1);
});

test('computeLandBandWeights blends adjacent land bands only', () => {
  const coastLowland = computeLandBandWeights(0.3);
  assert(coastLowland.coast > 0);
  assert(coastLowland.lowland > 0);
  assert.equal(coastLowland.upland, 0);
  assert.equal(coastLowland.mountain, 0);

  const uplandMountain = computeLandBandWeights(0.95);
  assert.equal(uplandMountain.coast, 0);
  assert.equal(uplandMountain.lowland, 0);
  assert(uplandMountain.upland > 0);
  assert(uplandMountain.mountain > 0);
});
