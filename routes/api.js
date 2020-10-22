require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");

const Student = require("../models/student");

const apiRouter = express.Router();

apiRouter.post("/students", async (req, res) => {
	const studentData = { first: req.body.first, last: req.body.last };
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

function verifyToken(req, res, next) {
	const bearerHeader = req.headers.authorization;
	if (bearerHeader) {
		const bearerToken = bearerHeader.match(/(?<=Bearer ).+/)[1];
		req.token = bearerToken;
		next();
	} else {
		res.sendStatus(403);
	}
}

module.exports = apiRouter;
