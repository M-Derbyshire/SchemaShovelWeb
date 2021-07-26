export default {
	
	targetTableID: 0,
	
	expectMatchSchemaIDs: [1, 2],
	expectMatchTableIDs: [1, 2, 3],
	
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
				},
				{
					id: 2,
					name: "matchingTable",
					description: "aTable",
					columns: [
						{
							id: 2,
							name: "aMatchingColumn",
							description: "aColumn",
							fkToTableId: 0
						}
					]
				}
			]
		},
		{
			id: 2,
			name: "matchingSchema",
			description: "aSchema",
			tables: [
				{
					id: 3,
					name: "matchingTable",
					description: "aTable",
					columns: [
						{
							id: 3,
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
			id: 3,
			name: "aSchema",
			description: "aSchema",
			tables: [
				{
					id: 4,
					name: "aTable",
					description: "aTable",
					columns: [
						{
							id: 4,
							name: "aColumn",
							description: "aColumn"
						}
					]
				},
				{
					id: 5,
					name: "aTable",
					description: "aTable",
					columns: [
						{
							id: 5,
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