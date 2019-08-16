
// 线管渐变
export const lineVertexShader = `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }`;
export const lineFragmentShader = `
  varying vec2 vUv;
  uniform float time;
  void main(){
    gl_FragColor = vec4(abs(sin(0.2 * (vUv.x + time))), 1.0, 1.0, 0.8);
  }`;
export const ringLightFragmentShader = `
  varying vec2 vUv;
  uniform float time;
  void main(){
    gl_FragColor = vec4(0.0, 1.0, 1.0, sin(vUv.x + time));
    // 'if (gl_FragColor.a < 0.3) discard;',
  }
`;
// 点击后闪光
export const bodyVertexShader = `
  uniform vec3 bodyColor;
  uniform vec3 lightColor;
  uniform vec3 lightDirection;
  uniform vec3 lightDirection2;
  uniform vec3 lightDirection3;
  uniform vec3 lightDirection4;
  varying vec4 v_Color;

  void main(){
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    vec3 vNormal = normal;
    float nDotL = max(dot(lightDirection, vNormal), 0.0);
    float nDotL2 = max(dot(lightDirection2, vNormal), 0.0);
    float nDotL3 = max(dot(lightDirection3, vNormal), 0.0);
    float nDotL4 = max(dot(lightDirection4, vNormal), 0.0);
    vec3 diffuse = lightColor * vec3(bodyColor) * nDotL;
    vec3 diffuse2 = lightColor * vec3(bodyColor) * nDotL2;
    vec3 diffuse3 = lightColor * vec3(bodyColor) * nDotL3;
    vec3 diffuse4 = lightColor * vec3(bodyColor) * nDotL4;
    v_Color = vec4(diffuse + diffuse2 + diffuse3 + diffuse4, 1.0);
  }
`;
export const bodyFragmentShader = `
  varying vec4 v_Color;
  uniform float highC;

  void main() {
    gl_FragColor = vec4(v_Color.r, v_Color.g + highC, v_Color.b + highC, v_Color.a);
  }
`;
// 上方圆模型
export const circleVertexShader = `
uniform vec3 bodyColor;
uniform vec3 lightColor;
uniform vec3 lightDirection;
uniform vec3 lightDirection2;
uniform vec3 lightDirection3;
uniform vec3 lightDirection4;
varying vec4 v_Color;

void main(){
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  vec3 vNormal = normal;
  float nDotL = max(dot(lightDirection, vNormal), 0.0);
  float nDotL2 = max(dot(lightDirection2, vNormal), 0.0);
  float nDotL3 = max(dot(lightDirection3, vNormal), 0.0);
  float nDotL4 = max(dot(lightDirection4, vNormal), 0.0);
  vec3 diffuse = lightColor * vec3(bodyColor) * nDotL;
  vec3 diffuse2 = lightColor * vec3(bodyColor) * nDotL2;
  vec3 diffuse3 = lightColor * vec3(bodyColor) * nDotL3;
  vec3 diffuse4 = lightColor * vec3(bodyColor) * nDotL4;
  v_Color = vec4(diffuse + diffuse2 + diffuse3 + diffuse4, 0.8);
}
`;
// 外发光
export const sphereVertexShader = `
  varying vec3 vVertexWorldPosition;
  varying vec3 vVertexNormal;
  // varying vec4 vFragColor;
  void main() {
    vVertexNormal = normalize(normalMatrix * normal);
    vVertexWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
export const sphereFragmentShader = `
  uniform vec3 glowColor;
  uniform float coeficient;
  uniform float power;
  uniform float opa;
  varying vec3 vVertexNormal;
  varying vec3 vVertexWorldPosition;
  // varying vec4 vFragColor;
  void main(){
    vec3 worldVertexToCamera = cameraPosition - vVertexWorldPosition;
    vec3 viewCameraToVertex = (viewMatrix * vec4(worldVertexToCamera, 0.0)).xyz;
    viewCameraToVertex = normalize(viewCameraToVertex);
    float intensity = pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);
    if(intensity > 0.55){ intensity = 0.0;}
    gl_FragColor = vec4(glowColor, intensity - ((sin(opa) / 6.0) + 0.1));
  }
`;
// export const sphereInVertexShader = `
//   varying vec3 vNormal;
//   void main()
//   {
//       vNormal = normalize( normalMatrix * normal );
//       gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
//   }
// `;
// export const sphereInFragmentShader = `
//   uniform float c;
//   uniform float p;
//   varying vec3 vNormal;
//   void main()
//   {
//     float intensity = pow( c - dot( vNormal, vec3( 0.0, 0.0, 0.5 ) ), p );
//     gl_FragColor = vec4( 0.0, 1.0, 1.0, 1.0 ) * intensity;
//   }
// `;
// 管线流动
export const flowLineVertexShader = `
  varying vec2 vUv;

  void main(){
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;
export const flowLineFragmentShader = `
  precision lowp float;
  varying vec2 vUv;
  uniform float time;

  void main(){
    gl_FragColor = vec4(0.29411765, 0.97254902, 1.0, sin(10.0 * (time + vUv.x)) - 0.7);
  }
`;
// bloom
// export const bloomVertexShader = `
//   varying vec2 vUv;
//   void main() {
//     vUv = uv;
//     gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
//   }
// `;
// export const bloomFragmentShader = `
//   uniform sampler2D baseTexture;
//   uniform sampler2D bloomTexture;
//   varying vec2 vUv;
//   vec4 getTexture( sampler2D texelToLinearTexture ) {
//     return mapTexelToLinear( texture2D( texelToLinearTexture , vUv ) );
//   }
//   vec4 aColor = vec4(0.01, 0.01, 0.01, 0);
//   vec4 bColor = max(getTexture(baseTexture), aColor);
//   vec4 cColor = max(getTexture(bloomTexture), aColor);
//   void main() {
//     gl_FragColor = (vec4(vec3(getTexture(baseTexture)), bColor.a) + vec4(1.0, 1.0, 1.0, 0.0) * vec4(vec3(getTexture(bloomTexture)), cColor.a));
//   }
// `;
