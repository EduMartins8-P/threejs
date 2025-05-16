import * as THREE from 'three';

const raioExterno = 1;
const raioInterno = 0.7;

const formatoAnel = new THREE.Shape();
formatoAnel.absarc(0, 0, raioExterno, 0, Math.PI * 2, false);

const buraco = new THREE.Path();
buraco.absarc(0, 0, raioInterno, 0, Math.PI * 2, true);
formatoAnel.holes.push(buraco);

const extrudar = {
  depth: 0.3,
  bevelEnabled: true,
  bevelThickness: 0.1,
  bevelSize: 0.1,
  bevelSegments: 5
};

const geometriaAnel = new THREE.ExtrudeGeometry(formatoAnel, extrudar);
const materialAnel = new THREE.MeshStandardMaterial({
  color: 'yellow',
  roughness: '0.01',
  metalness: '0.6'
});
const anel = new THREE.Mesh(geometriaAnel, materialAnel);

anel.position.copy(new THREE.Vector3(1,1,5));
geometriaAnel.center();

export {anel};
