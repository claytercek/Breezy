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
  const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;

  const terrainDimensions = [200, 200];

  const scene = buildScene();
  const bufferScene = buildScene();
  bufferScene.background = new THREE.Color('#000');
  const renderer = buildRender(screenDimensions);
  const camera = buildCamera(screenDimensions);
  const sceneSubjects = createSceneSubjects(scene, camera);
  const target = createTarget();

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
    });

    renderer.setPixelRatio(DPR);
    renderer.setSize(width, height);

    // renderer.gammaInput = true;
    // renderer.gammaOutput = true;
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

  function createTarget() {
    const target = new THREE.WebGLRenderTarget(
        window.innerWidth * DPR,
        window.innerHeight * DPR );

    target.texture.format = THREE.RGBFormat;
    target.texture.minFilter = THREE.NearestFilter;
    target.texture.magFilter = THREE.NearestFilter;
    target.texture.generateMipmaps = false;
    target.stencilBuffer = false;
    target.depthBuffer = true;
    target.depthTexture = new THREE.DepthTexture();
    target.depthTexture.format = THREE.DepthFormat;
    target.depthTexture.type = THREE.UnsignedIntType;

    return target;
  }

  this.update = function() {
    const elapsedTime = clock.getElapsedTime();

    for (let i = 0; i < sceneSubjects.length; i++) {
      sceneSubjects[i].update(elapsedTime, target);
    }

    controls.update();

    renderer.clear();

    // render buffer scene for water depth texture
    renderer.setRenderTarget( target );
    renderer.render(bufferScene, camera);

    renderer.setRenderTarget( null );

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
    const dpr = renderer.getPixelRatio();
    target.setSize( width * dpr, height * dpr );

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
