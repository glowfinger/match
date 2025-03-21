import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export function create() {
	const top = 70;
	const bottom = -70;
	const left = -70;
	const right = 70;
	const near = 0.1;
	const far = 500;

	const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
	camera.name = 'mainCamera';
	camera.position.set(50, 50, 0);
	camera.lookAt(0, 0, 0);

	return camera;
}
