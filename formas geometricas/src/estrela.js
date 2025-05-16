import * as THREE from 'three';

const formatoEstrela = new THREE.Shape();
const pontas = 5;
const raioExterno = 1;
const raioInterno = 0.5;

for (let i = 0; i < pontas * 2; i++) {
  const angulo = (i / (pontas * 2)) * Math.PI * 2;
  const raio = i % 2 === 0 ? raioExterno : raioInterno;
  const x = Math.cos(angulo) * raio;
  const y = Math.sin(angulo) * raio;

  if (i === 0) {
    formatoEstrela.moveTo(x, y);
  } else {
    formatoEstrela.lineTo(x, y);
  }
}
formatoEstrela.closePath();

const extrudar = {
  depth: 0.5,
  bevelEnabled: true,
  bevelThickness: 0.1,
  bevelSize: 0.2,
  bevelSegments: 0.5
};

const geometriaEstrela = new THREE.ExtrudeGeometry(formatoEstrela, extrudar);
const estrela = new THREE.Mesh(geometriaEstrela, new THREE.MeshLambertMaterial({ color: "#D3D3D3" }));

estrela.position.copy(new THREE.Vector3(5,1,1));
geometriaEstrela.center();

export {estrela};