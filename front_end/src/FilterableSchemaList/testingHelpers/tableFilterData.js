export default {
	fullList: [
		{
			id: 0,
			name: "aSchema",
			description: "aSchema",
			tables: [
				{
					id: 0,
					name: "aMatchingTable",
					description: "aTable",
					columns: [
						{
							id: 0,
							name: "aColumn",
							description: "aColumn"
						}
					]
				},
				{
					id: 1,
					name: "aTable",
					description: "aMatchingTable",
					columns: [
						{
							id: 0,
							name: "aColumn",
							description: "aColumn"
						}
					]
				},
				
				{
					id: 2,
					name: "aTable",
					description: "aTable",
					columns: [
						{
							id: 0,
							name: "aColumn",
							description: "aColumn"
						}
					]
				}
			]
		}
	],
	
	expectedIDsWithoutDescriptions: [0],
	expectedIDsWithDescriptions: [0, 1]
};