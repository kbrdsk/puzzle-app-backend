const express = require("express");
const request = require("supertest");

const apiRouter = require("./api");

app = express();

app.use("/api", apiRouter);

test("api router works", (done) => {
	request(app).get("/api").expect(200, done);
});
