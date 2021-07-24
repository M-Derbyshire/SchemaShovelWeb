import FilterableSchemaList from './FilterableSchemaList';

import schemaFilterData from './testingHelpers/schemaFilterData';
import tableFilterData from './testingHelpers/tableFilterData';
import columnFilterData from './testingHelpers/columnFilterData';
import multiFilterData from './testingHelpers/multiFilterData';
import propertyAdditionData from './testingHelpers/propertyAdditionData';
import fkToTableData from './testingHelpers/fkToTableData';


test.each([
	[
		["test1"],
		"#FF0000",
		"#00FF00",
		"#0000FF"
	],
	[
		["test2"],
		"#FFFFFF",
		"#000000",
		"#AAAAAA"
	],
])("FilterableSchemaList constructor will set the full list and colors, and getters will return them", 
	(fullList, schemaColor, tableColor, columnColor) => {
	
	const filtList = new FilterableSchemaList(fullList, schemaColor, tableColor, columnColor);
	
	expect(filtList.getFullList()).toEqual(fullList);
	expect(filtList.schemaColor).toEqual(schemaColor);
	expect(filtList.tableColor).toEqual(tableColor);
	expect(filtList.columnColor).toEqual(columnColor);
});


//See ./testingHelpers/schemaFilterData
test("FilterableSchemaList getFilteredList will filter schema results (case-insensitive), both with and without matching descriptions", () => {
	
	const filtList = new FilterableSchemaList(schemaFilterData.fullList, "", "", "");
	const expectedNoDesc = schemaFilterData.expectedResultWithoutDescriptions;
	const expectedWithDesc = schemaFilterData.expectedResultWithDescriptions;
	
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
	const expectedNoDesc = tableFilterData.expectedResultWithoutDescriptions;
	const expectedWithDesc = tableFilterData.expectedResultWithDescriptions;
	
	const matchesNoDesc = filtList.getFilteredList("", "match", "").tables;
	const matchesWithDesc = filtList.getFilteredList("", "match", "", true).tables;
	
	matchesNoDesc.forEach(matchTable => expect(expectedNoDesc.includes(matchTable.id)).toBeTruthy());
	expect(matchesNoDesc.length).toBe(expectedNoDesc.length);
	
	matchesWithDesc.forEach(matchTable => expect(expectedWithDesc.includes(matchTable.id)).toBeTruthy());
	expect(matchesWithDesc.length).toBe(expectedWithDesc.length);
});


// See ./testingHelpers/columnFilterData
test("FilterableSchemaList getFilteredList will filter table results (case-insensitive), both with and without matching descriptions", () => {
	
	const filtList = new FilterableSchemaList(columnFilterData.fullList, "", "", "");
	const expectedNoDesc = columnFilterData.expectedResultWithoutDescriptions;
	const expectedWithDesc = columnFilterData.expectedResultWithDescriptions;
	
	const matchesNoDesc = filtList.getFilteredList("", "", "match").tables.columns;
	const matchesWithDesc = filtList.getFilteredList("", "", "match", true).tables.columns;
	
	matchesNoDesc.forEach(matchColumn => expect(expectedNoDesc.includes(matchColumn.id)).toBeTruthy());
	expect(matchesNoDesc.length).toBe(expectedNoDesc.length);
	
	matchesWithDesc.forEach(matchColumn => expect(expectedWithDesc.includes(matchColumn.id)).toBeTruthy());
	expect(matchesWithDesc.length).toBe(expectedWithDesc.length);
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
		
		schema.tables.forEach(table => {
			entityTest(table);
			table.columns.forEach(column => entityTest(column));
		});
	});
});



test("FilterableSchemaList getFilteredList will add an isMatch property to all entities", () => {
	
	const propertyName = "isMatch";
	const filtList = new FilterableSchemaList(propertyAdditionData.fullList, "", "", "");
	
	const matches = filtList.getFilteredList("match", "match", "match");
	
	matches.forEach(schema => {
		expect(schema).toHaveProperty(propertyName);
		schema.tables.forEach(table => {
			expect(table).toHaveProperty(propertyName);
			table.columns.forEach(column => expect(column).toHaveProperty(propertyName));
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
])("FilterableSchemaList getFilteredList will add a colour property, with the correct color, to all entities", 
	(schemaColor, tableColor, columnColor) => {
	
	const propertyName = "color";
	
	const filtList = new FilterableSchemaList(propertyAdditionData.fullList, schemaColor, tableColor, columnColor);
	
	const matches = filtList.getFilteredList("match", "match", "match");
	
	matches.forEach(schema => {
		expect(schema).toHaveProperty(propertyName);
		
		expect(schema[propertyName]).toEqual(schemaColor);
		
		schema.tables.forEach(table => {
			expect(table).toHaveProperty(propertyName);
			
			expect(table[propertyName]).toEqual(tableColor);
			
			table.columns.forEach(column => {
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
		expect(fkToTableData.expectMatchSchemaIDs).includes(schema.id);
		expect(schema.isMatch).toBeFalsy();
		
		schema.tables.forEach(table => {
			expect(fkToTableData.expectMatchTableIDs).includes(table.id);
			expect(table.isMatch).toBeTruthy();
			returnedTableIDs.push(table.id);
		});
	});
	
	expect(fkToTableData.expectMatchTableIDs.length).toEqual(returnedTableIDs.length);
});