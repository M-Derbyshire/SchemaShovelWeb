export default {
	
	targetTableID: 0,
	
	expectMatchSchemaIDs: [1],
	expectMatchTableIDs: [1],
	
	fullList: [
		
		//The target table
		{
			id: 0,
			name: "schemaWithTarget",
			description: "aSchema",
			tables: [
				{
					id: 0,
					name: "targetTable",
					description: "aTable",
					columns: []
				}
			]
		},
		
		//Tables that link to the target
		{
			id: 1,
			name: "matchingSchema",
			description: "aSchema",
			tables: [
				{
					id: 1,
					name: "matchingTable",
					description: "aTable",
					columns: [
						{
							id: 1,
							name: "aMatchingColumn",
							description: "aColumn",
							fkToTableId: 0
						}
					]
				}
			]
		},
		
		
		//Tables that won't
		{
			id: 2,
			name: "aSchema",
			description: "aSchema",
			tables: [
				{
					id: 2,
					name: "aTable",
					description: "aTable",
					columns: [
						{
							id: 2,
							name: "aColumn",
							description: "aColumn"
						}
					]
				},
				{
					id: 3,
					name: "aTable",
					description: "aTable",
					columns: [
						{
							id: 3,
							name: "aColumn",
							description: "aColumn",
							fkToTableId: 2
						}
					]
				}
			]
		}
		
	]
}