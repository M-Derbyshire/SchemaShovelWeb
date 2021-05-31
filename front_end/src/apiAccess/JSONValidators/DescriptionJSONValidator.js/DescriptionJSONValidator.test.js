import DescriptionJSONValidator from './DescriptionJSONValidator';

test("Will return true from validateJSON if no errors", () => {
	
	const validator = new DescriptionJSONValidator();
	expect(validator.validateJSON('[{"description": "test"}]')).toBeTruthy();
	
});

test("Will return false from validateJSON if errors", () => {
	
	const validator = new DescriptionJSONValidator();
	expect(validator.validateJSON("[]")).toBeFalsy(); //empty array
	
});

test("Will have an error if given JSON is unparseable", () => {
	
	const validator = new DescriptionJSONValidator();
	validator.validateJSON("invalid string");
	expect(validator.hasErrors()).toBeTruthy();
	
});

test("Will raise an error if given json array is empty", () => {
	
	const validator = new DescriptionJSONValidator();
	validator.validateJSON("[]");
	expect(validator.hasErrors).toBeTruthy();
	
});

test("Will raise an error is given JSON array has more than 1 item", () => {
	
	const validator = new DescriptionJSONValidator();
	const json = JSON.stringify([
		{ description: "1" },
		{ description: "2" },
		{ description: "3" }
	]);
	
	validator.validateJSON(json);
	expect(validator.hasErrors).toBeTruthy();
	
});

//This is for the API's sake, as that should only accept an array
test("Will raise an error if the given JSON is not in an array", () => {
	
	const validator = new DescriptionJSONValidator();
	validator.validateJSON('{ "description": "test" }');
	
	expect(validator.hasErrors()).toBeTruthy();
	
});

test("Will raise an error if the given JSON's item does not have a description property", () => {
	
	const validator = new DescriptionJSONValidator();
	validator.validateJSON('[{}]');
	
	expect(validator.hasErrors()).toBeTruthy();
	
});

test("Will raise an error if the given JSON's description is not a string", () => {
	
	const validator = new DescriptionJSONValidator();
	validator.validateJSON('[{ "description": 1 }]');
	
	expect(validator.hasErrors()).toBeTruthy();
	
});

test("Will raise an error if the given JSON's item has an extra property", () => {
	
	const validator = new DescriptionJSONValidator();
	validator.validateJSON('[{ "description": "test", "iShouldNotBeHere": "test" }]');
	
	expect(validator.hasErrors()).toBeTruthy();
	
});