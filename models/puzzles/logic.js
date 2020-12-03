 
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PuzzleSchema = new Schema({
	puzzleId: { type: String, required: true },
	title: { type: String, required: true },
	student: { type: Schema.Types.ObjectId, ref: "Student" },
	work: String,
  description: String,
	source: String,
	default: Boolean,
	completed: Boolean,
});

module.exports = mongoose.model("Logic", PuzzleSchema);
