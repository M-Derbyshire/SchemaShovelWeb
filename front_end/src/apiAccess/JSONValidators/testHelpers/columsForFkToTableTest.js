export default JSON.stringify({
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
						name: "test",
						description: "test"
					},
					{
						//no description
						name: "test",
						description: "test",
						fkToTable: "testTable.testColumn"
					}
				]
			}
		]
	}]
});