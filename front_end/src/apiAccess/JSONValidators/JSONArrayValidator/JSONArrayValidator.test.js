import JSONArrayValidator from './JSONArrayValidator';

const testValidProperties = [
	{ name: "description", type: "string" },
	{ name: "id", type: "number" }
];

const itemTypeName = "type";

test("Will return true from validateJSON if no errors", () => {
	
	const validator = new JSONArrayValidator(itemTypeName, testValidProperties);
	expect(
		validator.validateJSON(`[{"description": "test", "id": 1}, {"description": "test", "id": 2}]`)
	).toBeTruthy();
	
});

test("Will return false from validateJSON if errors", () => {
	
	const validator = new JSONArrayValidator(itemTypeName, testValidProperties);
	expect(validator.validateJSON("[{}]")).toBeFalsy();
	
});

test("Will have an error if given JSON is unparseable", () => {
	
	const validator = new JSONArrayValidator(itemTypeName, testValidProperties);
	validator.validateJSON("invalid string");
	expect(validator.hasErrors()).toBeTruthy();
	
});

test("Will raise an error if given json is not an array", () => {
	
	const validator = new JSONArrayValidator(itemTypeName, testValidProperties);
	validator.validateJSON('{"description": "test", "id": 1}');
	expect(validator.hasErrors()).toBeTruthy();
	
});

test("Will raise an error if the given JSON's item does not have a required property", () => {
	
	const validator = new JSONArrayValidator(itemTypeName, testValidProperties);
	validator.validateJSON('[{ "id": 1 }]');
	
	expect(validator.hasErrors()).toBeTruthy();
	
});

test("Will raise an error if the given JSON's properties are not of the right type.", () => {
	
	const validator = new JSONArrayValidator(itemTypeName, testValidProperties);
	validator.validateJSON('[{ "description": 1, "id": "one" }]');
	
	expect(validator.hasErrors()).toBeTruthy();
	
});