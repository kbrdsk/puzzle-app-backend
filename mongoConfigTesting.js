const mongoose = require("mongoose");
const { MongoMemoryServer } = "mongodb-memory-server";

const mongoServer = new MongoMemoryServer();

mongoose.Promise = Promise;
mongoServer.getConnectionString().then((mongoUri) => {
	const mongooseOpts = {
		autoReconnect: true,
		reconnectTries: Number.MAX_VALUE,
		reconnectInterval: 1000,
		useNewUrlParser: true,
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
