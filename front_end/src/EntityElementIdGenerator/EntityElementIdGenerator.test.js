import EntityElementIdGenerator from './EntityElementIdGenerator';

test.each([
	[1, "test1"],
	[2, "test2"],
	[3, "test3"]
])("getIdForSchema will return a string, containing the given ID and name", (id, name) => {
	
	const generator = new EntityElementIdGenerator();
	
	const result = generator.getIdForSchema(id, name);
	
	expect(result).toEqual(expect.stringContaining(id.toString()));
	expect(result).toEqual(expect.stringContaining(name));
});

test.each([
	[1, "test1"],
	[2, "test2"],
	[3, "test3"]
])("getIdForTable will return a string, containing the given ID and name", (id, name) => {
	
	const generator = new EntityElementIdGenerator();
	
	const result = generator.getIdForTable(id, name);
	
	expect(result).toEqual(expect.stringContaining(id.toString()));
	expect(result).toEqual(expect.stringContaining(name));
});

test.each([
	[1, "test1"],
	[2, "test2"],
	[3, "test3"]
])("getIdForColumn will return a string, containing the given ID and name", (id, name) => {
	
	const generator = new EntityElementIdGenerator();
	
	const result = generator.getIdForColumn(id, name);
	
	expect(result).toEqual(expect.stringContaining(id.toString()));
	expect(result).toEqual(expect.stringContaining(name));
});

test.each([
	[1, "test1"],
	[2, "test2"],
	[3, "test3"]
])("all 3 get-ID methods will return unique values, when given the same id and name", (id, name) => {
	
	const generator = new EntityElementIdGenerator();
	
	const schemaResult = generator.getIdForSchema(id, name);
	const tableResult = generator.getIdForTable(id, name);
	const columnResult = generator.getIdForColumn(id, name);
	
	expect(schemaResult).not.toEqual(tableResult);
	expect(tableResult).not.toEqual(columnResult);
	expect(columnResult).not.toEqual(schemaResult);
});