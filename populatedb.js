const Student = require("./models/student");
const PuzzleIndex = require("./models/puzzles/index");
const calcudokuDefaults = require("./defaults/calcudoku").defaults;
const studentDefaults = require("./defaults/students").defaults;

module.exports.populateTestDB = async (mongoDB) => {
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

	const studentData = () => studentDefaults;

	const puzzleData = () => [...calcudokuDefaults];

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
};
