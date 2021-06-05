import APIAccessor from './APIAccessor';
import TestingSubclass from './TestingSubclass';
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();
beforeEach(() => {
	fetchMock.resetMocks();
});



test("hasErrors() will return true if there were errors", async () => {
	
	const api = new TestingSubclass("/");
	
	fetch.mockResponseOnce('{ "testProp": "testValue" }', { status: 404 });
	
	await api.addTestError("test");
	
	expect(api.hasErrors()).toBeTruthy();	
});

test("hasErrors() will return false if there were no errors", async () => {
	
	const api = new APIAccessor("/");
	expect(api.hasErrors()).toBeFalsy();
});




test("getNextError() will return the correct error", () => {
	
	const api = new TestingSubclass("/");
	
	const errorTexts = [
		"test error 0",
		"test error 1",
		"test error 2"
	];
	
	api.addTestError(errorTexts[0]);
	api.addTestError(errorTexts[1]);
	api.addTestError(errorTexts[2]);
	
	expect(api.getNextError()).toBe(errorTexts[0]);
	expect(api.getNextError()).toBe(errorTexts[1]);
	expect(api.getNextError()).toBe(errorTexts[2]);
});