

varying vec2 vUv;

void main(void)
{
  vUv = uv;
  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
	gl_Position = projectionMatrix * modelViewPosition;
}