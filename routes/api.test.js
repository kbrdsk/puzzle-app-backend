const express = require("express");
const request = require("supertest");
const { dbSetup, dbTeardown } = require("../mongoConfigTesting");

const apiRouter = require("./api");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/api", apiRouter);

beforeEach(dbSetup);

afterEach(dbTeardown);

describe("student client", () => {
	it("creating new student returns JWT & student info", async (done) => {
		const student = { first: "kabirdas", last: "henry" };
		const response = await request(app)
			.post("/api/students")
			.type("form")
			.send(student)
			.expect("Content-Type", /json/)
			.expect(200);
		expect(response.body.student).toMatchObject(student);
		expect(response.body.token).toBeDefined();
		done();
	});
	it("attempting to create an existing student returns error", async (done) => {
		const student = { first: "kabirdas", last: "henry" };
		await request(app).post("/api/students/").type("form").send(student);
		request(app)
			.post("/api/students")
			.type("form")
			.send(student)
			.expect(403, done);
	});
	it("logging in to existing student returns JWT & student info", async (done) => {
		const student = { first: "kabirdas", last: "henry" };
		await request(app).post("/api/students/").type("form").send(student);
		const response = await request(app)
			.post("/api/students/kabirdas_henry/login")
			.type("form")
			.send(student)
			.expect("Content-Type", /json/)
			.expect(200);
		expect(response.body.student).toMatchObject(student);
		expect(response.body.token).toBeDefined();
		done();
	});
	it("attempting to log in to non existant student returns error", async (done) => {
		const student = { first: "Nonexistant", last: "Student" };
		request(app)
			.post("/api/students/nonexistant_student/login")
			.type("form")
			.send(student)
			.expect(404, done);
	});
	it("student names are not case sensitive", async (done) => {
		const student = { first: "Kabirdas", last: "Henry" };
		const studentAlt = { first: "kABIRDAS", last: "hENRY" };
		await request(app).post("/api/students/").type("form").send(student);
		const response1 = await request(app)
			.post("/api/students/kabirdas_henry/login")
			.type("form")
			.send(student)
			.expect("Content-Type", /json/)
			.expect(200);
		const response2 = await request(app)
			.post("/api/students/kabirdas_henry/login")
			.type("form")
			.send(studentAlt)
			.expect("Content-Type", /json/)
			.expect(200);
		expect(response1.body.student).toMatchObject(response2.body.student);
		done();
	});
	it("getting test puzzle data requires auth", async (done) => {
		const student = { first: "kabirdas", last: "henry" };
		await request(app).post("/api/students/").type("form").send(student);
		request(app)
			.get("/api/students/kabirdas_henry/puzzles/Test/0/data")
			.expect(403, done);
	});
	it("putting test puzzle data requires auth", async (done) => {
		const student = { first: "kabirdas", last: "henry" };
		const puzzleData = { solved: true };
		await request(app).post("/api/students/").type("form").send(student);
		request(app)
			.put("/api/students/kabirdas_henry/puzzles/Test/0/data")
			.type("json")
			.send(puzzleData)
			.expect(403, done);
	});
	it("get default puzzle data", async (done) => {
		const student = { first: "kabirdas", last: "henry" };
		const login = await request(app)
			.post("/api/students")
			.type("form")
			.send(student);

		const defaultData = { solved: false };

		const response = await request(app)
			.get("/api/students/kabirdas_henry/puzzles/Test/0/data")
			.set("authorization", login.body.token)
			.expect("Content-Type", /json/)
			.expect(200);

		expect(response.body.data).toMatchObject(defaultData);
		done();
	});
	xit("putting test puzzle data", async (done) => {
		const student = { first: "kabirdas", last: "henry" };
		await request(app)
			.post("/api/students/")
			.type("form")
			.send(student)
			.expect(200);

		const login = await request(app)
			.post("/api/students/")
			.type("form")
			.send(student);
		const puzzleData = { solved: true };

		request(app)
			.put("/api/students/kabirdas_henry/puzzles/Test/0/data")
			.set("authorization", login.token)
			.type("json")
			.send(puzzleData)
			.expect(200, done);
	});
	xit("getting test puzzle data after change", async (done) => {
		const student = { first: "kabirdas", last: "henry" };
		await request(app)
			.post("/api/students/")
			.type("form")
			.send(student)
			.expect(200);

		const login = await request(app)
			.post("/api/students/")
			.type("form")
			.send(student);
		const puzzleData = { solved: true };

		await request(app)
			.put("/api/students/kabirdas_henry/puzzles/Test/0/data")
			.set("authorization", login.token)
			.type("json")
			.send(puzzleData)
			.expect(200);
		const response = await request(app)
			.get("/api/students/kabirdas_henry/puzzles/Test/0/data")
			.set("authorization", login.token)
			.expect("Content-Type", /json/)
			.expect(200);
		expect(response.data).toMatchObject(puzzleData);
		done();
	});
	xit("getting/putting to wrong student forbidden", async (done) => {});
	xit("changing active status on puzzle", async (done) => {});
	xit("get on /api/students verifies token & return student data", async (done) => {});
});
