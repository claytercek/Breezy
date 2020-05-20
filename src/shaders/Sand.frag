// varying vec3 vNormal;
varying vec4 vWorldPosition;
varying vec2 vUv;


#include <common>
#include <packing>
#include <bsdfs>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>

uniform sampler2D texture;

void main(void) {

  vec3 finalColor = texture2D(texture, vec2(vUv * vec2(3))).rgb;

  if (vWorldPosition.y > 1.6) {
    finalColor.gb += 0.04;
  }

  vec3 shadowColor = vec3(0, 0, 0);
  float shadowPower = 0.5;

	gl_FragColor = vec4( mix(finalColor, shadowColor, (1.0 - getShadowMask() ) * shadowPower), 1.0);

}