import SingleItemJSONValidator from './SingleItemJSONValidator';

const testValidProperties = [
	{ name: "description", type: "string" },
	{ name: "id", type: "number" }
];

test("Will return true from validateJSON if no errors", () => {
	
	const validator = new SingleItemJSONValidator(testValidProperties);
	expect(validator.validateJSON(`{"description": "test", "id": 1}`)).toBeTruthy();
	
});

test("Will return false from validateJSON if errors", () => {
	
	const validator = new SingleItemJSONValidator(testValidProperties);
	expect(validator.validateJSON("{}")).toBeFalsy();
	
});

test("Will have an error if given JSON is unparseable", () => {
	
	const validator = new SingleItemJSONValidator(testValidProperties);
	validator.validateJSON("invalid string");
	expect(validator.hasErrors()).toBeTruthy();
	
});

test("Will raise an error if given json is an array", () => {
	
	const validator = new SingleItemJSONValidator(testValidProperties);
	validator.validateJSON("[]");
	expect(validator.hasErrors()).toBeTruthy();
	
});

test("Will raise an error if the given JSON's item does not have a required property", () => {
	
	const validator = new SingleItemJSONValidator(testValidProperties);
	validator.validateJSON('{ "id": 1 }');
	
	expect(validator.hasErrors()).toBeTruthy();
	
});

test("Will raise an error if the given JSON's properties are not of the right type.", () => {
	
	const validator = new SingleItemJSONValidator(testValidProperties);
	validator.validateJSON('{ "description": 1, "id": "one" }');
	
	expect(validator.hasErrors()).toBeTruthy();
	
});

test("Will raise an error if the given JSON's item has an extra property", () => {
	
	const validator = new SingleItemJSONValidator(testValidProperties);
	validator.validateJSON('{ "description": "test", "id": 1, "iShouldNotBeHere": "test" }');
	
	expect(validator.hasErrors()).toBeTruthy();
	
});