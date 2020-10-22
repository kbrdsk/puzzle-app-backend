require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");

const Student = require("../models/student");

const apiRouter = express.Router();

apiRouter.post("/students", async (req, res) => {
	const studentData = { first: req.body.first, last: req.body.last };
	const foundStudent = await Student.find(studentData);
	if (foundStudent.length > 0) {
		res.sendStatus(403);
	} else {
		const student = new Student(studentData);
		student.save();
		const token = jwt.sign({ student }, process.env.JWTSECRET);
		res.json({ student, token });
	}
});

module.exports = apiRouter;
