const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const mongoServer = new MongoMemoryServer();

mongoose.Promise = Promise;

async function dbSetup() {
	const mongoUri = await mongoServer.getUri();
	const mongooseOpts = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	};

	mongoose.connect(mongoUri, mongooseOpts);

	mongoose.connection.on("error", (err) => {
		if (err.message.code === "ETIMEDOUT") {
			console.log(err);
			mongoose.connect(mongoUri, mongooseOpts);
		}
		console.log(err);
	});

	return mongoUri;
}

async function dbTeardown() {
	await mongoose.disconnect();
	await mongoServer.stop();
}

module.exports = { dbSetup, dbTeardown };
