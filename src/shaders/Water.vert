
varying vec4 WorldPosition;

void main(void) {
  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
	gl_Position = projectionMatrix * modelViewPosition;
  WorldPosition = modelMatrix * vec4(position, 1.0);;
}