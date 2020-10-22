const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const mongoServer = new MongoMemoryServer();

mongoose.Promise = Promise;
mongoServer.getUri().then((mongoUri) => {
	const mongooseOpts = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};

	mongoose.connect(mongoUri, mongooseOpts);

	mongoose.connection.on("error", (err) => {
		if (err.message.code === "ETIMEDOUT") {
			console.log(err);
			mongoose.connect(mongoUri, mongooseOpts);
		}
		console.log(err);
	});

	mongoose.connection.once("open", () => {
		console.log(`MongoDB successfully connected to ${mongoUri}`);
	});
});
