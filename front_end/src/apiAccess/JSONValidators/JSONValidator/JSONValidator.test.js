import TestingSubclass from '../testHelpers/TestingSubclass';

test("hasErrors will return true if there are errors", () => {
	
	const validator = new TestingSubclass();
	validator.addTestError("test error");
	expect(validator.hasErrors()).toBeTruthy();
	
});

test("hasErrors will return false if there are no errors", () => {
	
	const validator = new TestingSubclass();
	expect(validator.hasErrors()).toBeFalsy();
	
});

// See '../testHelpers/badSchemasJSON'
test("getNextError will remove and return an error (of type string)", () => {
	
	const validator = new TestingSubclass();
	
	const errorTexts = [
		"test error 0",
		"test error 1",
		"test error 2"
	];
	
	for(let i = 0; i < errorTexts.length; i++)
	{
		validator.addTestError(errorTexts[i]);
	}
	
	for(let i = 0; i < errorTexts.length; i++)
	{
		const nextErrorText = validator.getNextError();
		expect(typeof nextErrorText).toBe("string");
		expect(nextErrorText).toBe(errorTexts[i]);
	}
	
	expect(validator.hasErrors()).toBeFalsy();
	
});