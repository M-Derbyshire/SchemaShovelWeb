export default {
		errorCount: 10,
		json: JSON.stringify([
		{
			// no name
			description: "test",
			tables: []
		},
		{
			//no description
			name: "test",
			tables: []
		},
		{
			//no tables
			name: "test",
			description: "test"
		},
		{
			//bad types 1
			name: 5,
			description: true,
			tables: "array"
		},
		{
			//bad types 2
			name: false,
			description: 5,
			tables: {} 
		},
		{
			//bad property
			name: "test",
			description: "test",
			tables: [],
			iShouldNotBeHere: "test"
		}
	])
};