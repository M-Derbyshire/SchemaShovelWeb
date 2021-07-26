import FilterableSchemaList from './FilterableSchemaList';

import schemaFilterData from './testingHelpers/schemaFilterData';
import tableFilterData from './testingHelpers/tableFilterData';
import columnFilterData from './testingHelpers/columnFilterData';
import multiFilterData from './testingHelpers/multiFilterData';
import propertyAdditionData from './testingHelpers/propertyAdditionData';
import fkToTableData from './testingHelpers/fkToTableData';


test.each([
	[
		"#FF0000",
		"#00FF00",
		"#0000FF"
	],
	[
		"#FFFFFF",
		"#000000",
		"#AAAAAA"
	],
])("FilterableSchemaList constructor will set the colors, and getters will return them", 
	(schemaColor, tableColor, columnColor) => {
	
	const filtList = new FilterableSchemaList([], schemaColor, tableColor, columnColor);
	
	expect(filtList.schemaColor).toEqual(schemaColor);
	expect(filtList.tableColor).toEqual(tableColor);
	expect(filtList.columnColor).toEqual(columnColor);
});


//See ./testingHelpers/schemaFilterData
test("FilterableSchemaList getFilteredList will filter schema results (case-insensitive), both with and without matching descriptions", () => {
	
	const filtList = new FilterableSchemaList(schemaFilterData.fullList, "", "", "");
	const expectedNoDesc = schemaFilterData.expectedIDsWithoutDescriptions;
	const expectedWithDesc = schemaFilterData.expectedIDsWithDescriptions;
	
	const matchesNoDesc = filtList.getFilteredList("match", "", "");
	const matchesWithDesc = filtList.getFilteredList("match", "", "", true);
	
	matchesNoDesc.forEach(matchSchema => expect(expectedNoDesc.includes(matchSchema.id)).toBeTruthy());
	expect(matchesNoDesc.length).toBe(expectedNoDesc.length);
	
	matchesWithDesc.forEach(matchSchema => expect(expectedWithDesc.includes(matchSchema.id)).toBeTruthy());
	expect(matchesWithDesc.length).toBe(expectedWithDesc.length);
});


// See ./testingHelpers/tableFilterData
test("FilterableSchemaList getFilteredList will filter table results (case-insensitive), both with and without matching descriptions", () => {
	
	const filtList = new FilterableSchemaList(tableFilterData.fullList, "", "", "");
	const expectedNoDesc = tableFilterData.expectedIDsWithoutDescriptions;
	const expectedWithDesc = tableFilterData.expectedIDsWithDescriptions;
	
	const matchesNoDesc = filtList.getFilteredList("", "match", "")[0].childEntities;
	const matchesWithDesc = filtList.getFilteredList("", "match", "", true)[0].childEntities;
	
	matchesNoDesc.forEach(matchTable => expect(expectedNoDesc.includes(matchTable.id)).toBeTruthy());
	expect(matchesNoDesc.length).toBe(expectedNoDesc.length);
	
	matchesWithDesc.forEach(matchTable => expect(expectedWithDesc.includes(matchTable.id)).toBeTruthy());
	expect(matchesWithDesc.length).toBe(expectedWithDesc.length);
});


// See ./testingHelpers/columnFilterData
test("FilterableSchemaList getFilteredList will filter column results (case-insensitive), both with and without matching descriptions", () => {
	
	const filtList = new FilterableSchemaList(columnFilterData.fullList, "", "", "");
	const expectedNoDesc = columnFilterData.expectedIDsWithoutDescriptions;
	const expectedWithDesc = columnFilterData.expectedIDsWithDescriptions;
	
	const matchTablesNoDesc = filtList.getFilteredList("", "", "match")[0].childEntities;
	const matchTablesWithDesc = 
		filtList.getFilteredList("", "", "match", true)[0].childEntities;
	
	matchTablesNoDesc.forEach(matchTable => {
		expect(matchTable.childEntities.length).toBe(expectedNoDesc.length);
		matchTable.childEntities.forEach(
			matchColumn => expect(expectedNoDesc.includes(matchColumn.id)).toBeTruthy()
		);
	});
	
	matchTablesWithDesc.forEach(matchTable => {
		expect(matchTable.childEntities.length).toBe(expectedWithDesc.length);
		matchTable.childEntities.forEach(
			matchColumn => expect(expectedWithDesc.includes(matchColumn.id)).toBeTruthy()
		);
	});
});


