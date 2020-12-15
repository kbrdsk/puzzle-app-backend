const height = 768;
const width = 1024;
const unitLength = 100;
const selectionProximity = 20;
const objectiveCenter = { x: 300, y: 384 };
const startingCenter = { x: 768, y: 384 };
const triangle = [
	[-2 * Math.sqrt(2), +Math.sqrt(2)],
	[2 * Math.sqrt(2), +Math.sqrt(2)],
	[0, -Math.sqrt(2)],
];
const square = [
	[-Math.sqrt(2), -Math.sqrt(2)],
	[Math.sqrt(2), -Math.sqrt(2)],
	[Math.sqrt(2), Math.sqrt(2)],
	[-Math.sqrt(2), Math.sqrt(2)],
];
const objectives = {
	triangle: [triangle],

	rectangle: [
		[
			[-2, 1],
			[-2, -1],
			[2, -1],
			[2, 1],
		],
	],

	trapezoid: [
		[
			[-3, 1],
			[-1, -1],
			[1, -1],
			[3, 1],
		],
	],

	twotriangles: [
		triangle.map(([x, y]) => [x / Math.sqrt(2), y / Math.sqrt(2) + 1.2]),
		triangle.map(([x, y]) => [x / Math.sqrt(2), y / Math.sqrt(2) - 1.2]),
	],

	twosquares: [
		square.map(([x, y]) => [
			x / Math.sqrt(2) + 1.2,
			y / Math.sqrt(2) + 1.2,
		]),
		square.map(([x, y]) => [
			x / Math.sqrt(2) - 1.2,
			y / Math.sqrt(2) - 1.2,
		]),
	],

	cube: [
		[
			[-3 / 2, 3 / 2],
			[-3 / 2, -1 / 2],
			[-1 / 2, -3 / 2],
			[3 / 2, -3 / 2],
			[3 / 2, 1 / 2],
			[1 / 2, 3 / 2],
		],
	],

	hexagon: [
		[
			[-1, 3 / 2],
			[-1, -3 / 2],
			[0, -5 / 2],
			[1, -3 / 2],
			[1, 3 / 2],
			[0, 5 / 2],
		],
	],

	incompleterectangle: [
		[
			[-Math.sqrt(2), 3 / 2],
			[-Math.sqrt(2), -3 / 2],
			[Math.sqrt(2), -3 / 2],
			[Math.sqrt(2), 3 / 2],
			[Math.sqrt(2) - 1, 1 / 2],
			[Math.sqrt(2) - 1, -1 / 2],
			[0, -3 / 2 + Math.sqrt(2)],
			[-Math.sqrt(2) + 1, -1 / 2],
			[-Math.sqrt(2) + 1, 1 / 2],
			[0, 3 / 2 - Math.sqrt(2)],
			[Math.sqrt(2), 3 / 2],
		],
	],
};

const puzzleArray = [
	{ puzzleId: "triangle", title: "Triangle" },
	{ puzzleId: "rectangle", title: "Rectangle" },
	{ puzzleId: "trapezoid", title: "Trapezoid" },
	{ puzzleId: "twotriangles", title: "Two Triangles" },
	{ puzzleId: "twosquares", title: "Two Squares" },
	{ puzzleId: "cube", title: "Cube" },
	{ puzzleId: "hexagon", title: "Hexagon" },
	{ puzzleId: "incompleterectangle", title: "Incomplete Rectangle" },
];

module.exports.defaults = puzzleArray.map(({ puzzleId, title }) => {
	return {
		puzzleId,
		objective: objectives[puzzleId],
		startingCenter,
		unitLength,
		height,
		width,
		selectionProximity,
		objectiveCenter,
		title,
		work: {},
		puzzleName: "tangram",
		populateID: randomString(7),
		default: true,
	};
});

function randomString(length) {
	var text = "";
	var possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
