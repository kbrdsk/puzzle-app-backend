const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkSchema = { solved: { type: Boolean } };

const PuzzleSchema = new Schema({
	//puzzle info e.g. size for calcudoku
	puzzleId: { type: String, required: true },
	title: { type: String, required: true },
	student: { type: Schema.Types.ObjectId, ref: "Student" },
	work: WorkSchema,
	default: Boolean,
});

module.exports = mongoose.model("TestPuzzle", PuzzleSchema);
