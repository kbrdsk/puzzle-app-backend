require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");

const Student = require("../models/student");
const puzzles = require("../models/puzzles/index");

const apiRouter = express.Router();

apiRouter.post("/students", async (req, res) => {
	const studentData = {
		first: req.body.first.toLowerCase(),
		last: req.body.last.toLowerCase(),
	};
	if (await Student.findOne(studentData)) {
		res.sendStatus(403);
	} else {
		const student = new Student(studentData);
		student.save();
		const token = jwt.sign({ student }, process.env.JWTSECRET);
		res.json({ token });
	}
});

apiRouter.post("/students/login", async (req, res) => {
	const first = req.body.first.toLowerCase();
	const last = req.body.last.toLowerCase();
	const student = await Student.findOne({ first, last });
	if (!student) {
		res.status(404).send();
	} else {
		const token = jwt.sign({ student }, process.env.JWTSECRET);
		res.json({ token });
	}
});

apiRouter.get(
	"/puzzles/:puzzleName/:puzzleId",
	verifyToken,
	async (req, res) => {
		const { puzzleName, puzzleId } = req.params;
		const student = await Student.findOne(req.student);
		if (!student) res.status(404).send();
		else {
			let puzzle = await puzzles[puzzleName].Puzzle.findOne({
				puzzleId: puzzleId,
				student: student._id,
			});
			if (!puzzle) {
				puzzle = await puzzles[puzzleName].defaults[puzzleId](student);
				await puzzle.save();
			}
			res.json(puzzle);
		}
	}
);
apiRouter.put(
	"/puzzles/:puzzleName/:puzzleId",
	verifyToken,
	async (req, res) => {
		const { puzzleName, puzzleId } = req.params;
		const student = await Student.findOne(req.student);
		if (!student) return res.status(404).send();
		let puzzle = await puzzles[puzzleName].Puzzle.findOne({
			puzzleId,
			student: student._id,
		});
		if (!puzzle) {
			puzzle = await puzzles[puzzleName].defaults[puzzleId](student);
			await puzzle.save();
		}
		puzzle = await puzzles[puzzleName].Puzzle.findByIdAndUpdate(
			puzzle._id,
			{ work: req.body.puzzleData },
			{ new: true }
		);
		res.json(puzzle);
	}
);

function verifyToken(req, res, next) {
	try {
		req.student = jwt.verify(
			req.headers.authorization,
			process.env.JWTSECRET
		).student;
		next();
	} catch {
		res.status(403).send();
	}
}

module.exports = apiRouter;
