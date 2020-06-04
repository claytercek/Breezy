import * as THREE from 'three';

function GeneralLights(scene) {
  const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.70 );
  hemiLight.color.setHSL( 0.1, 0.1, 1.0 );
  hemiLight.groundColor.setHSL( 0.095, 0.25, 0.1 );
  hemiLight.position.set( 0, 50, 0 );
  scene.add( hemiLight );

  // const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
  // scene.add( hemiLightHelper );

  const dirLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  dirLight.color.setHSL( 0.1, 0.0, 1 );
  dirLight.position.set( 1, 1.5, -0.7 );
  dirLight.position.multiplyScalar( 30 );
  scene.add( dirLight );

  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.radius = 12.0;

  const d = 90;

  dirLight.shadow.camera.left = - d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = - d;

  dirLight.shadow.camera.far = 400;
  dirLight.shadow.bias = 0.001;

  // const dirLightHeper = new THREE.DirectionalLightHelper( dirLight, 10 );
  // scene.add( dirLightHeper );

  this.update = function(time) {
  };
}

export default GeneralLights;
