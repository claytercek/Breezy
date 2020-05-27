import * as THREE from 'three';
// import {SimplifyModifier} from '../utils/SimplifyModifier';
import 'simplex-noise';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

function Rock(scene, surface) {
  const meshes = [];

  function addToScene(mesh, position, rotation, scale) {
    const newMesh = mesh.clone();

    newMesh.scale.set(
        scale,
        scale,
        scale);

    newMesh.rotation.set(
        rotation[0],
        rotation[1],
        rotation[2]);

    newMesh.position.set(
        position[0],
        position[1],
        position[2]);

    scene.add(newMesh);

    meshes.push(newMesh);
  }

  const loader = new GLTFLoader();
  loader.load( 'objects/rock.glb', function( gltf ) {
    const mesh = gltf.scene.children[0];

    mesh.material = new THREE.MeshPhongMaterial({
      flatShading: true,
      color: 0x9999aa,
    });

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    addToScene(mesh,
        [20, -5.5, 33],
        [0, 0, 3],
        9);


    addToScene(mesh,
        [5, -2.2, 3],
        [3, 0, 0],
        6);
    addToScene(mesh,
        [-3, -3, 0],
        [1, 2, 0],
        8);


    addToScene(mesh,
        [-12, -9, 27],
        [1, 2, 0.5],
        6);

    addToScene(mesh,
        [47, -4, 3],
        [0, 1, 0],
        10);
  }, undefined, function( error ) {
    console.error( error );
  } );

  this.update = function(time) {
  };
}

export default Rock;
