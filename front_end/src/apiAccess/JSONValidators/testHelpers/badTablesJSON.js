export default {
	errorCount: 10,
	json: JSON.stringify({
		id: 1,
		name: "test",
		schemas: [{
			name: "testSchema",
			description: "testDesc",
			tables: [
				{
					//no name
					description: "test",
					columns: []
				},
				{
					//no description
					name: "test",
					columns: []
				},
				{
					//no columns
					name: "test",
					description: "test"
				},
				{
					//bad types 1
					name: 5,
					description: true,
					columns: "array"
				},
				{
					//bad types 2
					name: false,
					description: 5,
					columns: {} 
				},
				{
					//bad property
					name: "test",
					description: "test",
					columns: [],
					iShouldNotBeHere: "test"
				}
			]
		}]
	})
};