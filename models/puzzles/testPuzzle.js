const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkDataSchema = new Schema({ solved: { type: Boolean } });

const PuzzleSchema = new Schema({
	//puzzle info e.g. size for calcudoku
	puzzleId: { type: String, required: true },
	title: { type: String, required: true },
	student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
	workData: WorkDataSchema,
});

const Puzzle = mongoose.model("TestPuzzle", PuzzleSchema);

const defaults = {
	0: (student) =>
		Puzzle({
			puzzleId: "0",
			title: "Sample",
			student: student._id,
			workData: { solved: false },
		}),
};

module.exports = { Puzzle, defaults };
