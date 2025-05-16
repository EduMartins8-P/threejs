import * as THREE from 'three';

const formatoCoracao = new THREE.Shape();
formatoCoracao.bezierCurveTo(0, 2, -2, 2, -2, 0);
formatoCoracao.bezierCurveTo(-2, -2, 0, -3, 0, -3.5);
formatoCoracao.bezierCurveTo(0, -3, 2, -2, 2, 0);
formatoCoracao.bezierCurveTo(2, 2, 0, 2, 0, 0);

const extrudar = {
  depth: 0.5,           
  bevelEnabled: true, 
  bevelThickness: 0.05,
  bevelSize: 0.2,
  bevelSegments: 5
};

const geometriaCoracao = new THREE.ExtrudeGeometry(formatoCoracao, extrudar);
const coracao = new THREE.Mesh(geometriaCoracao, new THREE.MeshPhongMaterial({ color: 'red' }));

geometriaCoracao.center();

coracao.scale.y = 0.7;

coracao.position.copy(new THREE.Vector3(2,2,2));
coracao.scale.set(0.8, 0.8 * coracao.scale.y , 0.8);



export {coracao};