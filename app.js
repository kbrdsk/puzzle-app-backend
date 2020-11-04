require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const apiRouter = require("./routes/api");

const { dbSetup } = require("./mongoConfigTesting");

const app = express();

if (process.env.NODE_ENV === "development") {
	dbSetup();
} else {
	require("./mongoConfig");
}

app.use(helmet());
app.use(compression());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use("/api", apiRouter);

app.listen(process.env.PORT, () =>
	console.log(`App listening on port ${process.env.PORT}`)
);
