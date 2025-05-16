import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {coracao} from './coracao.js';
import { anel } from './anel.js';
import { estrela } from './estrela.js';
import { luzAmbiente, luzesPonto } from './iluminacao.js';



const scene = new THREE.Scene();
const axesHelpers = [];
const objetos = new THREE.Group();



for (let cont = 0; cont < 5; cont++) {
  const helper = new THREE.AxesHelper(5);
  axesHelpers.push(helper);
}




objetos.add(coracao, anel, estrela);
objetos.position.y += 1;
objetos.scale.setScalar(0.8);
objetos.children.forEach(child =>{
  //child.material.wireframe = true;
});
for(let cont = 0; cont < objetos.children.length; cont++){
  axesHelpers[cont + 1].scale.setScalar(0.5);
  objetos.children[cont].add(axesHelpers[cont + 1]);
}



const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.copy(new THREE.Vector3(7,7,7));



const canvas = document.querySelector('canvas.threejs')
const renderer = new THREE.WebGLRenderer({canvas:canvas})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));



const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true



scene.add(objetos);
scene.add(axesHelpers[0]);
scene.add(luzAmbiente);
for(let cont = 0; cont < luzesPonto.length; cont++){
  scene.add(luzesPonto[cont]);
}
scene.background = new THREE.Color("#301934");



window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})



const rotacionar = () => {
  coracao.rotation.x += 0.04
  coracao.rotation.y += 0.06

  anel.rotation.x -= 0.05
  anel.rotation.y -= 0.03

  estrela.rotation.x += 0.05
  estrela.rotation.y -= 0.03

  //controls.autoRotate = true
  controls.autoRotateSpeed = 10
}



const renderloop = () => {
  controls.update();
  window.requestAnimationFrame(renderloop)
  renderer.render(scene, camera)
  rotacionar();
}
renderloop();

