module.exports.defaults = [
	{
		default: true,
		populateID: "calcudoku-1",
		puzzleName: "calcudoku",
		puzzleId: "sample",
		title: "Sample",
		student: null,
		size: 4,
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
	},
	{
		default: true,
		populateID: "calcudoku-2",
		puzzleName: "calcudoku",
		puzzleId: "sample2",
		title: "Sample Two",
		student: null,
		work: [],
		size: 5,
		cages: [
			{
				operation: "+",
				result: 8,
				squares: [
					{ col: 0, row: 0 },
					{ col: 0, row: 1 },
				],
			},
			{
				operation: "+",
				result: 9,
				squares: [
					{ col: 1, row: 0 },
					{ col: 2, row: 0 },
				],
			},
			{
				operation: "+",
				result: 3,
				squares: [
					{ col: 1, row: 1 },
					{ col: 2, row: 1 },
				],
			},
			{
				operation: "+",
				result: 3,
				squares: [
					{ col: 3, row: 0 },
					{ col: 4, row: 0 },
				],
			},
			{
				operation: "",
				result: 5,
				squares: [{ col: 2, row: 2 }],
			},
			{
				operation: "+",
				result: 7,
				squares: [
					{ col: 0, row: 2 },
					{ col: 1, row: 2 },
				],
			},
			{
				operation: "+",
				result: 8,
				squares: [
					{ col: 3, row: 3 },
					{ col: 4, row: 3 },
				],
			},
			{
				operation: "+",
				result: 5,
				squares: [
					{ col: 1, row: 3 },
					{ col: 2, row: 3 },
				],
			},
			{
				operation: "+",
				result: 5,
				squares: [
					{ col: 1, row: 4 },
					{ col: 2, row: 4 },
				],
			},
			{
				operation: "+",
				result: 9,
				squares: [
					{ col: 3, row: 4 },
					{ col: 4, row: 4 },
				],
			},
			{
				operation: "+",
				result: 3,
				squares: [
					{ col: 0, row: 3 },
					{ col: 0, row: 4 },
				],
			},
			{
				operation: "+",
				result: 3,
				squares: [
					{ col: 3, row: 1 },
					{ col: 3, row: 2 },
				],
			},
			{
				operation: "+",
				result: 3,
				squares: [
					{ col: 4, row: 1 },
					{ col: 4, row: 2 },
				],
			},
		],
	},
];
