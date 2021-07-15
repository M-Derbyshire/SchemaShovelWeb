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
							fkToTableStr: "testTable.testColumn"
						},
						{
							//badly formatted fkToTable
							name: "test",
							description: "test",
							fkToTableStr: "columnNameWithoutTable"
						},
						{
							//fkToTableId
							name: "test",
							description: "test",
							fkToTableId: 0
						},
						{
							//Incorrect types 1
							name: true,
							description: 2,
							fkToTableStr: 1.5
						},
						{
							//Incorrect types 1
							name: 1,
							description: false,
							fkToTableStr: {}
						}
					]
				}
			]
		}]
	})
};