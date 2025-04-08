import { Vector3 } from 'three';

export default function (camera, position, controls) {
	switch (position) {
		case 1:
			camera.position.set(0, 2, -5);
			camera.setFocalLength(30);
			setControlTarget(36, 1, 0);
			break;
		case 2:
			camera.position.set(40, 40, 0);
			camera.setFocalLength(30);
			setControlTarget(36, 1, 0);
			break;
		case 3:
			camera.position.set(0, 2, 72);
			camera.setFocalLength(100);
			setControlTarget(36, 1, 0);
			break;
		case 4:
			camera.position.set(50, 2.5, 0);
			camera.setFocalLength(50);
			setControlTarget(15, 1.0, 0);
			break;
		case 5:
			camera.position.set(40, 3, 0);
			camera.setFocalLength(15);
			setControlTarget(15, 0, 0);
			break;
		case 6:
			camera.position.set(40, 1, 0);
			camera.setFocalLength(45);
			setControlTarget(36, 1, 0);
			break;
		case 7:
			camera.position.set(30, 1, 0);
			camera.setFocalLength(45);
			setControlTarget(36, 1, 0);
			break;
		default:
			camera.position.set(35, 2, -30);
			camera.setFocalLength(40);
			setControlTarget(36, 1, 0);
	}

	function setControlTarget(x, y, z) {
		if (controls) {
			controls.target = new Vector3(x, y, z);
		}
	}
}
