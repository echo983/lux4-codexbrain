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
    albedoTexture, // 新增：OpenAI 写实贴图
    landThreshold,
  } = params;

  const uniforms = {
    surfaceMap: { value: surfaceMapTexture },
    albedoMap: { value: albedoTexture },
    landThreshold: { value: landThreshold / 255.0 },
    sunDirection: { value: new THREE.Vector3(18, 12, 14).normalize() },
    sunColor: { value: new THREE.Color(1.0, 0.95, 0.9) },
    ambientColor: { value: new THREE.Color(0.02, 0.05, 0.1) },
    cameraPos: { value: new THREE.Vector3() },
    time: { value: 0.0 }
  };

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPos.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      uniform sampler2D surfaceMap;
      uniform sampler2D albedoMap;
      uniform float landThreshold;
      uniform float time;
      uniform vec3 sunDirection;
      uniform vec3 sunColor;
      uniform vec3 ambientColor;
      uniform vec3 cameraPos;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPos;

      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
      float noise(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }
      float fbm(vec2 p) {
        float v = 0.0; float a = 0.5;
        for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
        return v;
      }

      void main() {
        float heightValue = texture2D(surfaceMap, vUv).r;
        vec3 baseColor = texture2D(albedoMap, vUv).rgb;
        float isLand = step(landThreshold, heightValue);
        
        vec3 N = normalize(vNormal);
        vec3 L = normalize(sunDirection);
        vec3 V = normalize(cameraPos - vWorldPos);
        vec3 R = reflect(-L, N);

        float dotNL = dot(N, L);
        float diffuse = max(0.0, dotNL);
        
        // Specular for Ocean
        float spec = pow(max(0.0, dot(V, R)), 40.0) * 0.6 * (1.0 - isLand);
        
        // Fresnel Edge Glow (Atmosphere visibility)
        float fresnel = pow(1.0 - max(0.0, dot(N, V)), 3.5);
        vec3 rimColor = vec3(0.3, 0.6, 1.0) * fresnel;

        // Night side lighting (Subtle scattered light + City lights simulation)
        float night = smoothstep(0.2, -0.5, dotNL);
        float cityLights = step(0.8, fbm(vUv * 400.0)) * isLand * night * 0.5;
        vec3 nightSide = ambientColor * 1.5 + vec3(1.0, 0.8, 0.4) * cityLights;

        // Clouds layer
        float cloudNoise = fbm(vUv * 12.0 + time * 0.005);
        float cloudMask = smoothstep(0.4, 0.9, cloudNoise);
        vec3 cloudColor = vec3(0.9, 0.95, 1.0) * (diffuse + 0.3) * cloudMask;

        // Final Lighting Composition
        vec3 lighting = sunColor * (diffuse + spec) + nightSide + rimColor * (diffuse + 0.1);
        vec3 finalColor = baseColor * lighting;
        
        // Add clouds on top
        finalColor = mix(finalColor, cloudColor, cloudMask * 0.6);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
  });
}
