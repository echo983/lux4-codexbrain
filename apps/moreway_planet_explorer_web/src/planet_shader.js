import * as THREE from 'three';

export function createSurfaceDataTexture(surfaceMap) {
  const width = surfaceMap.lon_steps;
  const height = surfaceMap.lat_steps;
  const data = new Uint8Array(surfaceMap.values);
  const texture = new THREE.DataTexture(data, width, height, THREE.RedFormat);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

export function createPlanetShaderMaterial(params) {
  const {
    surfaceMapTexture,
    landThreshold,
    palette,
    materialRules,
  } = params;

  const uniforms = {
    surfaceMap: { value: surfaceMapTexture },
    landThreshold: { value: landThreshold / 255.0 },
    
    // Palette colors (normalized to 0.0 - 1.0)
    deepOcean: { value: new THREE.Color(...palette.deep_ocean.map(c => c / 255)) },
    midOcean: { value: new THREE.Color(...palette.mid_ocean.map(c => c / 255)) },
    shallowOcean: { value: new THREE.Color(...palette.shallow_ocean.map(c => c / 255)) },
    coastalWater: { value: new THREE.Color(...palette.coastal_water.map(c => c / 255)) },
    coastWet: { value: new THREE.Color(...palette.coast_wet.map(c => c / 255)) },
    coastDry: { value: new THREE.Color(...palette.coast_dry.map(c => c / 255)) },
    lowlandGrass: { value: new THREE.Color(...palette.lowland_grass.map(c => c / 255)) },
    lowlandForest: { value: new THREE.Color(...palette.lowland_forest.map(c => c / 255)) },
    uplandTemperate: { value: new THREE.Color(...palette.upland_temperate.map(c => c / 255)) },
    uplandDry: { value: new THREE.Color(...palette.upland_dry.map(c => c / 255)) },
    mountainRock: { value: new THREE.Color(...palette.mountain_rock.map(c => c / 255)) },
    mountainSnow: { value: new THREE.Color(...palette.mountain_snow.map(c => c / 255)) },

    // Lighting
    sunDirection: { value: new THREE.Vector3(18, 12, 14).normalize() },
    ambientColor: { value: new THREE.Color(0x9abde0) },
    sunColor: { value: new THREE.Color(0xffffff) },
  };

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D surfaceMap;
      uniform float landThreshold;
      
      uniform vec3 deepOcean;
      uniform vec3 midOcean;
      uniform vec3 shallowOcean;
      uniform vec3 coastalWater;
      uniform vec3 coastWet;
      uniform vec3 coastDry;
      uniform vec3 lowlandGrass;
      uniform vec3 lowlandForest;
      uniform vec3 uplandTemperate;
      uniform vec3 uplandDry;
      uniform vec3 mountainRock;
      uniform vec3 mountainSnow;

      uniform vec3 sunDirection;
      uniform vec3 ambientColor;
      uniform vec3 sunColor;

      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p *= 2.0;
          a *= 0.5;
        }
        return v;
      }

      float smoothstep_alt(float edge0, float edge1, float x) {
        float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
        return t * t * (3.0 - 2.0 * t);
      }

      void main() {
        float value = texture2D(surfaceMap, vUv).r;
        
        // Bump mapping
        float eps = 0.005;
        float vR = texture2D(surfaceMap, vUv + vec2(eps, 0.0)).r;
        float vU = texture2D(surfaceMap, vUv + vec2(0.0, eps)).r;
        float bumpScale = 0.025;
        vec3 bumpNormal = normalize(vNormal + bumpScale * vec3(value - vR, value - vU, 0.0));

        vec3 color = vec3(0.0);
        float noiseVal = fbm(vUv * 64.0);

        if (value < landThreshold) {
          float seaLevel = value / max(landThreshold, 0.001);
          if (seaLevel < 0.35) {
            color = deepOcean;
          } else if (seaLevel < 0.65) {
            color = mix(deepOcean, midOcean, smoothstep_alt(0.35, 0.65, seaLevel));
          } else if (seaLevel < 0.85) {
            color = mix(midOcean, shallowOcean, smoothstep_alt(0.65, 0.85, seaLevel));
          } else {
            color = mix(shallowOcean, coastalWater, smoothstep_alt(0.85, 1.0, seaLevel));
          }
          color = mix(color, color * 1.1, noiseVal * 0.2);
        } else {
          float landLevel = (value - landThreshold) / max(1.0 - landThreshold, 0.001);
          float compressed = pow(landLevel, 1.28);
          
          float latitude = abs(vUv.y * 2.0 - 1.0);
          float dryness = clamp(0.5 + 0.3 * sin(vUv.x * 6.28) * cos(vUv.y * 3.14) + (noiseVal - 0.5) * 0.4, 0.0, 1.0);
          float vegetation = clamp(1.0 - dryness - latitude * 0.5, 0.0, 1.0);
          float coldness = latitude * 0.8 + compressed * 0.4 + (noiseVal - 0.5) * 0.15;

          vec3 coastColor = mix(coastWet, coastDry, dryness);
          vec3 lowlandColor = mix(lowlandGrass, lowlandForest, smoothstep_alt(0.2, 0.8, vegetation));
          vec3 uplandColor = mix(uplandTemperate, uplandDry, smoothstep_alt(0.32, 0.78, dryness));
          vec3 mountainColor = mix(mountainRock, mountainSnow, smoothstep_alt(0.5, 0.9, coldness));

          float wCoast = 1.0 - smoothstep_alt(0.02, 0.08, compressed);
          float wLowland = smoothstep_alt(0.02, 0.12, compressed) * (1.0 - smoothstep_alt(0.25, 0.45, compressed));
          float wUpland = smoothstep_alt(0.25, 0.45, compressed) * (1.0 - smoothstep_alt(0.65, 0.85, compressed));
          float wMountain = smoothstep_alt(0.65, 0.85, compressed);

          color = coastColor * wCoast + lowlandColor * wLowland + uplandColor * wUpland + mountainColor * wMountain;
          color = mix(color, color * (0.9 + 0.2 * noiseVal), 0.15);
        }

        vec3 N = normalize(mix(vNormal, bumpNormal, 0.6));
        vec3 L = normalize(sunDirection);
        vec3 V = normalize(cameraPosition - vPosition);
        vec3 R = reflect(-L, N);

        float diffuse = max(dot(N, L), 0.0);
        float specular = 0.0;
        
        if (value < landThreshold) {
            specular = pow(max(dot(V, R), 0.0), 48.0) * 0.6;
        } else {
            specular = pow(max(dot(V, R), 0.0), 8.0) * 0.05 * (1.0 - compressed);
        }

        vec3 lighting = ambientColor * 0.35 + sunColor * (diffuse * 0.85 + specular);
        gl_FragColor = vec4(color * lighting, 1.0);
      }
    `,
  });
}
