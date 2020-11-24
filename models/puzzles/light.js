const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PuzzleSchema = new Schema({
	puzzleId: { type: String, required: true },
	title: { type: String, required: true },
	beginstate: [
		{
			col: { type: Number, required: true },
			row: { type: Number, required: true },
		},
	],
	size: {
		cols: { type: Number, required: true },
		rows: { type: Number, required: true },
	},
	student: { type: Schema.Types.ObjectId, ref: "Student" },
	work: [
		{
			col: { type: Number, required: true },
			row: { type: Number, required: true },
		},
	],
	source: String,
	default: Boolean,
});

module.exports = mongoose.model("Light", PuzzleSchema);
