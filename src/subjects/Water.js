import * as THREE from 'three';
import frag from '../shaders/Water.frag';
import vert from '../shaders/Water.vert';


function Water(scene, camera) {
  const n = camera.near;
  const f = camera.far;
  const cameraParams = new THREE.Vector4(
      1/f,
      f,
      (1-f / n) / 2,
      (1 + f / n) / 2,
  );

  const material = new THREE.ShaderMaterial( {
    uniforms: {
      tDepth: {value: null},
      tEnv: {value: null},
      cameraParams: new THREE.Uniform( cameraParams ),
      screenSize: new THREE.Uniform([0, 0]),
      uTime: {
        value: 0.0,
      },
    },
    vertexShader: vert,
    fragmentShader: frag,
    transparent: true,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(200, 200, 64, 64), material);

  mesh.rotateX(Math.PI / -2);
  mesh.position.set(0, 0, 0);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  scene.add(mesh);

  this.update = function(time, target) {
    material.uniforms.tDepth.value = target.depthTexture;
    material.uniforms.tEnv.value = target.texture;
    material.uniforms.screenSize = new THREE.Uniform(
        [target.width, target.height]
    );
    material.uniforms.uTime.value = time;
  };
}

export default Water;


