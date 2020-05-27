import SceneManager from './SceneManager';

const canvas = document.getElementById('canvas');

const sceneManager = new SceneManager(canvas);

bindEventListeners();
render();

function bindEventListeners() {
  window.onresize = resizeCanvas;
  document.addEventListener('touchmove', (e) => {
    sceneManager.onDocumentMouseMove(e.touches[0]);
  });
  document.addEventListener('mousemove', (e) => {
    sceneManager.onDocumentMouseMove(e);
  });
  resizeCanvas();
}

function resizeCanvas() {
  canvas.style.width = '100%';
  canvas.style.height= '100%';

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  sceneManager.onWindowResize();
}

function render() {
  requestAnimationFrame(render);
  sceneManager.update();
}
