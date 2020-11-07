const Student = require("./models/student");
const PuzzleIndex = require("./models/puzzles/index");

module.exports.populateTestDB = async (cb, mongoDB) => {
	if (mongoDB) {
		const mongoose = require("mongoose");
		mongoose.connect(mongoDB, { useNewUrlParser: true });
		mongoose.Promise = global.Promise;
		const db = mongoose.connection;
		db.on(
			"error",
			console.error.bind(console, "MongoDB connection error:")
		);
	}

	const students = {};
	const puzzles = {};

	async function createStudent({ populateID, ...details }) {
		const student = new Student(details);
		try {
			await student.save();
			students[populateID] = student;
		} catch (err) {
			console.log(`Error Creating Student: ${err}`);
		}
	}

	async function createPuzzle({ populateID, puzzleName, ...details }) {
		const puzzle = new PuzzleIndex[puzzleName](details);
		try {
			await puzzle.save();
			puzzles[populateID] = puzzle;
		} catch (err) {
			console.log(`Error Creating Puzzle: ${err}`);
		}
	}

	const studentData = () => [
		/*
		{ populateID: "kabirdas", first: "kabirdas", last: "henry" },
		{ populateID: "naomi", first: "naomi", last: "henry" },*/
	];

	const puzzleData = () => [
		{
			default: true,
			puzzleName: "Test",
			populateID: "test-default",
			puzzleId: "0",
			title: "Sample",
			student: null,
			work: { solved: false },
		},
		{
			default: true,
			populateID: "calcudoku-1",
			puzzleName: "calcudoku",
			puzzleId: "sample",
			title: "Sample",
			student: null,
			work: [{ col: 0, row: 0, value: 1 }],
			size: 4,
			cages: [
				{
					operation: "+",
					result: 9,
					squares: [
						{ col: 0, row: 0 },
						{ col: 1, row: 0 },
						{ col: 1, row: 1 },
					],
				},
				{
					operation: "+",
					result: 8,
					squares: [
						{ col: 0, row: 1 },
						{ col: 0, row: 2 },
						{ col: 0, row: 3 },
					],
				},
				{
					operation: "",
					result: 1,
					squares: [{ col: 2, row: 0 }],
				},
				{
					operation: "-",
					result: 1,
					squares: [
						{ col: 1, row: 2 },
						{ col: 1, row: 3 },
					],
				},
				{
					operation: "+",
					result: 5,
					squares: [
						{ col: 2, row: 1 },
						{ col: 2, row: 2 },
					],
				},
				{
					operation: "-",
					result: 1,
					squares: [
						{ col: 2, row: 3 },
						{ col: 3, row: 3 },
					],
				},
				{
					operation: "+",
					result: 5,
					squares: [
						{ col: 3, row: 0 },
						{ col: 3, row: 1 },
					],
				},
				{
					operation: "",
					result: 2,
					squares: [{ col: 3, row: 2 }],
				},
			],
		},
		{
			default: true,
			populateID: "calcudoku-2",
			puzzleName: "calcudoku",
			puzzleId: "sample2",
			title: "Sample Two",
			student: null,
			work: [],
			size: 5,
			cages: [
				{
					operation: "+",
					result: 8,
					squares: [
						{ col: 0, row: 0 },
						{ col: 0, row: 1 },
					],
				},
				{
					operation: "+",
					result: 9,
					squares: [
						{ col: 1, row: 0 },
						{ col: 2, row: 0 },
					],
				},
				{
					operation: "+",
					result: 3,
					squares: [
						{ col: 1, row: 1 },
						{ col: 2, row: 1 },
					],
				},
				{
					operation: "+",
					result: 3,
					squares: [
						{ col: 3, row: 0 },
						{ col: 4, row: 0 },
					],
				},
				{
					operation: "",
					result: 5,
					squares: [{ col: 2, row: 2 }],
				},
				{
					operation: "+",
					result: 7,
					squares: [
						{ col: 0, row: 2 },
						{ col: 1, row: 2 },
					],
				},
				{
					operation: "+",
					result: 8,
					squares: [
						{ col: 3, row: 3 },
						{ col: 4, row: 3 },
					],
				},
				{
					operation: "+",
					result: 5,
					squares: [
						{ col: 1, row: 3 },
						{ col: 2, row: 3 },
					],
				},
				{
					operation: "+",
					result: 5,
					squares: [
						{ col: 1, row: 4 },
						{ col: 2, row: 4 },
					],
				},
				{
					operation: "+",
					result: 9,
					squares: [
						{ col: 3, row: 4 },
						{ col: 4, row: 4 },
					],
				},
				{
					operation: "+",
					result: 3,
					squares: [
						{ col: 0, row: 3 },
						{ col: 0, row: 4 },
					],
				},
				{
					operation: "+",
					result: 3,
					squares: [
						{ col: 3, row: 1 },
						{ col: 3, row: 2 },
					],
				},
				{
					operation: "+",
					result: 3,
					squares: [
						{ col: 4, row: 1 },
						{ col: 4, row: 2 },
					],
				},
			],
		},
	];

	try {
		await Promise.all(studentData().map(createStudent));
	} catch (err) {
		console.log(`Student creation error: ${err}`);
	}

	try {
		await Promise.all(puzzleData().map(createPuzzle));
	} catch (err) {
		console.log(`Puzzle creation error: ${err}`);
	}

	/*.then(
			() => {
				console.log(students);
				//return Promise.all(itemData().map(createItem));
			},
			() => 
		);*/
	/*.then(
			() => {
				console.log(items);
				return Promise.all(recipeData().map(createRecipe));
			},
			() => console.log("Item creation error")
		)*/
};
