import * as THREE from 'three';
import 'simplex-noise';


function Terrain(scene) {
  const texture = new THREE.TextureLoader().load( '/images/cartoon-sand.png' );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 4, 4 );

  const mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(200, 200, 64, 64),
      new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 1,

      }));


  const peak = 2;
  const smoothing = 80;
  const vertices = mesh.geometry.attributes.position.array;

  const simplex = new SimplexNoise();

  for (let i = 0; i <= vertices.length; i += 3) {
    vertices[i+2] = peak * simplex.noise2D(
        vertices[i] / smoothing,
        vertices[i+1] / smoothing);
  }
  mesh.geometry.attributes.position.needsUpdate = true;
  mesh.geometry.computeVertexNormals();

  mesh.rotation.x = -Math.PI / 2.3;

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  scene.add(mesh);

  this.update = function(time) {
  };
}

export default Terrain;
