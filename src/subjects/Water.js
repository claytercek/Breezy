import * as THREE from 'three';
import frag from '../shaders/Water.frag';
import vert from '../shaders/Water.vert';


function Water(scene, camera, terrainDimensions, screenDimensions) {
  const material = new THREE.ShaderMaterial( {
    uniforms: {
      tDepth: {value: null},
      tEnv: {value: null},
      screenSize: new THREE.Uniform([
        screenDimensions.width * screenDimensions.DPR,
        screenDimensions.height * screenDimensions.DPR,
      ]),
      uTime: {
        value: 0.0,
      },
      cameraNear: {value: camera.near},
      cameraFar: {value: camera.far},
    },
    vertexShader: vert,
    fragmentShader: frag,
    transparent: true,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(terrainDimensions[0], terrainDimensions[1], 100, 100), material);

  mesh.rotateX(Math.PI / -2);
  mesh.position.set(-70, 0, 0);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  scene.add(mesh);

  this.update = function(deltaTime, colorTarget, depthTarget) {
    material.uniforms.tDepth.value = depthTarget.texture;
    material.uniforms.tEnv.value = colorTarget.texture;
    material.uniforms.uTime.value += deltaTime;
  };

  this.onResize = function(screenDimensions) {
    material.uniforms.screenSize = new THREE.Uniform([
      screenDimensions.width * screenDimensions.DPR,
      screenDimensions.height * screenDimensions.DPR,
    ]);
  };
}

export default Water;


