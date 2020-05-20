// varying vec3 vNormal;
varying vec4 vWorldPosition;
varying vec2 vUv;

#include <common>
#include <shadowmap_pars_vertex>

void main() {
  vWorldPosition = modelMatrix * vec4(position, 1.0);
  
  #include <begin_vertex>
  #include <project_vertex>
  #include <worldpos_vertex>
	#include <shadowmap_vertex>
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  vUv = uv;
}