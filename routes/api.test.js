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
	it("get default sample calcudoku", async (done) => {
		const student = { first: "kabirdas", last: "henry" };
		const login = await request(app)
			.post("/api/students")
			.type("application/json")
			.send(JSON.stringify(student));

		const defaultData = {
			size: 4,
			title: "Sample",
			cages: [
				{
					operation: "+",
					result: 9,
					squares: [
						{ col: 0, row: 0 },
						{ col: 1, row: 0 },
						{ col: 1, row: 1 },
					],
				},
				{
					operation: "+",
					result: 8,
					squares: [
						{ col: 0, row: 1 },
						{ col: 0, row: 2 },
						{ col: 0, row: 3 },
					],
				},
				{
					operation: "",
					result: 1,
					squares: [{ col: 2, row: 0 }],
				},
				{
					operation: "-",
					result: 1,
					squares: [
						{ col: 1, row: 2 },
						{ col: 1, row: 3 },
					],
				},
				{
					operation: "+",
					result: 5,
					squares: [
						{ col: 2, row: 1 },
						{ col: 2, row: 2 },
					],
				},
				{
					operation: "-",
					result: 1,
					squares: [
						{ col: 2, row: 3 },
						{ col: 3, row: 3 },
					],
				},
				{
					operation: "+",
					result: 5,
					squares: [
						{ col: 3, row: 0 },
						{ col: 3, row: 1 },
					],
				},
				{
					operation: "",
					result: 2,
					squares: [{ col: 3, row: 2 }],
				},
			],
		};

		const response = await request(app)
			.get("/api/puzzles/calcudoku/sample")
			.set("authorization", login.body.token)
			.expect(200)
			.expect("Content-Type", /json/);

		expect(response.body).toMatchObject(defaultData);
		done();
	});
	it("changing calcudoku work", async (done) => {
		const student = { first: "kabirdas", last: "henry" };
		const login = await request(app)
			.post("/api/students/")
			.type("application/json")
			.send(JSON.stringify(student));

		const puzzleData = [
			{ col: 0, row: 0, value: 2 },
			{ col: 1, row: 0, value: 3 },
			{ col: 2, row: 0, value: 1 },
			{ col: 3, row: 0, value: 4 },
		];

		await request(app)
			.put("/api/puzzles/calcudoku/sample")
			.set("authorization", login.body.token)
			.type("json")
			.send({ puzzleData })
			.expect(200);
		const response = await request(app)
			.get("/api/puzzles/calcudoku/sample")
			.set("authorization", login.body.token)
			.expect("Content-Type", /json/)
			.expect(200);
		expect(response.body.work).toMatchObject(puzzleData);
		done();
	});
	it("getting calcudoku instance list", async (done) => {
		const student = { first: "kabirdas", last: "henry" };
		const login = await request(app)
			.post("/api/students/")
			.type("application/json")
			.send(JSON.stringify(student));

		const response = await request(app)
			.get("/api/puzzles/calcudoku")
			.set("authorization", login.body.token)
			.expect(200);
		expect(response.body).toEqual(expect.arrayContaining([]));
		done();
	});

	it("getting student list requires auth", async (done) => {
		request(app).get("/api/students/").expect(403, done);
	});

	it("getting student list", async (done) => {
		const student1 = { first: "kabirdas", last: "henry" };
		const student2 = { first: "naomi", last: "henry" };
		await Promise.all([
			request(app)
				.post("/api/students/")
				.type("application/json")
				.send(JSON.stringify(student1)),
			request(app)
				.post("/api/students/")
				.type("application/json")
				.send(JSON.stringify(student2)),
		]);

		const response = await request(app)
			.get("/api/students/")
			.set("authorization", process.env.INSTRUCTOR_PW);

		expect(response.body).toEqual(
			expect.arrayContaining([student1, student2])
		);

		done();
	});

	it("getting active puzzle requires auth", async (done) => {
		request(app)
			.get(`/api/students/doesnt_matter/activepuzzle`)
			.expect(403, done);
	});

	it("getting active puzzle for nonexistant student", async (done) => {
		request(app)
			.get(`/api/students/doesnt_exist/activepuzzle`)
			.set("authorization", process.env.INSTRUCTOR_PW)
			.expect(404, done);
	});

	it("getting and setting active puzzle", async (done) => {
		const student = { first: "kabirdas", last: "henry" };
		const puzzleInfo = { puzzleName: "calcudoku", puzzleId: "sample" };
		const login = await request(app)
			.post("/api/students/")
			.type("application/json")
			.send(JSON.stringify(student));
		await request(app)
			.put("/api/activepuzzle")
			.set("authorization", login.body.token)
			.type("application/json")
			.send(JSON.stringify(puzzleInfo))
			.expect(200);

		const response = await request(app)
			.get(`/api/students/${student.first}_${student.last}/activepuzzle`)
			.set("authorization", process.env.INSTRUCTOR_PW);

		expect(response.body.puzzleName).toBe("calcudoku");
		expect(response.body.puzzleId).toBe("sample");
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining([
				"title",
				"cages",
				"work",
				"size",
				"student",
				"source",
			])
		);

		done();
	});

	xit("resetting active puzzle", async (done) => {
		const student = { first: "kabirdas", last: "henry" };
		const puzzleInfo = { puzzleName: "calcudoku", puzzleId: "sample" };
		const login = await request(app)
			.post("/api/students/")
			.type("application/json")
			.send(JSON.stringify(student));
		await request(app)
			.put("/api/activepuzzle")
			.set("authorization", login.body.token)
			.type("application/json")
			.send(JSON.stringify(puzzleInfo))
			.expect(200);

		await request(app)
			.delete("/api/activepuzzle")
			.set("authorization", login.body.token)
			.type("application/json")
			.expect(200);

		const response = await request(app)
			.get(`/api/students/${student.first}_${student.last}/activepuzzle`)
			.set("authorization", process.env.INSTRUCTOR_PW);

		expect(response.body.puzzleName).toBe(null);
		expect(response.body.puzzleId).toBe(null);

		done();
	});
});
