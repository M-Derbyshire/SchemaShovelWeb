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
						name: "",
						fkToTable: "testTable.testColumn",
						description: "test"
					}
				]
			}
		]
	}]
});