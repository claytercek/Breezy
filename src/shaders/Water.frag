
#include <packing>

varying vec4 WorldPosition;
varying vec2 vUv;

uniform vec2 screenSize;
uniform sampler2D tDepth;
uniform sampler2D tEnv;
uniform float uTime;
uniform float cameraNear;
uniform float cameraFar;


float linearizeDepth(float z) {
  float viewZ = perspectiveDepthToViewZ( z, cameraNear, cameraFar );
  // return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
  return viewZ;
}


float getScreenDepth(vec2 uv) {
  float depth = unpackRGBAToDepth(texture2D(tDepth, uv));
  return linearizeDepth(depth);
}
 
float getLinearDepth(vec3 pos) {
    float viewZ = (viewMatrix * vec4(pos, 1.0)).z;
    return viewZ;
}

void main() {
  vec2 uv = gl_FragCoord.xy / screenSize;
  float worldDepth = getLinearDepth(WorldPosition.xyz);
  float screenDepth = getScreenDepth(uv);

  // vec4 color = vec4(vec3(worldDepth), 1.);

  float diff =  (worldDepth - screenDepth);

  float wave = sin(vUv.x * 40. + uTime * 3.) / 2. + 0.5;
  uv += (viewMatrix * vec4(0.0, 0.0, wave / 100., 0.0)).xy * diff / 20.;
  vec4 color = texture2D(tEnv, uv);


  screenDepth = getScreenDepth(uv);
  diff =  (worldDepth - screenDepth);

  vec4 waterColor = vec4(0.2, 0.9 - diff / 50., 1.0, 1.);
  color = mix(color, waterColor, vec4(0.5 + diff / 200.));

  if (diff < 0.4) {
    color = vec4(1);
  } else if (diff < 0.7) {
    color = vec4(0.7, 0.95, 1.0, 0.75);
  }

  gl_FragColor = color;
}