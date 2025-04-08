import * as THREE from 'three';
import { BoxGeometry, CylinderGeometry, Color, Mesh, MeshBasicMaterial } from 'three';

const EXCESS = 3000;

const PITCH_WIDTH = 70 + EXCESS;
const PITCH_LENGTH = 100 + EXCESS;
const PITCH_DEPTH = 1;
const IN_GOAL_LENGTH = 10;

export function pitch(width = PITCH_WIDTH, length = PITCH_LENGTH, inGoal = IN_GOAL_LENGTH) {
	const pitchLength = +length + +inGoal + +inGoal;
	const geometry = new BoxGeometry(width + 5, PITCH_DEPTH, pitchLength + 5);
	const material = new MeshBasicMaterial({ color: new Color('#497d00') });
	const grass = new Mesh(geometry, material);
	grass.position.set(0, -0.5, 0);
	grass.receiveShadow = true;
	grass.name = 'grass';
	return grass;
}

const GOAL_POST_HEIGHT = 17;
const GOAL_POST_DIAMETER = 0.12;
const GOAL_POST_DISTANCE = 5.6;

export function goalPost() {
	const leftPost = createPost();
	leftPost.position.set(
		-(GOAL_POST_DISTANCE / 2) + GOAL_POST_DIAMETER / 2,
		GOAL_POST_HEIGHT / 2,
		0,
	);
	const leftPostProtector = createPostProtector();
	leftPostProtector.position.set(-(GOAL_POST_DISTANCE / 2) + GOAL_POST_DIAMETER / 2, 1, 0);

	const rightPost = createPost();
	rightPost.position.set(GOAL_POST_DISTANCE / 2 + GOAL_POST_DIAMETER / 2, GOAL_POST_HEIGHT / 2, 0);
	const rightPostProtector = createPostProtector();
	rightPostProtector.position.set(GOAL_POST_DISTANCE / 2 + GOAL_POST_DIAMETER / 2, 1, 0);
	const crossbar = createCrossbar();
	crossbar.position.set(0, 3, 0);
	crossbar.rotation.z = Math.PI / 2;

	const group = new THREE.Group();
	group.add(leftPost);
	group.add(leftPostProtector);
	group.add(rightPost);
	group.add(rightPostProtector);
	group.add(crossbar);
	return group;
}

function createCrossbar() {
	const geometry = new THREE.CylinderGeometry(0.09, 0.09, 5.6);
	const material = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffffff') });
	const crossbar = new THREE.Mesh(geometry, material);
	return crossbar;
}

function createPostProtector() {
	const geometry = new BoxGeometry(0.51, 2, 0.51);
	const material = new MeshBasicMaterial({ color: new Color('#111C4E') });
	return new Mesh(geometry, material);
}

function createPost() {
	const geometry = new CylinderGeometry(GOAL_POST_DIAMETER, GOAL_POST_DIAMETER, GOAL_POST_HEIGHT);
	const material = new MeshBasicMaterial({ color: new THREE.Color('#ffffff') });
	return new Mesh(geometry, material);
}
