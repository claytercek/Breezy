import * as THREE from 'three';
import GeneralLights from './subjects/GeneralLights';
import Rock from './subjects/Rock';
import Terrain from './subjects/Terrain';
import Water from './subjects/Water';
import {OrbitControls} from './utils/OrbitControls';

function SceneManager(canvas) {
  const clock = new THREE.Clock();

  const screenDimensions = {
    width: canvas.width,
    height: canvas.height,
  };
  // const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
  const DPR = 1;

  const terrainDimensions = [200, 200];

  const scene = buildScene();
  const bufferScene = buildScene();
  bufferScene.background = new THREE.Color('#000');
  const renderer = buildRender(screenDimensions);
  const camera = buildCamera(screenDimensions);
  const sceneSubjects = createSceneSubjects(scene, camera);
  const {colorTarget, depthTarget} = createTargets();

  const materialDepth = new THREE.MeshDepthMaterial();
  materialDepth.depthPacking = THREE.RGBADepthPacking;
  materialDepth.blending = THREE.NoBlending;

  const controls = new OrbitControls( camera, renderer.domElement );

  function buildScene() {
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color('#000');

    return scene;
  }

  function buildRender({width, height}) {
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      depth: true,
      stencil: true,
    });

    renderer.setPixelRatio(DPR);
    renderer.setSize(width, height);

    renderer.shadowMap.enabled = true;
    renderer.autoClear = false;

    return renderer;
  }

  function buildCamera({width, height}) {
    const aspectRatio = width / height;
    const fieldOfView = 35;
    const nearPlane = 0.3;
    const farPlane = 400;
    const camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane);


    camera.position.set(0, 20, 20);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    return camera;
  }

  function createSceneSubjects(scene, camera) {
    const sceneSubjects = [
      new Terrain(bufferScene, terrainDimensions),
      new GeneralLights(bufferScene),
      new Water(scene, camera, terrainDimensions, {
        DPR,
        width: screenDimensions.width,
        height: screenDimensions.height,
      }),
      new Rock(bufferScene),
    ];

    return sceneSubjects;
  }

  function createTargets() {
    const colorTarget = new THREE.WebGLRenderTarget(
        window.innerWidth * DPR,
        window.innerHeight * DPR );

    colorTarget.texture.format = THREE.RGBFormat;
    colorTarget.texture.minFilter = THREE.NearestFilter;
    colorTarget.texture.magFilter = THREE.NearestFilter;
    colorTarget.depthBuffer = true;

    const depthTarget = new THREE.WebGLRenderTarget(
        window.innerWidth * DPR,
        window.innerHeight * DPR );

    depthTarget.texture.format = THREE.RGBAFormat;
    depthTarget.texture.minFilter = THREE.NearestFilter;
    depthTarget.texture.magFilter = THREE.NearestFilter;
    depthTarget.depthBuffer = true;

    return {colorTarget, depthTarget};
  }

  this.update = function() {
    const elapsedTime = clock.getElapsedTime();

    for (let i = 0; i < sceneSubjects.length; i++) {
      sceneSubjects[i].update(elapsedTime, colorTarget, depthTarget);
    }

    controls.update();

    renderer.clear();


    renderer.setRenderTarget( colorTarget );
    renderer.render(bufferScene, camera);


    // render buffer scene for water depth texture
    bufferScene.overrideMaterial = materialDepth;
    renderer.setRenderTarget( depthTarget );
    renderer.render(bufferScene, camera);

    renderer.setRenderTarget( null );
    bufferScene.overrideMaterial = null;

    // render buffer scene and then render water on top
    renderer.render( bufferScene, camera );
    renderer.render( scene, camera );
  };

  this.onWindowResize = function() {
    const {width, height} = canvas;

    screenDimensions.width = width;
    screenDimensions.height = height;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    // const dpr = renderer.getPixelRatio();
    const dpr = 1;
    depthTarget.setSize( width * dpr, height * dpr );
    colorTarget.setSize( width * dpr, height * dpr );

    for (const subject of sceneSubjects) {
      if (subject.onResize) {
        subject.onResize({
          width: width,
          height: height,
          DPR: dpr,
        });
      }
    }
  };
};


export default SceneManager;
