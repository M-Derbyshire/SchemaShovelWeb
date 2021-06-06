export default {
	errorCount: 11,
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
							fkToTable: "testTable.testColumn",
							description: "test"
						},
						{
							//no description
							name: "test",
							fkToTable: "testTable.testColumn"
						},
						{
							//badly formatted fkToTable
							name: "test",
							description: "test",
							fkToTable: "columnNameWithoutTable"
						},
						{
							//Incorrect types 1
							name: true,
							description: 2,
							fkToTable: 1.5
						},
						{
							//Incorrect types 1
							name: 1,
							description: false,
							fkToTable: {}
						},
						{
							//incorrect property
							name: "test",
							description: "test",
							fkToTable: "testTable.testColumn",
							iShouldNotBeHere: "test"
						}
					]
				}
			]
		}]
	})
};