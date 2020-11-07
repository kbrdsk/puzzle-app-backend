require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");

const Student = require("../models/student");
const puzzles = require("../models/puzzles/index");

const apiRouter = express.Router();

const { ObjectID } = require("mongodb");

apiRouter.post("/students", async (req, res) => {
	try {
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
	} catch (error) {
		console.log(error);
		res.status(500).send();
	}
});
apiRouter.get("/students", verifyInstructorPW, async (req, res) => {
	try {
		const findResult = await Student.find({}, "first last").exec();
		const students = findResult.map((student) => {
			return { first: student.first, last: student.last };
		});
		res.send(students);
	} catch (error) {
		console.log(error);
		res.status(500).send();
	}
});

apiRouter.post("/students/login", async (req, res) => {
	try {
		const first = req.body.first.toLowerCase();
		const last = req.body.last.toLowerCase();
		const student = await Student.findOne({ first, last });
		if (!student) {
			res.status(404).send("Student not found.");
		} else {
			const token = jwt.sign({ student }, process.env.JWTSECRET);
			res.json({ token });
		}
	} catch (error) {
		console.log(error);
		res.status(500).send();
	}
});

apiRouter.get(
	"/students/:studentID/activepuzzle",
	verifyInstructorPW,
	async (req, res) => {
		try {
			const [, first, last] = req.params.studentID.match(/^(.*)_(.*)$/);
			const student = await Student.findOne({ first, last });
			if (!student) {
				res.status(404).send("Student not found.");
			} else {
				const { puzzleName, puzzleId } = student.activepuzzle;
				if (!puzzleName || !puzzleId)
					res.json({ puzzleName, puzzleId });
				else {
					const puzzle = await getPuzzle(
						puzzleName,
						puzzleId,
						student
					);
					const puzzleData = Object.assign(
						{ puzzleName },
						puzzle._doc
					);
					res.json(puzzleData);
				}
			}
		} catch (error) {
			console.log(error);
			res.status(500).send();
		}
	}
);

apiRouter.get(
	"/students/:studentID/:puzzleName/:puzzleId",
	verifyInstructorPW,
	async (req, res) => {
		try {
			const { puzzleName, puzzleId, studentID } = req.params;
			const [, first, last] = studentID.match(/^(.*)_(.*)$/);
			const student = await Student.findOne({ first, last });
			if (!student) {
				res.status(404).send("Student not found.");
			} else {
				const puzzle = await getPuzzle(puzzleName, puzzleId, student);
				const puzzleData = Object.assign({ puzzleName }, puzzle._doc);
				res.json(puzzleData);
			}
		} catch (error) {
			console.log(error);
			res.status(500).send();
		}
	}
);

apiRouter.put("/activepuzzle", verifyToken, async (req, res) => {
	try {
		const student = await Student.findOne({ _id: req.student._id });
		if (!student) {
			console.log("Student not found.");
			res.status(404).send();
		} else {
			const { puzzleName, puzzleId } = req.body;
			student.activepuzzle = { puzzleName, puzzleId };
			await student.save();
			res.sendStatus(200);
		}
	} catch (error) {
		console.log(error);
		res.status(500).send();
	}
});
apiRouter.delete("/activepuzzle", verifyToken, async (req, res) => {
	try {
		const student = await Student.findOne({ _id: req.student._id });
		if (!student) {
			console.log("Student not found.");
			res.status(404).send();
		} else {
			student.activepuzzle = { puzzleName: null, puzzleId: null };
			await student.save();
			res.sendStatus(200);
		}
	} catch (error) {
		console.log(error);
		res.status(500).send();
	}
});

apiRouter.get("/puzzles/:puzzleName", verifyToken, async (req, res) => {
	try {
		const { puzzleName } = req.params;
		const defaults = await puzzles[puzzleName].find({ default: true });
		const puzzleList = defaults.map((puzzle) => puzzle.puzzleId);
		res.json(puzzleList);
	} catch (error) {
		console.log(error);
		res.status(500).send();
	}
});
apiRouter.get(
	"/puzzles/:puzzleName/:puzzleId",
	verifyToken,
	async (req, res) => {
		try {
			const { puzzleName, puzzleId } = req.params;
			const student = await Student.findOne({ _id: req.student._id });
			if (!student) {
				res.status(404).send("Student not found.");
			} else {
				const puzzle = await getPuzzle(puzzleName, puzzleId, student);
				res.json(puzzle);
			}
		} catch (error) {
			console.log(error);
			res.status(500).send();
		}
	}
);
apiRouter.put(
	"/puzzles/:puzzleName/:puzzleId",
	verifyToken,
	async (req, res) => {
		try {
			const { puzzleName, puzzleId } = req.params;
			const student = await Student.findOne({ _id: req.student._id });
			if (!student) {
				res.status(404).send("Student not found.");
			}
			let puzzle = await getPuzzle(puzzleName, puzzleId, student);
			puzzle = await puzzles[puzzleName].findByIdAndUpdate(
				puzzle._id,
				{ work: req.body.puzzleData },
				{ new: true }
			);
			res.json(puzzle);
		} catch (error) {
			console.log(error);
			res.status(500).send();
		}
	}
);

function verifyToken(req, res, next) {
	try {
		req.student = jwt.verify(
			req.headers.authorization,
			process.env.JWTSECRET
		).student;
		next();
	} catch (error) {
		console.log(error);
		res.status(403).send();
	}
}

function verifyInstructorPW(req, res, next) {
	if (req.headers.authorization === process.env.INSTRUCTOR_PW) next();
	else res.status(403).send();
}

async function getPuzzle(puzzleName, puzzleId, student) {
	const Puzzle = puzzles[puzzleName];
	let puzzle = await Puzzle.findOne({
		puzzleId,
		student: student._id,
	});
	if (!puzzle) {
		puzzle = await Puzzle.findOne({
			puzzleId,
			default: true,
		});
		puzzle._id = new ObjectID();
		puzzle.student = student._id;
		puzzle.default = false;
		puzzle.isNew = true;
		await puzzle.save();
	}

	return puzzle;
}

module.exports = apiRouter;
