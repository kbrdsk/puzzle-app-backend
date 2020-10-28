const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PuzzleSchema = new Schema({
	puzzleId: { type: String, required: true },
	title: { type: String, required: true },
	cages: [
		{
			operation: {
				type: String,
				enum: ["+", "-", "/", "*", ""],
			},
			squares: [
				{
					col: { type: Number, required: true },
					row: { type: Number, required: true },
				},
			],
			result: { type: Number, required: true },
		},
	],
	size: { type: Number, required: true, min: 4 },
	student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
	work: [
		{
			col: { type: Number, required: true },
			row: { type: Number, required: true },
			value: Number,
		},
	],
	source: String,
});

const Puzzle = mongoose.model("Calcudoku", PuzzleSchema);

const defaults = {
	sample: (student) =>
		Puzzle({
			puzzleId: "sample",
			title: "Sample",
			student: student._id,
			work: [],
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
		}),
};

module.exports = { Puzzle, defaults };
