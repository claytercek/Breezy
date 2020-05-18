import * as THREE from 'three';
import frag from '../shaders/Water.frag';
import vert from '../shaders/Water.vert';


function Water(scene) {
  const material = new THREE.ShaderMaterial( {
    uniforms: {
      resolution: {value: new THREE.Vector2()},
    },
    vertexShader: vert,
    fragmentShader: frag,
  } );

  const mesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(200, 24, 200, 1, 1, 1), material);

  mesh.position.set(0, -12, 0);
  mesh.castShadow = false;
  mesh.receiveShadow = false;

  scene.add(mesh);

  this.update = function(time) {
  };
}

export default Water;


