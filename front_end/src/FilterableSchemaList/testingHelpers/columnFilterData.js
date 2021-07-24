export default {
	fullList: [
		{
			id: 0,
			name: "aSchema",
			description: "aSchema",
			tables: [
				{
					id: 0,
					name: "aTable",
					description: "aTable",
					columns: [
						{
							id: 0,
							name: "aMatchingColumn",
							description: "aColumn"
						},
						{
							id: 1,
							name: "aColumn",
							description: "aMatchingColumn"
						},
						{
							id: 2,
							name: "aColumn",
							description: "aColumn"
						},
					]
				}
			]
		}
	],
	
	expectedIDsWithoutDescriptions: [0],
	expectedIDsWithDescriptions: [0, 1]
};