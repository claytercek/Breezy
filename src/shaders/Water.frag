
#include <packing>

varying vec3 WorldPosition;

uniform vec2 screenSize;
uniform vec4 cameraParams;
uniform sampler2D tDepth;

float linearizeDepth(float z) {
  float viewZ = perspectiveDepthToViewZ( z, 0.3, 400. );
  return viewZToOrthographicDepth( viewZ, 0.3, 400. );
}

float getLinearScreenDepth(vec2 uv) {
  return linearizeDepth(texture2D(tDepth, uv).r) * cameraParams.y;
}
 
float getLinearDepth(vec3 pos) {
    return -(viewMatrix * vec4(pos, 1.0)).z;
}
 
float getLinearScreenDepth() {
    vec2 uv = gl_FragCoord.xy / screenSize;
    return getLinearScreenDepth(uv);
}

void main() {
  float worldDepth = getLinearDepth(WorldPosition);
  float screenDepth = getLinearScreenDepth();


  vec4 color = vec4(0, 0.85, 1.0, 0.5);

  // vec4 color = vec4(vec3(screenDepth / cameraParams.y), 1);
  if (screenDepth - worldDepth < 8.0) {
    color = vec4(1.0);
  } else if (screenDepth - worldDepth < 9.0) {
    color = vec4(0.23, 0.85, 1.0, 0.8);
  }


  gl_FragColor = color;
}