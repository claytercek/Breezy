#include <packing>

varying vec4 WorldPosition;
varying vec2 vUv;

uniform vec2 screenSize;
uniform vec4 cameraParams;
uniform sampler2D tDepth;
uniform sampler2D tEnv;
uniform float uTime;


float linearizeDepth(float z) {
  float viewZ = perspectiveDepthToViewZ( z, 0.3, 400. );
  return viewZ;
}

float getLinearScreenDepth(vec2 uv) {
  return  linearizeDepth(texture2D(tDepth, uv).r);
}
 
float getLinearDepth(vec3 pos) {
    return  (viewMatrix * vec4(pos, 1.0)).z;
    // return gl_FragCoord.z;
}
 
float getLinearScreenDepth() {
    vec2 uv = gl_FragCoord.xy / screenSize;
    return getLinearScreenDepth(uv);
}

void main() {
  float worldDepth = getLinearDepth(WorldPosition.xyz);
  float screenDepth = getLinearScreenDepth();

  float diff =  (worldDepth - screenDepth);

  vec2 uv = gl_FragCoord.xy / screenSize;
  float wave = sin(vUv.x * 40. + uTime * 3.) / 2. + 0.5;
  uv += (viewMatrix * vec4(0.0, 0.0, wave / 100., 0.0)).xy * diff / 20.;
  vec4 color = texture2D(tEnv, uv);

  vec4 waterColor = vec4(0.2, 0.8 - diff / 300., 1.0, 1.);
  color = mix(color, waterColor, vec4(0.5 + diff / 200.));

  if (diff < 0.8) {
    color = vec4(1);
  } else if (diff < 1.4) {
    color = vec4(0.7, 0.9, 1.0, 0.75);
  }


  gl_FragColor = color;
}