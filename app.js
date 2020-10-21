require("dotenv").config();

const express = require("express");

const apiRouter = require("./routes/api");

const app = express();

app.use("/api", apiRouter);

app.listen(process.env.PORT, () =>
	console.log(`App listening on port ${process.env.PORT}`)
);
