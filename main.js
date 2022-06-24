import './style.css'

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const W = window.innerWidth;
const H = window.innerHeight;

// Scene
const scene = new THREE.Scene();

// Camera
const fov = 75;
const aspect = W / H;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 150, 0);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(W, H);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();

// Lights
let color = 0xffffff;
let intensity = 1;
const ambientLight = new THREE.AmbientLight(color, intensity);
scene.add(ambientLight);

const light = new THREE.PointLight(color, intensity);
light.position.set(70, 40, 0);
scene.add(light);
let lightHelper = new THREE.PointLightHelper(light);
scene.add(lightHelper);

const directionalLight = new THREE.DirectionalLight(color, intensity);
directionalLight.position.set(150, 150, -150);
directionalLight.target.position.set(-5, 0, 0);
scene.add(directionalLight);
scene.add(directionalLight.target);

let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(directionalLightHelper);

function updateLight() {
  directionalLight.target.updateMatrixWorld();
  directionalLightHelper.update();
}
updateLight();

// SkyBox
const skyboxTextureLoader = new THREE.CubeTextureLoader();
skyboxTextureLoader.setPath("./assets/");

const skyboxTexture = skyboxTextureLoader.load([
  "posx.jpg",
  "negx.jpg",
  "posy.jpg",
  "negy.jpg",
  "posz.jpg",
  "negz.jpg"
]);
scene.background = skyboxTexture;

// Responsiveness
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
// controls.minDistance = 50;
// controls.maxDistance = 300;
controls.target.set(0, 0, 0);

// Trackball Controls

// Helpers
let grid = new THREE.GridHelper(200, 50);
scene.add(grid);

// box
const boxGeometry = new THREE.BoxBufferGeometry(50, 50, 50);
const boxTexture = new THREE.TextureLoader().load("./assets/wood.jpg");
const boxMaterial = new THREE.MeshStandardMaterial( // basic, standard, lambert
  { map: boxTexture }
  // { color: 0xff0c02 }
);
const box = new THREE.Mesh(boxGeometry, boxMaterial);
// box.translateX(55)
// box.translateY(5);
// box.translateZ(-55)
scene.add(box);

// Animation
function animate() {
  requestAnimationFrame(animate); // Gameloop

  box.rotation.x += 0.01;
  box.rotation.y += 0.005;
  box.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}
animate();