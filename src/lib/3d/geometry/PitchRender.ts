import * as THREE from 'three';
import { goalPost, pitch } from './Pitch';
import pitchMarkings from './PitchMarkings';
import { CSS2DObject, CSS2DRenderer, OrbitControls } from 'three/examples/jsm/Addons.js';
import * as Camera from '$lib/3d/geometry/Camera';

import tailwindColors from 'tailwindcss/colors';

type Stat = {
	channel: string;
	zone: string;
	team: string;
	kept: number;
	lost: number;
	count: number;
	times: number[];
};

const camera = Camera.create();
const labelRenderer = new CSS2DRenderer();
const scene = new THREE.Scene();
const controls = new OrbitControls(camera, labelRenderer.domElement);
const BACKGROUND_COLOUR = tailwindColors.gray[100];

export default function pitchRender(canvas: HTMLCanvasElement, div: HTMLElement, stats: Stat[]) {
	scene.background = new THREE.Color(BACKGROUND_COLOUR);

	canvas.width = 1080;
	canvas.height = 1080;
	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		canvas,
		preserveDrawingBuffer: true,
	});

	// const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
	// camera.position.set(0, 20, 100);

	//controls.update() must be called after any manual changes to the camera's transform

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setAnimationLoop(animate);

	labelRenderer.setSize(div.clientWidth, div.clientHeight);
	labelRenderer.domElement.style.position = 'absolute';
	labelRenderer.domElement.style.top = '0px';
	labelRenderer.domElement.style.pointerEvents = 'none';
	div.appendChild(labelRenderer.domElement);

	scene.add(pitch());
	scene.add(pitchMarkings());

	const defending = goalPost();
	defending.position.set(0, 0, 100 / 2);
	defending.name = 'awayGoalPost';

	const attacking = goalPost();
	attacking.position.set(0, 0, -(100 / 2));
	attacking.name = 'homeGoalPost';
	scene.add(defending);
	scene.add(attacking);

	const light1 = new THREE.DirectionalLight(0xffffff, 2.5);
	light1.position.set(50, 50, 50);
	scene.add(light1);

	const light2 = new THREE.DirectionalLight(0xffffff, 1.5);
	light2.position.set(-50, -50, 50);
	scene.add(light2);

	addLabels(scene, stats);

	// renderer.render(scene, camera);
	// labelRenderer.render(scene, camera);

	controls.listenToKeyEvents(window);
	controls.autoRotate = true;

	function animate() {
		// requestAnimationFrame(animate);

		// required if controls.enableDamping or controls.autoRotate are set to true
		controls.update();

		renderer.render(scene, camera);
		labelRenderer.render(scene, camera);
	}
}

function addLabels(scene: THREE.Scene, stats: Stat[]) {
	const positions = [
		{ w: 14, h: 22, z: 39, x: -28 },
		{ w: 14, h: 22, z: 39, x: -14 },
		{ w: 14, h: 22, z: 39, x: 0 },
		{ w: 14, h: 22, z: 39, x: 14 },
		{ w: 14, h: 22, z: 39, x: 28 },
		{ w: 14, h: 28, z: 14, x: -28 },
		{ w: 14, h: 28, z: 14, x: -14 },
		{ w: 14, h: 28, z: 14, x: 0 },
		{ w: 14, h: 28, z: 14, x: 14 },
		{ w: 14, h: 28, z: 14, x: 28 },
		{ w: 14, h: 28, z: -14, x: -28 },
		{ w: 14, h: 28, z: -14, x: -14 },
		{ w: 14, h: 28, z: -14, x: 0 },
		{ w: 14, h: 28, z: -14, x: 14 },
		{ w: 14, h: 28, z: -14, x: 28 },
		{ w: 14, h: 22, z: -39, x: -28 },
		{ w: 14, h: 22, z: -39, x: -14 },
		{ w: 14, h: 22, z: -39, x: 0 },
		{ w: 14, h: 22, z: -39, x: 14 },
		{ w: 14, h: 22, z: -39, x: 28 },
	];

	const zones = ['A', 'B', 'C', 'D'].reverse();

	// positions.forEach((position, i) => {
	// 	const zoneI = Math.floor(i / 5);

	// 	const { z, x } = position;
	// 	const p = document.createElement('p');
	// 	p.textContent = `${zones[zoneI]}${(i % 5) + 1}`;
	// 	p.className = 'text-black font-bold';

	// 	const label = new CSS2DObject(p);
	// 	label.position.set(x, 0, z);
	// 	scene.add(label);
	// });

	positions.forEach((position, i) => {
		const zoneI = Math.floor(i / 5);

		const key = {
			zone: (zoneI + 1).toString(),
			channel: ((i % 5) + 1).toString(),
		};

		const stat = stats.find((stat) => stat.zone === key.zone && stat.channel === key.channel);

		const p = document.createElement('p');
		p.className = 'text-black text-xs font-bold';
		p.innerHTML = '0/0';
		if (stat) {
			p.innerHTML = `${stat.kept}/${stat.lost}`;
		}

		const { z, x } = position;

		const label = new CSS2DObject(p);
		label.position.set(x, 0, z);
		scene.add(label);
	});
}
