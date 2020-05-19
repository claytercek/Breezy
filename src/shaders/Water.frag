
#include <packing>

varying vec4 WorldPosition;

uniform vec2 screenSize;
uniform vec4 cameraParams;
uniform sampler2D tDepth;

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
  vec4 color = vec4(0.2, 0.9 - diff / 300., 1.0, 0.5 + diff / 150.);
  // vec4 color = vec4(vec3(diff), 1.0);
  if (diff < 0.6) {
    color = vec4(1);
  } else if (diff < 1.0) {
    color = vec4(0.3, 1.0, 1.0, 0.75);
  }


  gl_FragColor = color;
}