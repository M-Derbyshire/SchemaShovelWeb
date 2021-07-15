export default {
	errorCount: 8,
	json: JSON.stringify({
		id: 1,
		name: "test",
		schemas: [{
			name: "testSchema",
			description: "testDesc",
			tables: [
				{
					name: "testTable",
					description: "test",
					columns: [
						{
							//No name
							fkToTableId: 0,
							description: "test"
						},
						{
							//no description
							name: "test",
							fkToTableId: 0
						},
						{
							//Incorrect types 1
							name: true,
							description: 2,
							fkToTableId: "test.test"
						},
						{
							//Incorrect types 1
							name: 1,
							description: true,
							fkToTableId: {}
						}
					]
				}
			]
		}]
	})
};