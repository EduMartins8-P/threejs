import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.querySelector('canvas.threejs');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
const popup = document.getElementById('popup');
const simBtn = document.getElementById('simBtn');
const naoBtn = document.getElementById('naoBtn');
const textureLoader = new THREE.TextureLoader();
const textureTest = textureLoader.load('/models/granite-tile-bl/granite-tile_albedo.png');
const material = new THREE.MeshLambertMaterial({side: THREE.DoubleSide});
material.map = textureTest;

const geometry = new THREE.PlaneGeometry(1,1);
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);


const helper = new THREE.AxesHelper(10);

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clippingPlanes = [new THREE.Plane(new THREE.Vector3(0, -1, 0), Infinity)];
renderer.localClippingEnabled = true;

const controls = new OrbitControls(camera, renderer.domElement);
scene.add(new THREE.AmbientLight('white', 1));

let hotelModel = null;

const loader = new GLTFLoader();
loader.load('/models/Hotel.glb', (gltf) => {
  hotelModel = gltf.scene;
  hotelModel.scale.set(1.5, 1.5, 1.5);
  scene.add(hotelModel);

  hotelModel.traverse((child) => {
    if (child.isMesh) {
      child.material.clippingPlanes = clippingPlanes;
      child.material.clipShadows = true;
      child.material.needsUpdate = true;
    }
  });
});

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  if (!hotelModel) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(hotelModel, true);

  if (intersects.length > 0) {
    const intersect = intersects[0];
    const localY = intersect.point.y - hotelModel.position.y;

    if (localY < 1) {
      clippingPlanes[0].normal.set(0, -1, 0);
      clippingPlanes[0].constant = 0.1;
    } else if (localY < 2) {
      clippingPlanes[0].normal.set(0, -1, 0);
      clippingPlanes[0].constant = 1;
    } else if(localY < 3){
      clippingPlanes[0].normal.set(0, -1, 0);
      clippingPlanes[0].constant = 2;
    } else if(localY < 4) {
      clippingPlanes[0].normal.set(0, -1, 0);
      clippingPlanes[0].constant = 3;
    } else {
      clippingPlanes[0].constant = -Infinity;
    }

    popup.style.display = 'block';
  }
});

simBtn.addEventListener('click', () => {
  popup.style.display = 'none';
  alert("Parabéns! Andar comprado.");
});

naoBtn.addEventListener('click', () => {
  popup.style.display = 'none';
});

function showPopup(text) {
  const popup = document.getElementById('popup');
  popup.innerText = text;
  popup.style.display = 'block';

  setTimeout(() => {
    popup.style.display = 'none';
  }, 2000);
}

window.addEventListener('keydown', (event) => {

  console.log('dois');
  if (event.code === 'Space') {

    console.log('um');

    if (!hotelModel) return;

    hotelModel.traverse((child) => {
      if (child.isMesh) {
        child.visible = true;

        if (Array.isArray(child.material)) {
          child.material.forEach(m => {
            m.clippingPlanes = null;
            m.needsUpdate = true;
          });
        } else {
          child.material.clippingPlanes = null;
          child.material.needsUpdate = true;
        }
      }
    });
    clippingPlanes[0].constant = -Infinity;
    showPopup('Exibindo o prédio inteiro');
  }
});


const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

plane.rotation.x = (Math.PI * 1/2)
plane.scale.set(10,10);
scene.add(helper);

camera.position.set(4, 6, 7);
animate();