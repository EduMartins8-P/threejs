import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { luzAmbiente, luzesPonto } from './iluminacao.js';


const canvas = document.querySelector('canvas.threejs');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
const popup = document.getElementById('popup');
const simBtn = document.getElementById('simBtn');
const naoBtn = document.getElementById('naoBtn');

const textureLoader = new THREE.TextureLoader();
const textureTest = textureLoader.load('/models/granite-tile-bl/granite-tile_albedo.png');
const material = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide, map: textureTest });

const geometry = new THREE.PlaneGeometry(3, 3);
const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = Math.PI / 2;
plane.scale.set(10, 10);
scene.add(plane);

const helper = new THREE.AxesHelper(10);
scene.add(helper);

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clippingPlanes = [new THREE.Plane(new THREE.Vector3(0, -1, 0), Infinity)];
renderer.localClippingEnabled = true;

const controls = new OrbitControls(camera, renderer.domElement);

let hotelModel = null;

const mtlLoader = new MTLLoader();
mtlLoader.setPath('/models/predio/');
mtlLoader.load('H_5_obj.mtl', (materials) => {
  materials.preload();

  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.setPath('/models/predio/');
  objLoader.load('H_5_obj.obj', (object) => {
    hotelModel = object;
    hotelModel.scale.setScalar(0.0009);
    scene.add(hotelModel);
    const box = new THREE.Box3().setFromObject(hotelModel);

    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    hotelModel.scale.y *= 2;
    hotelModel.position.x -= center.x;
    hotelModel.position.z -= center.z;
    hotelModel.position.y -= box.min.y;


    hotelModel.traverse((child) => {
      if (child.isMesh) {
        child.material.clippingPlanes = clippingPlanes;
        child.material.clipShadows = true;
        child.material.needsUpdate = true;
      }
    });
      const boxHelper = new THREE.BoxHelper(hotelModel, 0xffff00);
      scene.add(boxHelper);
      
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
      clippingPlanes[0].constant = 1;
    } else if (localY < 3) {
      clippingPlanes[0].constant = 2;
    } else if (localY < 4) {
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
  if (event.code === 'Space') {
    if (!hotelModel) return;

    hotelModel.traverse((child) => {
      if (child.isMesh) {
        child.visible = true;

        if (Array.isArray(child.material)) {
          child.material.forEach((m) => {
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

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
scene.add(luzAmbiente);
for(let cont = 0; cont < luzesPonto.length; cont++){
  scene.add(luzesPonto[cont]);
}
camera.position.set(4.5,8.13,14.5);
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();

  renderer.render(scene, camera);
};

animate();
