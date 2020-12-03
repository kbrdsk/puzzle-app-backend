const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PuzzleSchema = new Schema({
	puzzleId: { type: String, required: true },
	title: { type: String, required: true },
	startingConfiguration: [
		[
			{
				x: { type: Number, required: true },
				y: { type: Number, required: true },
			},
		],
	],
	student: { type: Schema.Types.ObjectId, ref: "Student" },
	work: [
		[
			{
				x: { type: Number, required: true },
				y: { type: Number, required: true },
			},
		],
	],
	height: Number,
	width: Number,
	selectionProximity: Number,
	stickLength: Number,
	stickWidth: Number,
	offset: Number,
	description: String,
	source: String,
	default: Boolean,
	hasCompleted: Boolean,
});

module.exports = mongoose.model("Matchstick", PuzzleSchema);
