import * as THREE from 'three';

const luzAmbiente = new THREE.AmbientLight('white', 0.5);
const luzesPonto = [];

for (let i = 0; i < 4; i++) {
  const luz = new THREE.PointLight('white', 3);
  luzesPonto.push(luz);
}

luzesPonto[0].position.set(7,7,7);
luzesPonto[1].position.set(0,0,-1);
luzesPonto[2].position.set(0,2,6);
luzesPonto[3].position.set(1,2,5);


export { luzAmbiente, luzesPonto};