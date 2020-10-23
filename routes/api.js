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
		res.status(404).send();
	} else if (studentIsMatch) {
		const token = jwt.sign({ student }, process.env.JWTSECRET);
		res.json({ student, token });
	} else {
		res.status(403).send();
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
		if(!verifyStudent(req, res, studentData)) return res.status(403).send();
		const student = await Student.findOne(studentData);
		if (!student) res.status(404).send();
		let puzzle = await puzzles[req.params.puzzleName].Puzzle.findOne({
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
		const { student: studentData } = jwt.verify(
			req.token,
			process.env.JWTSECRET
		);
		if(!verifyStudent(req, res, studentData)) return res.status(403).send();
		const student = await Student.findOne(studentData);
		if (!student) return res.status(404).send();
		let puzzle = await puzzles[req.params.puzzleName].Puzzle.findOne({
			puzzleId: req.params.puzzleId,
			student: student._id,
		});
		if (!puzzle) {
			puzzle = await puzzles[req.params.puzzleName].defaults[
				req.params.puzzleId
			](student);
			await puzzle.save();
		}
		puzzle = await puzzles[req.params.puzzleName].Puzzle.findByIdAndUpdate(
			puzzle._id,
			{
				workData: req.body.puzzleData,
			},
			{ new: true }
		);
		res.json({ puzzle });
	}
);

function verifyStudent(req, res, student) {
	const [, first, last] = req.params.studentId.match(/^(.*)_(.*)$/);
	return student.first === first && student.last === last;
}

function verifyToken(req, res, next) {
	const bearerHeader = req.headers.authorization;
	if (bearerHeader) {
		const bearerToken = bearerHeader;
		req.token = bearerToken;
		next();
	} else {
		res.status(403).send();
	}
}

module.exports = apiRouter;
