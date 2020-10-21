const express = require("express");

const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
	res.json({message: "apiRouter functional"});
})

module.exports = apiRouter;