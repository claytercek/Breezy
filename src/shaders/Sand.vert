
varying vec4 WorldPosition;

#include <common>

void main()
{
	#include <begin_vertex>
	#include <project_vertex>
  WorldPosition = modelMatrix * vec4(position, 1.0);
}