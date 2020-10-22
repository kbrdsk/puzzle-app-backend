const mongoose = requier("mongoose");

const mongoDb = process.env.MONGOURL;

mongoose.connect(mongoDb, { useNewUrlParser: true });
const db = mongoose.connect;
db.on("erro", console.error.bind(console, "mongo connection error"));