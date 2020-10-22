const express = require("express");
const request = require("supertest");

const apiRouter = require("./api");

app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/api", apiRouter);

describe("student client", () => {
	it("creating new student returns JWT & student info", async (done) => {
		const student = { first: "kabirdas", last: "henry" };
		const response = await request(app)
			.post("/api/students")
			.type("form")
			.send(student)
			//.set("Accept", "application/json")
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
	xit("logging in to existing student returns JWT & student info", async (done) => {
		const student = { first: "kabirdas", last: "henry" };
		await request(app).post("/api/students/").type("form").send(student);
		const response = await request(app)
			.post("/api/students/kabirdas_henry/login")
			.type("form")
			.send(student)
			.expect("Content-Type", /json/)
			.expect(200);
		expect(response.student).toMatchObject(student);
		expect(response.token).toBeDefined();
		done();
	});
	xit("attempting to log in to non existant student returns error", async (done) => {
		const student = { first: "Nonexistant", last: "Student" };
		await request(app).post("/api/students/").type("form").send(student);
		request(app)
			.post("/api/students/nonexistant_student/login")
			.type("form")
			.send(student)
			.expect(404, done);
	});
	xit("student names are not case sensitive", async (done) => {
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
		expect(response1.student).toMatchObject(response2.student);
		done();
	});
	xit("getting test puzzle data requires auth", async (done) => {
		const student = { first: "kabirdas", last: "henry" };
		const puzzleData = { solved: true };
		await request(app).post("/api/students/").type("form").send(student);
		request(app)
			.put("/api/students/kabirdas_henry/puzzles/test/0")
			.type("json")
			.send(puzzleData)
			.expect(403, done);
	});
	xit("putting test puzzle data requires auth", async (done) => {
		const student = { first: "kabirdas", last: "henry" };
		const puzzleData = { solved: true };
		await request(app).post("/api/students/").type("form").send(student);
		request(app)
			.put("/api/students/kabirdas_henry/puzzles/test/0")
			.type("json")
			.send(puzzleData)
			.expect(403, done);
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
			.put("/api/students/kabirdas_henry/puzzles/test/0")
			.set("authorization", login.token)
			.type("json")
			.send(puzzleData)
			.expect(200, done);
	});
	xit("getting test puzzle data", async (done) => {
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
			.put("/api/students/kabirdas_henry/puzzles/test/0/data")
			.set("authorization", login.token)
			.type("json")
			.send(puzzleData)
			.expect(200);
		const response = await request(app)
			.get("/api/students/kabirdas_henry/puzzles/test/0/data")
			.set("authorization", login.token)
			.expect("Content-Type", /json/)
			.expect(200);
		expect(response.data).toMatchObject(puzzleData);
		done();
	});
	xit("changing active status on puzzle", async (done) => {});
	xit("get on /api/students verifies token & return student data", async (done) => {});
});