// See ./testingHelpers/multiFilterData
test("FilterableSchemaList getFilteredList will filter different entity results (case-insensitive), but will only set isMatch to true on the actual matches, rather than entities that contain matches", () => {
	
	const filtList = new FilterableSchemaList(multiFilterData.fullList, "", "", "");
	const expectedEntityIDs = multiFilterData.expectedEntityIDs;
	const expectedMatchEntityIDs = multiFilterData.expectedMatchEntityIDs;
	
	const schemasWithMatches = filtList.getFilteredList("match", "match", "match");
	
	const entityTest = (entity) => {
		expect(expectedEntityIDs).toContain(entity.id);
		
		if(expectedMatchEntityIDs.includes(entity.id)) 
			expect(entity.isMatch).toBeTruthy();
		else
			expect(entity.isMatch).toBeFalsy();
	};
	
	schemasWithMatches.forEach(schema => {
		
		entityTest(schema);
		
		schema.childEntities.forEach(table => {
			entityTest(table);
			table.childEntities.forEach(column => entityTest(column));
		});
	});
});


test("FilterableSchemaList will change 'tables' and 'columns' property names to 'childEntities' ", () => {
	
	const propertyName = "childEntities";
	const filtList = new FilterableSchemaList(propertyAdditionData.fullList, "", "", "");
	
	const matches = filtList.getFullList();
	
	matches.forEach(schema => {
		expect(schema).toHaveProperty(propertyName);
		expect(schema).not.toHaveProperty("tables");
		
		schema[propertyName].forEach(table => {
			expect(table).toHaveProperty(propertyName);
			expect(table).not.toHaveProperty("columns");
		});
	});
});


test("FilterableSchemaList will add an isMatch property to all entities", () => {
	
	const propertyName = "isMatch";
	const filtList = new FilterableSchemaList(propertyAdditionData.fullList, "", "", "");
	
	const matches = filtList.getFullList();
	
	matches.forEach(schema => {
		expect(schema).toHaveProperty(propertyName);
		schema.childEntities.forEach(table => {
			expect(table).toHaveProperty(propertyName);
			table.childEntities.forEach(column => expect(column).toHaveProperty(propertyName));
		});
	});
});



test.each([
	[
		"#FF0000",
		"#00FF00",
		"#0000FF"
	],
	[
		"#FFFFFF",
		"#000000",
		"#AAAAAA"
	],
])("FilterableSchemaList will add a colour property, with the correct color, to all entities", 
	(schemaColor, tableColor, columnColor) => {
	
	const propertyName = "color";
	
	const filtList = new FilterableSchemaList(propertyAdditionData.fullList, schemaColor, tableColor, columnColor);
	
	const matches = filtList.getFullList();
	
	matches.forEach(schema => {
		expect(schema).toHaveProperty(propertyName);
		
		expect(schema[propertyName]).toEqual(schemaColor);
		
		schema.childEntities.forEach(table => {
			expect(table).toHaveProperty(propertyName);
			
			expect(table[propertyName]).toEqual(tableColor);
			
			table.childEntities.forEach(column => {
				expect(column).toHaveProperty(propertyName);
				expect(column[propertyName]).toEqual(columnColor);
			});
		});
	});
});



// See ./testingHelpers/fkToTableData
test("FilterableSchemaList getForeignKeysToTable will return an array to destructure, containing the target table, and then an array of matching tables (only the tables will have isMatch set to true)", () => {
	
	const filtList = new FilterableSchemaList(fkToTableData.fullList, "", "", "");
	
	const [targetTable, matchingSchemas] = filtList.getForeignKeysToTable(fkToTableData.targetTableID);
	
	expect(targetTable.id).toEqual(fkToTableData.targetTableID);
	expect(matchingSchemas.length).toEqual(fkToTableData.expectMatchSchemaIDs.length);
	
	let returnedTableIDs = [];
	
	matchingSchemas.forEach(schema => {
		expect(fkToTableData.expectMatchSchemaIDs.includes(schema.id)).toBeTruthy();
		expect(schema.isMatch).toBeFalsy();
		
		schema.childEntities.forEach(table => {
			expect(fkToTableData.expectMatchTableIDs.includes(table.id)).toBeTruthy();
			expect(table.isMatch).toBeTruthy();
			returnedTableIDs.push(table.id);
		});
	});
	
	expect(fkToTableData.expectMatchTableIDs.length).toEqual(returnedTableIDs.length);
});