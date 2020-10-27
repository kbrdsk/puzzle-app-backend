const express = require("express");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { dbSetup, dbTeardown } = require("../mongoConfigTesting");

const apiRouter = require("./api");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api", apiRouter);

beforeEach(dbSetup);

afterEach(dbTeardown);

describe("student client", () => {
	it("creating new student returns JWT with student info", async (done) => {
		const student = { first: "kabirdas", last: "henry" };
		const response = await request(app)
			.post("/api/students")
			.type("application/json")
			.send(JSON.stringify(student))
			.expect("Content-Type", /json/)
			.expect(200);
		expect(jwt.decode(response.body.token).student).toMatchObject(student);
		done();
	});
	it("attempting to create an existing student returns error", async (done) => {
		const student = { first: "kabirdas", last: "henry" };
		await request(app)
			.post("/api/students/")
			.type("application/json")
			.send(JSON.stringify(student));
		request(app)
			.post("/api/students")
			.type("application/json")
			.send(JSON.stringify(student))
			.expect(403, done);
	});
	it("logging in to existing student returns JWT with student info", async (done) => {
		const student = { first: "kabirdas", last: "henry" };
		await request(app)
			.post("/api/students/")
			.type("application/json")
			.send(JSON.stringify(student));
		const response = await request(app)
			.post("/api/students/login")
			.type("application/json")
			.send(JSON.stringify(student))
			.expect("Content-Type", /json/)
			.expect(200);
		expect(jwt.decode(response.body.token).student).toMatchObject(student);
		done();
	});
	it("attempting to log in to non existant student returns 404", async (done) => {
		const student = { first: "Nonexistant", last: "Student" };
		request(app)
			.post("/api/students/login")
			.type("application/json")
			.send(JSON.stringify(student))
			.expect(404, done);
	});
	it("student names are not case sensitive", async (done) => {
		const student = { first: "Kabirdas", last: "Henry" };
		const studentAlt = { first: "kABIRDAS", last: "hENRY" };
		await request(app)
			.post("/api/students/")
			.type("application/json")
			.send(JSON.stringify(student));
		const response1 = await request(app)
			.post("/api/students/login")
			.type("application/json")
			.send(JSON.stringify(student))
			.expect(200)
			.expect("Content-Type", /json/);
		const response2 = await request(app)
			.post("/api/students/login")
			.type("application/json")
			.send(JSON.stringify(studentAlt))
			.expect(200)
			.expect("Content-Type", /json/);
		expect(jwt.decode(response1.body.token).student).toMatchObject(
			jwt.decode(response2.body.token).student
		);
		done();
	});
	it("getting test puzzle work requires auth", async (done) => {
		const student = { first: "kabirdas", last: "henry" };
		await request(app)
			.post("/api/students/")
			.type("application/json")
			.send(JSON.stringify(student));
		request(app).get("/api/puzzles/Test/0").expect(403, done);
	});
	it("putting test puzzle work requires auth", async (done) => {
		const student = { first: "kabirdas", last: "henry" };
		const puzzleData = { solved: true };
		await request(app)
			.post("/api/students/")
			.type("application/json")
			.send(JSON.stringify(student));
		request(app)
			.put("/api/puzzles/Test/0")
			.type("json")
			.send(puzzleData)
			.expect(403, done);
	});
	it("get default puzzle work", async (done) => {
		const student = { first: "kabirdas", last: "henry" };
		const login = await request(app)
			.post("/api/students")
			.type("application/json")
			.send(JSON.stringify(student));

		const defaultData = { solved: false };

		const response = await request(app)
			.get("/api/puzzles/Test/0")
			.set("authorization", login.body.token)
			.expect(200)
			.expect("Content-Type", /json/);

		expect(response.body.work).toMatchObject(defaultData);
		done();
	});
	it("putting test puzzle work", async (done) => {
		const student = { first: "kabirdas", last: "henry" };
		const login = await request(app)
			.post("/api/students/")
			.type("application/json")
			.send(JSON.stringify(student));

		const puzzleData = { solved: true };

		await request(app)
			.put("/api/puzzles/Test/0")
			.set("authorization", login.body.token)
			.type("json")
			.send({ puzzleData })
			.expect(200 /*done*/);
		done();
	});
	it("getting test puzzle work after change", async (done) => {
		const student = { first: "kabirdas", last: "henry" };
		const login = await request(app)
			.post("/api/students/")
			.type("application/json")
			.send(JSON.stringify(student));

		const puzzleData = { solved: true };

		await request(app)
			.put("/api/puzzles/Test/0")
			.set("authorization", login.body.token)
			.type("json")
			.send({ puzzleData })
			.expect(200);
		const response = await request(app)
			.get("/api/puzzles/Test/0")
			.set("authorization", login.body.token)
			.expect("Content-Type", /json/)
			.expect(200);
		expect(response.body.work).toMatchObject(puzzleData);
		done();
	});
});
