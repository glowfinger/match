import * as THREE from 'three';

const IN_GOAL_LENGTH = 10;

const LINE_THICKNESS = 0.2;

const vertical10MeterLines = [-30, -20, 20, 30];

const material = new THREE.MeshBasicMaterial({
	color: new THREE.Color('#fff'),
	side: THREE.FrontSide,
});

export default function () {
	const group = new THREE.Group();
	group.add(createHalfwayLine());
	group.add(createAttackingGoalLine());
	group.add(createAttacking22MetreLine());
	group.add(createDefendingGoalLine());
	group.add(createDefending22MetreLine());
	group.add(createAttackingDeadBallLine());
	group.add(createDefendingDeadBallLine());
	group.add(createLeftTouchline());
	group.add(createRightTouchline());
	group.add(createKickMark());
	group.add(createAttacking10MetreLine());
	group.add(createDefending10MetreLine());
	group.add(createVerticalDashedLines());
	group.add(createAttacking5MetreLine());
	group.add(createDefending5MetreLine());
	group.add(createZones());

	group.name = 'pitchMarkings';
	return group;
}

function createHalfwayLine() {
	const line = createFullHorizontalLine();
	line.name = 'halfwayLine';
	return line;
}

function createAttackingGoalLine() {
	const line = createFullHorizontalLine();
	line.position.z = 50;
	line.name = 'attackingGoalLine';
	return line;
}

function createAttacking22MetreLine() {
	const line = createFullHorizontalLine();
	line.position.z = 50 - 22;
	line.name = 'attacking22MetreLine';
	return line;
}

function createAttackingDeadBallLine() {
	const line = createFullHorizontalLine();
	line.position.z = 50 + IN_GOAL_LENGTH;
	line.name = 'attackingDeadBallLine';
	return line;
}

function createDefending22MetreLine() {
	const line = createFullHorizontalLine();
	line.position.z = -50 + 22;
	line.name = 'defending22MetreLine';
	return line;
}

function createDefendingGoalLine() {
	const line = createFullHorizontalLine();
	line.position.z = -50;
	line.name = 'fullHorizontalLine';
	return line;
}

function createDefendingDeadBallLine() {
	const line = createFullHorizontalLine();
	line.position.z = -50 - IN_GOAL_LENGTH;
	line.name = 'fullHorizontalLine';
	return line;
}

function createFullHorizontalLine() {
	const geometry = new THREE.PlaneGeometry(70, LINE_THICKNESS);
	const plane = new THREE.Mesh(geometry, material);
	plane.rotation.x = -Math.PI / 2;
	plane.position.y = 0.01;
	return plane;
}

function createLeftTouchline() {
	const line = createFullVerticalLine();
	line.position.x = -35;
	return line;
}

function createRightTouchline() {
	const line = createFullVerticalLine();
	line.position.x = 35;
	return line;
}

function createFullVerticalLine() {
	const geometry = new THREE.PlaneGeometry(LINE_THICKNESS, 120);
	const plane = new THREE.Mesh(geometry, material);
	plane.rotation.x = -Math.PI / 2;
	plane.position.y = 0.01;
	return plane;
}

function createDefending10MetreLine() {
	const group = new THREE.Group();

	const horizontals = [-30, -20, -10, 0, 10, 20, 30];

	horizontals.forEach((position) => {
		const dash = dashedHorizontalLine();
		dash.position.z = -10;
		dash.position.x = position;
		group.add(dash);
	});

	return group;
}

function createAttacking10MetreLine() {
	const group = new THREE.Group();

	const positions = [-30, -20, -10, 0, 10, 20, 30];

	positions.forEach((position) => {
		const dash = dashedHorizontalLine();
		dash.position.z = 10;
		dash.position.x = position;
		group.add(dash);
	});

	return group;
}

function createAttacking5MetreLine() {
	const group = new THREE.Group();

	const positions = [-30, -20, -5, 5, 20, 30];

	positions.forEach((position) => {
		const dash = dashedHorizontalLine();
		dash.position.z = 45;
		dash.position.x = position;
		group.add(dash);
	});

	return group;
}

function createDefending5MetreLine() {
	const group = new THREE.Group();

	const positions = [-30, -20, -5, 5, 20, 30];

	positions.forEach((position) => {
		const dash = dashedHorizontalLine();
		dash.position.z = -45;
		dash.position.x = position;
		group.add(dash);
	});

	return group;
}

function createVerticalDashedLines() {
	const group = new THREE.Group();
	const positions = [42.5, 28, 10, 0, -10, -28, -42.5];

	positions.forEach((position) => {
		const dash = createVerticalDashedRow(position);
		group.add(dash);
	});

	return group;
}

function createVerticalDashedRow(linePosition) {
	const group = new THREE.Group();
	vertical10MeterLines.forEach((position) => {
		const dash = dashedVerticalLine();
		dash.position.z = linePosition;
		dash.position.x = position;
		group.add(dash);
	});
	return group;
}

function dashedHorizontalLine() {
	const geometry = new THREE.PlaneGeometry(5, LINE_THICKNESS);
	const plane = new THREE.Mesh(geometry, material);
	plane.rotation.x = -Math.PI / 2;
	plane.position.y = 0.01;
	return plane;
}

function dashedVerticalLine() {
	const geometry = new THREE.PlaneGeometry(LINE_THICKNESS, 5);
	const plane = new THREE.Mesh(geometry, material);
	plane.rotation.x = -Math.PI / 2;
	plane.position.y = 0.01;
	return plane;
}

function createKickMark() {
	const geometry = new THREE.PlaneGeometry(LINE_THICKNESS, 0.5);
	const plane = new THREE.Mesh(geometry, material);
	plane.rotation.x = -Math.PI / 2;
	plane.position.y = 0.01;
	return plane;
}

function createZones() {
	const group = new THREE.Group();

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

	const zoneColours = ['#e7000b', '#f54a00', '#ffdf20', '#bbf451'];

	positions.forEach((position, i) => {
		const colorI = Math.floor(i / 5);

		const material = new THREE.MeshBasicMaterial({
			color: new THREE.Color(zoneColours[colorI]),
			side: THREE.FrontSide,
			transparent: true,
			opacity: 0.45,
		});

		const { w, h, z, x } = position;

		const geometry = new THREE.PlaneGeometry(w - 0.5, h - 0.5);
		const plane = new THREE.Mesh(geometry, material);
		plane.rotation.x = -Math.PI / 2;
		plane.position.y = 0.01;
		plane.position.z = z;
		plane.position.x = x;

		group.add(plane);
	});

	// positions.forEach((position) => {
	// 	const material = new THREE.MeshBasicMaterial({
	// 		color: new THREE.Color('#000'),
	// 		side: THREE.FrontSide,
	// 	});

	// 	const { z, x } = position;

	// 	const geometry = new THREE.PlaneGeometry(0.5, 0.5);
	// 	const plane = new THREE.Mesh(geometry, material);
	// 	plane.rotation.x = -Math.PI / 2;
	// 	plane.position.y = 0.02;
	// 	plane.position.z = z;
	// 	plane.position.x = x;

	// 	group.add(plane);
	// });

	return group;
}
