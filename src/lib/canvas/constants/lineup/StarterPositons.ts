const ROW_Y1 = 220;
const ROW_Y2 = ROW_Y1 + 300;
const ROW_Y3 = ROW_Y2 + 300;

const PAGE_WIDTH = 0;

const COLUMN_X1 = PAGE_WIDTH + 60;
const COLUMN_X2 = PAGE_WIDTH + 160 + 60 + 15;
const COLUMN_X3 = PAGE_WIDTH + 320 + 90;
const COLUMN_X4 = PAGE_WIDTH + 480 + 90 + 15;
const COLUMN_X5 = PAGE_WIDTH + 640 + 60 + 60;

export default [
	{ x: COLUMN_X1, y: ROW_Y1, number: '1' },
	{ x: COLUMN_X3, y: ROW_Y1, number: '2' },
	{ x: COLUMN_X5, y: ROW_Y1, number: '3' },
	{ x: COLUMN_X2, y: ROW_Y2, number: '4' },
	{ x: COLUMN_X4, y: ROW_Y2, number: '5' },
	{ x: COLUMN_X1, y: ROW_Y3, number: '6' },
	{ x: COLUMN_X3, y: ROW_Y3, number: '8' },
	{ x: COLUMN_X5, y: ROW_Y3, number: '7' },
	{ x: COLUMN_X2, y: ROW_Y1, number: '9' },
	{ x: COLUMN_X4, y: ROW_Y1, number: '10' },
	{ x: COLUMN_X1, y: ROW_Y3, number: '11' },
	{ x: COLUMN_X2, y: ROW_Y2, number: '12' },
	{ x: COLUMN_X4, y: ROW_Y2, number: '13' },
	{ x: COLUMN_X5, y: ROW_Y3, number: '14' },
	{ x: COLUMN_X3, y: ROW_Y3, number: '15' },
];
