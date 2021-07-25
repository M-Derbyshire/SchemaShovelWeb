export default {
	fullList: [
		{
			id: 0,
			name: "aMatchingName",
			description: "aDescription",
			tables: [
				{
					id: 0,
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
		},
		{
			id: 1,
			name: "notWhatYoureLookingFor",
			description: "actuallyIsAMatchingDescription",
			tables: [
				{
					id: 1,
					name: "aTable",
					description: "aTable",
					columns: [
						{
							id: 1,
							name: "aColumn",
							description: "aColumn"
						}
					]
				}
			]
		},
		{
			id: 2,
			name: "notWhatYoureLookingFor",
			description: "notWhatYoureLookingFor",
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
				}
			]
		}
	],
	
	expectedIDsWithoutDescriptions: [0],
	expectedIDsWithDescriptions: [0, 1]
};