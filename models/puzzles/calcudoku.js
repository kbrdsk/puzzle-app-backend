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
	student: { type: Schema.Types.ObjectId, ref: "Student" },
	work: [
		{
			col: { type: Number, required: true },
			row: { type: Number, required: true },
			value: Number,
		},
	],
	source: String,
	default: Boolean,
	hasCompleted: Boolean,
});

module.exports = mongoose.model("Calcudoku", PuzzleSchema);
