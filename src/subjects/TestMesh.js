import * as THREE from 'three';

function SceneSubject(scene) {
  const radius = 2;
  const mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(radius, 6),
      new THREE.MeshStandardMaterial());

  mesh.position.set(0, 0, 0);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  scene.add(mesh);

  this.update = function(time) {
    const scale = Math.sin(time)+2;

    mesh.scale.set(scale, scale, scale);
  };
}

export default SceneSubject;
