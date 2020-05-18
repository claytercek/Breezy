import * as THREE from 'three';
import GeneralLights from './subjects/GeneralLights';
import TestMesh from './subjects/TestMesh';
import Terrain from './subjects/Terrain';
import Water from './subjects/Water';
import {OrbitControls} from './utils/OrbitControls';

function SceneManager(canvas) {
  const clock = new THREE.Clock();

  const screenDimensions = {
    width: canvas.width,
    height: canvas.height,
  };

  const scene = buildScene();
  const renderer = buildRender(screenDimensions);
  const camera = buildCamera(screenDimensions);
  const sceneSubjects = createSceneSubjects(scene);

  const controls = new OrbitControls( camera, renderer.domElement );

  function buildScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000');

    return scene;
  }

  function buildRender({width, height}) {
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });

    const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
    renderer.setPixelRatio(DPR);
    renderer.setSize(width, height);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;

    return renderer;
  }

  function buildCamera({width, height}) {
    const aspectRatio = width / height;
    const fieldOfView = 60;
    const nearPlane = 1;
    const farPlane = 1000;
    const camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane);

    camera.position.set(0, 20, 20);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    return camera;
  }

  function createSceneSubjects(scene) {
    const sceneSubjects = [
      new GeneralLights(scene),
      new TestMesh(scene),
      new Terrain(scene),
      new Water(scene),
    ];

    return sceneSubjects;
  }

  this.update = function() {
    const elapsedTime = clock.getElapsedTime();

    for (let i = 0; i < sceneSubjects.length; i++) {
      sceneSubjects[i].update(elapsedTime);
    }

    controls.update();
    renderer.render(scene, camera);
  };

  this.onWindowResize = function() {
    const {width, height} = canvas;

    screenDimensions.width = width;
    screenDimensions.height = height;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  };
};


export default SceneManager;
