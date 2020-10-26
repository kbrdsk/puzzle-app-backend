const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkSchema = { solved: { type: Boolean } };

const PuzzleSchema = new Schema({
	//puzzle info e.g. size for calcudoku
	puzzleId: { type: String, required: true },
	title: { type: String, required: true },
	student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
	work: WorkSchema,
});

const Puzzle = mongoose.model("TestPuzzle", PuzzleSchema);

const defaults = {
	0: (student) =>
		Puzzle({
			puzzleId: "0",
			title: "Sample",
			student: student._id,
			work: { solved: false },
		}),
};

module.exports = { Puzzle, defaults };
