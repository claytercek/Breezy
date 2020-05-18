import * as THREE from 'three';

function GeneralLights(scene) {
  const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
  hemiLight.color.setHSL( 0.6, 0.85, 0.6 );
  hemiLight.groundColor.setHSL( 0.095, 0.85, 0.75 );
  hemiLight.position.set( 0, 50, 0 );
  scene.add( hemiLight );

  const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
  scene.add( hemiLightHelper );

  const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
  dirLight.color.setHSL( 0.1, 1, 0.85 );
  dirLight.position.set( - 1, 1.75, 1 );
  dirLight.position.multiplyScalar( 30 );
  scene.add( dirLight );

  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 4096;
  dirLight.shadow.mapSize.height = 4096;

  const d = 50;

  dirLight.shadow.camera.left = - d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = - d;

  dirLight.shadow.camera.far = 3500;
  dirLight.shadow.bias = - 0.0001;

  const dirLightHeper = new THREE.DirectionalLightHelper( dirLight, 10 );
  scene.add( dirLightHeper );

  this.update = function(time) {
  };
}

export default GeneralLights;
