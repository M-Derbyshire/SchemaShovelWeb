import DatabaseJSONValidator from './DatabaseJSONValidator';

import checkValidatorErrorCount from '../testHelpers/checkValidatorErrorCount';
import badSchemas from '../testHelpers/badSchemasJSON';
import badTables from '../testHelpers/badTablesJSON';
import badColumns from '../testHelpers/badColumnJSON';
import columsForFkToTableTest from '../testHelpers/columsForFkToTableTest';


test("Will return true from validateJSON if no errors", () => {
	
	const validator = new DatabaseJSONValidator();
	expect(validator.validateJSON("[]")).toBeTruthy();
	
});

// See '../testHelpers/badSchemasJSON'
test("Will return false from validateJSON if errors", () => {
	
	const validator = new DatabaseJSONValidator();
	expect(validator.validateJSON(badSchemas.json)).toBeFalsy();
	
});

// See '../testHelpers/badSchemasJSON'
test("hasErrors will return true if there are errors", () => {
	
	const validator = new DatabaseJSONValidator();
	validator.validateJSON(badSchemas.json);
	expect(validator.hasErrors()).toBeTruthy();
	
});

test("hasErrors will return false if there are no errors", () => {
	
	const validator = new DatabaseJSONValidator();
	validator.validateJSON("[]");
	expect(validator.hasErrors()).toBeFalsy();
	
});

// See '../testHelpers/badSchemasJSON'
test("getNextError will remove and return an error (of type string)", () => {
	
	const validator = new DatabaseJSONValidator();
	validator.validateJSON(badSchemas.json);
	
	for(let i = 0; i < badSchemas.errorCount; i++)
	{
		expect(typeof validator.getNextError()).toBe("string");
	}
	
	expect(validator.hasErrors()).toBeFalsy();
	
});

test("Will have an error if given JSON is unparseable", () => {
	
	const validator = new DatabaseJSONValidator();
	validator.validateJSON("invalid string");
	expect(validator.hasErrors()).toBeTruthy();
	
});


// See '../testHelpers/badSchemasJSON'
test("Will find all errors with schemas", () => {
	
	const validator = new DatabaseJSONValidator();
	
	const invalidSchemas = badSchemas.json;
	const errorCount = badSchemas.errorCount;
	
	
	validator.validateJSON(invalidSchemas);
	
	checkValidatorErrorCount(validator, errorCount);
	
});

// See '../testHelpers/badTablesJSON'
test("Will find all errors with tables", () => {
	
	const validator = new DatabaseJSONValidator();
	
	const invalidTablesSchemas = badTables.json;
	const errorCount = badSchemas.errorCount;
	
	validator.validateJSON(invalidTablesSchemas);
	
	checkValidatorErrorCount(validator, errorCount);
});

// See '../testHelpers/badColumnJSON'
test("Will find all errors with columns", () => {
	
	const validator = new DatabaseJSONValidator();
	
	const invalidColumnsSchemas = badColumns.json;
	const errorCount = badColumns.errorCount;
	
	validator.validateJSON(invalidColumnsSchemas);
	
	checkValidatorErrorCount(validator, errorCount);
	
});

test("Will not create an error if a column does/doesn't have an fkToTable property", () => {
	
	const validator = new DatabaseJSONValidator();
	const validColumnsSchema = columsForFkToTableTest;
	
	validator.validateJSON(validColumnsSchema);
	expect(validator.hasErrors()).toBeFalsy();
});