export default {
	fullList: [
		{
			id: 0,
			name: "notTheSchemaYoureLookingFor",
			description: "butWillBeDisplayedAnywayAsInnerEntities",
			isMatch: false,
			tables: [
				{
					id: 1,
					name: "notTheTableYoureLookingFor",
					description: "butWillBeDisplayedAnywayAsInnerEntities",
					isMatch: false,
					columns: [
						{
							id: 2,
							name: "aMatchingColumn",
							description: "aColumn",
							isMatch: true
						},
						{
							id: 3,
							name: "notTheColumnYoureLookingFor",
							description: "aColumn",
							isMatch: false
						}
					]
				}
			]
		},
		{
			id: 4,
			name: "aMatchingSchema",
			description: "aSchema",
			isMatch: true,
			tables: []
		},
		{
			id: 5,
			name: "notTheSchemaYoureLookingFor",
			description: "butWillBeDisplayedAnywayAsInnerEntities",
			isMatch: false,
			tables: [
				{
					id: 6,
					name: "aMatchingTable",
					description: "aTable",
					isMatch: true,
					columns: []
				},
				{
					id: 7,
					name: "aTable",
					description: "aTable",
					isMatch: false,
					columns: []
				}
			]
		},
		{
			id: 8,
			name: "notTheSchemaYoureLookingFor",
			description: "notTheSchemaYoureLookingFor",
			isMatch: false,
			tables: [
				{
					id: 9,
					name: "aTable",
					description: "aTable",
					isMatch: false,
					columns: [
						{
							id: 10,
							name: "aColumn",
							description: "aColumn",
							isMatch: false
						}
					]
				}
			]
		},
	],
	
	
	
	//This includes IDs for schemas/tables/columns 
	//(but there are no duplicates above, regardless of entity type)
	expectedEntityIDs: [0, 1, 2, 4, 5, 6],
	expectedMatchEntityIDs: [2, 4, 6]
};