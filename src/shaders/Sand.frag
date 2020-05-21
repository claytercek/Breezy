
varying vec4 WorldPosition;

void main(void)
{
  gl_FragColor = vec4(vec3(1.0), 0.0);
  if (WorldPosition.y > 0.85) {
    gl_FragColor.a = 0.2;
  }

}