import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

function Fish(scene) {
  let fish;
  let mixer;
  // const loadingManager = new THREE.LoadingManager( function() {
  //   scene.add( fish );
  // } );

  const loader = new GLTFLoader( );

  loader.load( 'objects/fishies.gltf', function( model ) {
    fish = model.scene;

    const newMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});
    fish.traverse((o) => {
      if (o.isMesh) o.material = newMaterial;

      o.castShadow = true;
      o.receiveShadow = true;
    });

    fish.castShadow = true;
    fish.receiveShadow = true;

    mixer= new THREE.AnimationMixer(fish);
    model.animations.forEach((clip) => {
      mixer.clipAction(clip).play();
    });


    fish.position.set(0, -11, 45);
    fish.scale.set(2, 2, 2);
    scene.add(fish);
  } );


  this.update = function(time) {
    mixer && mixer.setTime( time );
  };
}

export default Fish;
