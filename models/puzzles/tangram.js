const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShapeSchema = {
	center: {
		x: { type: Number },
		y: { type: Number },
	},
	angle: { type: Number },
};

const PuzzleSchema = new Schema({
	puzzleId: { type: String, required: true },
	title: { type: String, required: true },
	student: { type: Schema.Types.ObjectId, ref: "Student" },
	objective: [[[Number]]],
	work: {
		smallTriangle1: ShapeSchema,
		smallTriangle2: ShapeSchema,
		mediumTriangle: ShapeSchema,
		largeTriangle1: ShapeSchema,
		largeTriangle2: ShapeSchema,
		square: ShapeSchema,
		parallelogram: ShapeSchema,
	},
	startingCenter: {
		x: { type: Number, required: true },
		y: { type: Number, required: true },
	},
	objectiveCenter: {
		x: { type: Number, required: true },
		y: { type: Number, required: true },
	},
	unitLength: Number,
	height: Number,
	width: Number,
	selectionProximity: Number,
	source: String,
	default: Boolean,
	completed: Boolean,
});

module.exports = mongoose.model("Tangram", PuzzleSchema);
