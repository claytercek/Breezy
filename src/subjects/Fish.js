import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

function Fish(scene) {
  let fish;
  const mixer = new THREE.AnimationMixer( scene );

  const loader = new GLTFLoader( );


  const materialObj = new THREE.MeshBasicMaterial( {
    color: '#000000',
    morphTargets: true,
  });

  loader.load( 'objects/fish_10.glb', function( gltf ) {
    gltf.scene.scale.set(8, 8, 8);
    const clip = gltf.animations[0];
    const mesh = gltf.scene;

    mesh.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = materialObj;
        child.receiveShadow = true;
        child.castShadow = true;
      }
    });


    addMorph(mesh, clip, 0, 16, -3, 12);
    addMorph(mesh, clip, 1.2, 13, -3, 8);
    addMorph(mesh, clip, 5, 12, -3, 10);
    addMorph(mesh, clip, 6, 12, -3, 7);
  } );


  loader.load( 'objects/fish_11.glb', function( gltf ) {
    gltf.scene.scale.set(8, 8, 8);
    const clip = gltf.animations[0];
    const mesh = gltf.scene;

    mesh.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = materialObj;
        child.receiveShadow = true;
        child.castShadow = true;
      }
    });

    addMorph(mesh, clip, 0.8, 12, -2, 15);
  } );


  this.update = function(deltaTime) {
    mixer.update( deltaTime );
  };

  function addMorph( mesh, clip, timeOffset, x, y, z ) {
    mesh = mesh.clone();
    mixer.clipAction( clip, mesh ).
        setDuration(10.3).
        startAt( timeOffset ).
        play();

    mesh.position.set( x, y, z );

    scene.add( mesh );
  }
}

export default Fish;
