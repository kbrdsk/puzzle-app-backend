require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");

const apiRouter = express.Router();

apiRouter.post("/students", (req, res) => {
	const student = { first: req.body.first, last: req.body.last };
	const token = jwt.sign({ student }, process.env.JWTSECRET);
	res.json({ student, token });
});

module.exports = apiRouter;
