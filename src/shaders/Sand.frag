
varying vec4 WorldPosition;

void main(void)
{
  gl_FragColor = vec4(0.6, 0.2, 0.1, 0.05);
  if (WorldPosition.y > 0.85) {
    gl_FragColor = vec4(vec3(1.0), 0.2);
  }

}