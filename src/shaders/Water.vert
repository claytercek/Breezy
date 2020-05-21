
varying vec4 WorldPosition;
varying vec2 vUv;
uniform float uTime;

void main(void) {
  vUv = uv;
  vec3 pos = position;
  pos.z += cos(pos.y * 10. + uTime * 1.2) * (1. - abs(pos.y) / 50.);
	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  WorldPosition = modelMatrix * vec4(pos, 1.0);
  
}