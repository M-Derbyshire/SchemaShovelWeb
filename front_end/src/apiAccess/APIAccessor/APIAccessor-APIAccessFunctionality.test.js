import APIAccessor from './APIAccessor';
import TestingSubclass from './TestingSubclass';
import fetchMock from "jest-fetch-mock";

const base_url = "/testAPI";

fetchMock.enableMocks();
beforeEach(() => {
	fetchMock.resetMocks();
});


test("getDatabaseList() will access the database list from the correct URL, and return it", async () => {
	
	const api = new APIAccessor(base_url);
	fetch.mockResponseOnce('[{ "testProp": "testValue1" }, { "testProp": "testValue2" }]');
	
	const result = await api.getDatabaseList();
	
	expect(fetch).toHaveBeenCalledWith(base_url + "/databases/", {});
	
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
	
	//Did we raise both?
	api.getNextError();
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





test("getDatabaseByID() will return the database object, from the right URL", async () => {
	
	const api = new APIAccessor(base_url);
	const id = 1;
	fetch.mockResponseOnce('{ "testProp": "testValue1" }');
	
	const result = await api.getDatabaseByID(id);
	
	expect(fetch).toHaveBeenCalledWith(base_url + "/databases/" + id, {});
	
	expect(Array.isArray(result)).toBeFalsy();
	expect(result.testProp).toBe("testValue1");
});

test("getDatabaseByID() will return an empty object if there were errors, and raise them", async () => {
	
	const api = new APIAccessor(base_url);
	fetch.mockResponses(
		['{ "testProp": "testValue1" }', { status: 404 }],
		['not valid JSON'] 
	);
	
	const badStatusResult = await api.getDatabaseByID(0);
	const badJSONResult = await api.getDatabaseByID(0);
	
	expect(Object.keys(badStatusResult).length).toBe(0);
	expect(Object.keys(badJSONResult).length).toBe(0);
	
	expect(api.hasErrors()).toBeTruthy();
	
	//Did we raise both?
	api.getNextError();
	expect(api.hasErrors()).toBeTruthy();
});

test("getDatabaseByID() will return an empty object, and raise an error, if the returned JSON was an array", async () => {
	
	const api = new APIAccessor(base_url);
	fetch.mockResponseOnce('[{ "testProp": "testValue1" }]');
	
	const result = await api.getDatabaseByID(0);
	
	expect(Object.keys(result).length).toBe(0);
	expect(api.hasErrors()).toBeTruthy();
});



test("updateDatabaseName() will return the new DB object, after having sent the correct data to the correct path", async () => {
	
	const api = new APIAccessor(base_url);
	const newName = "testChange";
	const dbID = 1
	
	const resultValue = "test";
	fetch.mockResponseOnce(`{ "testProp": "${resultValue}" }`);
	
	const result = await api.updateDatabaseName(dbID, newName);
	
	expect(result.testProp).toBe(resultValue);
	expect(fetch).toHaveBeenCalledWith(base_url + "/databases/" + dbID, {
		method: "PATCH",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: `{"name":"${newName}"}`
	});
});

test("updateDatabaseName() will return an empty object, and raise an error, if the given name was not a string", async () => {
	
	const api = new APIAccessor(base_url);
	fetch.mockResponseOnce('{ "testProp": "testValue" }');
	
	const result = await api.updateDatabaseName(0, true);
	
	expect(Object.keys(result).length).toBe(0);
	expect(api.hasErrors()).toBeTruthy();
});

test("updateDatabaseName() will return an empty object, and raise an error, if the result JSON was an array", async () => {
	
	const api = new APIAccessor(base_url);
	fetch.mockResponseOnce('[{ "testProp": "testValue1" }]');
	
	const result = await api.updateDatabaseName(0, "test");
	
	expect(Object.keys(result).length).toBe(0);
	expect(api.hasErrors()).toBeTruthy();
});

test("updateDatabaseName() will return an empty object, and raise errors, if there were any", async () => {
	
	const api = new APIAccessor(base_url);
	fetch.mockResponses(
		['{ "testProp": "testValue1" }', { status: 404 }],
		['not valid JSON'] 
	);
	
	const badStatusResult = await api.updateDatabaseName(0, "test");
	const badJSONResult = await api.updateDatabaseName(0, "test");
	
	expect(Object.keys(badStatusResult).length).toBe(0);
	expect(Object.keys(badJSONResult).length).toBe(0);
	
	expect(api.hasErrors()).toBeTruthy();
	
	//Did we raise both?
	api.getNextError();
	expect(api.hasErrors()).toBeTruthy();
});

