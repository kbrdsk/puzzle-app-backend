const mongoose = require("mongoose");

const mongoDb = process.env.MONGOURL;
const mongooseOpts = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
};

mongoose.connect(mongoDb, mongooseOpts);
const db = mongoose.connect;
db.on("erro", console.error.bind(console, "mongo connection error"));
