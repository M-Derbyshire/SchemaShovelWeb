import APIAccessor from './APIAccessor';
import TestingSubclass from './TestingSubclass';
import fetchMock from "jest-fetch-mock";

const base_url = "/testAPI/";

fetchMock.enableMocks();
beforeEach(() => {
	fetchMock.resetMocks();
});


test("getDatabaseList() will access the database list from the correct URL, and return it", async () => {
	
	const api = new APIAccessor(base_url);
	fetch.mockResponses('[{ "testProp": "testValue1" }, { "testProp": "testValue2" }]');
	
	const result = await api.getDatabaseList();
	
	expect(fetch).toHaveBeenCalledWith(base_url + "/databases/");
	
	expect(result[0].testProp).toBe("testValue1");
	expect(result[1].testProp).toBe("testValue2");
});

test("getDatabaseList() will return an empty array if there were errors, and raise them", async () => {
	
	const api = new APIAccessor("/");
	fetch.mockResponses(
		['[{ "testProp": "testValue" }]', { status: 404 }],
		['not valid JSON', { status: 200 }]
	);
	
	const badStatusResult = await api.getDatabaseList();
	const badJSONResult = await api.getDatabaseList();
	
	expect(Array.isArray(badStatusResult)).toBeTruthy();
	expect(Array.isArray(badJSONResult)).toBeTruthy();
	expect(badStatusResult.length).toBe(0);
	expect(badJSONResult.length).toBe(0);
	
	expect(api.hasErrors()).toBeTruthy();
});

test("getDatabaseList() will return an empty array, and raise an error, if the JSON was not an array", async () => {
	
	const api = new APIAccessor("/");
	fetch.mockResponseOnce('{ "testProp": "testValue" }');
	
	const result = await api.getDatabaseList();
	
	expect(Array.isArray(result)).toBeTruthy();
	expect(result.length).toBe(0);
	
	expect(api.hasErrors()).toBeTruthy();
});



