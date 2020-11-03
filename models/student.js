const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
	first: { type: String, required: true },
	last: { type: String, required: true },
	activepuzzle: { puzzleName: String, puzzleId: String },
});

StudentSchema.virtual("url").get(function () {
	return `/students/${this.first}_${this.last}`;
});

module.exports = mongoose.model("Student", StudentSchema);
