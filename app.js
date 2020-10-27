require("dotenv").config();

const express = require("express");
const cors = require("cors");

const apiRouter = require("./routes/api");

require("./mongoConfigTesting");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use("/api", apiRouter);

app.listen(process.env.PORT, () =>
	console.log(`App listening on port ${process.env.PORT}`)
);
