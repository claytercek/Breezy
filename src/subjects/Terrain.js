import * as THREE from 'three';
import 'simplex-noise';
import vert from '../shaders/Sand.vert';
import frag from '../shaders/Sand.frag';


function Terrain(scene, terrainDimensions) {
  const texture = new THREE.TextureLoader().load( '/images/cartoon-sand.png' );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 4, 4 );


  const mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(terrainDimensions[0], terrainDimensions[1], 100, 100),
      [
        new THREE.ShaderMaterial({
          transparent: true,
          vertexShader: vert,
          fragmentShader: frag,
          uniforms: THREE.ShaderLib.phong.uniforms,
        }),
        new THREE.MeshPhongMaterial({
          map: texture,
          shininess: 0,
        }),
      ]
  );

  mesh.geometry.clearGroups();
  mesh.geometry.addGroup( 0, Infinity, 0 );
  mesh.geometry.addGroup( 0, Infinity, 1 );

  mesh.position.set(-70, 6, -30);

  const peak = 1;
  const smoothing = 8000 / terrainDimensions[1];
  const vertices = mesh.geometry.attributes.position.array;

  const simplex = new SimplexNoise('2');

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
