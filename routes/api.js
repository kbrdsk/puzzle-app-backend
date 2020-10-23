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
	const [foundStudent] = await Student.find(studentData);
	if (foundStudent) {
		res.sendStatus(403);
	} else {
		const student = new Student(studentData);
		student.save();
		const token = jwt.sign({ student }, process.env.JWTSECRET);
		res.json({ student, token });
	}
});

apiRouter.post("/students/:studentId/login", async (req, res) => {
	const [, first, last] = req.params.studentId.match(/^(.*)_(.*)$/);
	const [student] = await Student.find({ first, last });
	const studentIsMatch =
		first === req.body.first.toLowerCase() &&
		last === req.body.last.toLowerCase();
	if (!student) {
		res.sendStatus(404);
	} else if (studentIsMatch) {
		const token = jwt.sign({ student }, process.env.JWTSECRET);
		res.json({ student, token });
	} else {
		res.sendStatus(403);
	}
});

apiRouter.get(
	"/students/:studentId/puzzles/:puzzleName/:puzzleId/data",
	verifyToken,
	async (req, res) => {
		const { student: studentData } = jwt.verify(
			req.token,
			process.env.JWTSECRET
		);
		verifyStudent(req, res, studentData);
		const [student] = await Student.find(studentData);
		if (!student) res.sendStatus(404);
		let [puzzle] = await puzzles[req.params.puzzleName].Puzzle.find({
			puzzleId: req.params.puzzleId,
			student: student._id,
		});
		if (!puzzle) {
			puzzle = await puzzles[req.params.puzzleName].defaults[
				req.params.puzzleId
			](student);
			await puzzle.save();
		}
		res.json({ data: puzzle.workData });
	}
);
apiRouter.put(
	"/students/:studentId/puzzles/:puzzleName/:puzzleId/data",
	verifyToken,
	async (req, res) => {
		try {
			const { student } = jwt.verify(req.token, process.env.JWTSECRET);
		} catch (err) {
			res.sendStatus(403);
		}
		verifyStudent(req, res, student);
		const [foundStudent] = await Student.find(student);
		if (!foundStudent) res.sendStatus(404);
	}
);

function verifyStudent(req, res, student) {
	const [, first, last] = req.params.studentId.match(/^(.*)_(.*)$/);
	if (student.first !== first || student.last !== last) res.sendStatus(403);
}

function verifyToken(req, res, next) {
	const bearerHeader = req.headers.authorization;
	if (bearerHeader) {
		const bearerToken = bearerHeader;
		req.token = bearerToken;
		next();
	} else {
		res.sendStatus(403);
	}
}

module.exports = apiRouter;
