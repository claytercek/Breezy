import * as THREE from 'three';
import GeneralLights from './subjects/GeneralLights';
import Rock from './subjects/Rock';
import Terrain from './subjects/Terrain';
import Water from './subjects/Water';
import {OrbitControls} from './utils/OrbitControls';
import frag from './shaders/post.frag';
import vert from './shaders/post.vert';

function SceneManager(canvas) {
  const clock = new THREE.Clock();

  const screenDimensions = {
    width: canvas.width,
    height: canvas.height,
  };

  const terrainDimensions = [200, 200];

  const scene = buildScene();
  const bufferScene = buildScene();
  bufferScene.background = new THREE.Color('#000');
  const renderer = buildRender(screenDimensions);
  const camera = buildCamera(screenDimensions);
  const sceneSubjects = createSceneSubjects(scene, camera);
  const target = createTarget();
  const {postCamera, postMaterial, postScene} = setupPost(camera);

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

    const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
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
      new Terrain(bufferScene),
      new GeneralLights(bufferScene),
      new Water(scene, camera),
      new Rock(bufferScene),
    ];

    return sceneSubjects;
  }

  function setupPost(camera) {
    // Setup post processing stage
    const cam = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
    const mat = new THREE.ShaderMaterial( {
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        cameraNear: {value: camera.near},
        cameraFar: {value: camera.far},
        tDiffuse: {value: null},
        tDepth: {value: null},
      },
    } );
    const postPlane = new THREE.PlaneBufferGeometry( 2, 2 );
    const postQuad = new THREE.Mesh( postPlane, mat );
    const scn = new THREE.Scene();
    scn.add( postQuad );

    return {postCamera: cam, postMaterial: mat, postScene: scn};
  }

  function createTarget() {
    const target = new THREE.WebGLRenderTarget(
        window.innerWidth,
        window.innerHeight );

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
  };
};


export default SceneManager;
