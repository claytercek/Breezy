import * as THREE from 'three';
import {SimplifyModifier} from '../utils/SimplifyModifier';
import 'simplex-noise';

function Rock(scene) {
  const radius = 8;
  const mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(radius, 2),
      new THREE.MeshStandardMaterial({
        flatShading: true,
        color: 0x9999aa,
      }));


  const modifier = new SimplifyModifier();

  // const count = Math.floor( mesh.geometry.faces.length * 0.01 );
  mesh.geometry = modifier.modify( mesh.geometry, 140 );

  mesh.position.set(0, 0, 0);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  scene.add(mesh);

  this.update = function(time) {
  };
}

export default Rock;
