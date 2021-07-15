import DatabaseJSONValidator from './DatabaseJSONValidator';

import checkValidatorErrorCount from '../testHelpers/checkValidatorErrorCount';
import badSchemas from '../testHelpers/badSchemasJSON';
import badTables from '../testHelpers/badTablesJSON';
import badUserColumns from '../testHelpers/badUserColumnJSON';
import badApiColumns from '../testHelpers/badApiColumnJSON';
import columsForFkToTableTest from '../testHelpers/columsForFkToTableTest';

import emptyNameJSON from '../testHelpers/emptyStringJSONs/emptyNameJSON';
import emptyNameSchemJSON from '../testHelpers/emptyStringJSONs/emptyNameSchemJSON';
import emptyNameTabJSON from '../testHelpers/emptyStringJSONs/emptyNameTabJSON';
import emptyNameColJSON from '../testHelpers/emptyStringJSONs/emptyNameColJSON';
import emptyFKColJSON from '../testHelpers/emptyStringJSONs/emptyFKColJSON';
import emptyDescSchemJSON from '../testHelpers/emptyStringJSONs/emptyDescSchemJSON';
import emptyDescTabJSON from '../testHelpers/emptyStringJSONs/emptyDescTabJSON';
import emptyDescColJSON from '../testHelpers/emptyStringJSONs/emptyDescColJSON';


test("Will return true from validateJSON if no errors", () => {
	
	const validator = new DatabaseJSONValidator();
	expect(validator.validateJSON('{ "id": 1, "name": "test", "schemas": [] }')).toBeTruthy();
});

// See '../testHelpers/badSchemasJSON'
test("Will return false from validateJSON if errors", () => {
	
	const validator = new DatabaseJSONValidator();
	expect(validator.validateJSON(badSchemas.json)).toBeFalsy();
	
});

test("Will raise an error from validateJSON if the given json is an array", () => {
	
	const validator = new DatabaseJSONValidator();
	expect(validator.validateJSON('[{ "id": 1, "name": "test", "schemas": [] }]')).toBeFalsy();
	expect(validator.hasErrors()).toBeTruthy();
});

test("Will raise errors from validateJSON if the first layer of JSON is missing properties", () => {
	
	const validator = new DatabaseJSONValidator();
	
	//No ID
	expect(validator.validateJSON('{ "name": "test", "schemas": [] }')).toBeFalsy();
	
	//No name
	expect(validator.validateJSON('{ "id": 1, "schemas": [] }')).toBeFalsy();
	
	//No schemas
	expect(validator.validateJSON('{ "id": 1, "name": "test" }')).toBeFalsy();
	
	//Should have raised 3 errors
	expect(validator.hasErrors()).toBeTruthy();
	validator.getNextError();
	validator.getNextError();
	validator.getNextError();
	expect(validator.hasErrors()).toBeFalsy();
});

test("Will not return an error from validateJSON if the id is missing, but shouldHaveIDProperty is false", () => {
	
	const validator = new DatabaseJSONValidator(false);
	
	//No ID
	expect(validator.validateJSON('{ "name": "test", "schemas": [] }')).toBeTruthy();
});

test("Will raise errors from validateJSON if the first layer of JSON has properties with incorrect types", () => {
	
	const validator = new DatabaseJSONValidator();
	
	expect(validator.validateJSON('{ "id": "incorrect", "name": "test", "schemas": [] }')).toBeFalsy();
	expect(validator.validateJSON('{ "id": 1, "name": true, "schemas": [] }')).toBeFalsy();
	expect(validator.validateJSON('{ "id": 1, "name": "test", "schemas": true }')).toBeFalsy();
	
	//Should have raised 3 errors
	expect(validator.hasErrors()).toBeTruthy();
	validator.getNextError();
	validator.getNextError();
	validator.getNextError();
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

// See '../testHelpers/badUserColumnJSON' and '../testHelpers/badApiColumnJSON'
test("Will find all errors with columns (expecting fkToTableStr field if from user, and fkToTableId if from API)", () => {
	
	const fromUserValidator = new DatabaseJSONValidator(false);
	const fromApiValidator = new DatabaseJSONValidator();
	
	const invalidUserColumnsSchemas = badUserColumns.json;
	const invalidApiColumnsSchemas = badApiColumns.json;
	const userErrorCount = badUserColumns.errorCount;
	const apiErrorCount = badApiColumns.errorCount;
	
	fromUserValidator.validateJSON(invalidUserColumnsSchemas);
	fromApiValidator.validateJSON(invalidApiColumnsSchemas);
	
	checkValidatorErrorCount(fromUserValidator, userErrorCount);
	checkValidatorErrorCount(fromApiValidator, apiErrorCount);
});

test("Will not create an error if a column does/doesn't have an fkToTable property, or if it is null or undefined", () => {
	
	const validator = new DatabaseJSONValidator();
	const validColumnsSchema = columsForFkToTableTest;
	
	validator.validateJSON(validColumnsSchema);
	expect(validator.hasErrors()).toBeFalsy();
});




test("Will allow empty strings for descriptions, but not for fkToTableStr or names", () => {
	
	const validator = new DatabaseJSONValidator(false);
	const clearAllErrors = () => {
		while(validator.hasErrors())
		{
			validator.getNextError();
		}
	};
	
	validator.validateJSON(emptyNameJSON);
	expect(validator.hasErrors()).toBeTruthy();
	clearAllErrors();
	validator.validateJSON(emptyNameSchemJSON);
	expect(validator.hasErrors()).toBeTruthy();
	clearAllErrors();
	validator.validateJSON(emptyNameTabJSON);
	expect(validator.hasErrors()).toBeTruthy();
	clearAllErrors();
	validator.validateJSON(emptyNameColJSON);
	expect(validator.hasErrors()).toBeTruthy();
	clearAllErrors();
	
	validator.validateJSON(emptyFKColJSON);
	expect(validator.hasErrors()).toBeTruthy();
	clearAllErrors();
	
	validator.validateJSON(emptyDescSchemJSON);
	expect(validator.hasErrors()).toBeFalsy();
	clearAllErrors();
	validator.validateJSON(emptyDescTabJSON);
	expect(validator.hasErrors()).toBeFalsy();
	clearAllErrors();
	validator.validateJSON(emptyDescColJSON);
	expect(validator.hasErrors()).toBeFalsy();
});