export default {
	noTablesPropTest: [
		{
			id: 0,
			name: "aSchema",
			description: "aSchema"
		}
	],
	
	noColumnsPropTest: [
		{
			id: 0,
			name: "aSchema",
			description: "aSchema",
			tables: [
				{
					id: 0,
					name: "aTable",
					description: "aTable"
				}
			]
		}
	],
	
	tablesNotArrayTest: [
		{
			id: 0,
			name: "aSchema",
			description: "aSchema",
			tables: true
		}
	],
	
	columnsNotArrayTest: [
		{
			id: 0,
			name: "aSchema",
			description: "aSchema",
			tables: [
				{
					id: 0,
					name: "aTable",
					description: "aTable",
					columns: true
				}
			]
		}
	],
};