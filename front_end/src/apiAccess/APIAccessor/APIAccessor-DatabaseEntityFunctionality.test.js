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
	fetch.mockResponseOnce('[{ "id": 1, "name": "test1" }]');
	
	const result = await api.getDatabaseList();
	
	expect(fetch).toHaveBeenCalledWith(base_url + "/databases/", {});
	
	expect(result[0].id).toBe(1);
	expect(result[0].name).toBe("test1");
});

test("getDatabaseList() will return an empty array if there were errors, and raise them", async () => {
	
	const api = new APIAccessor("/");
	fetch.mockResponses(
		['[{ "id": 1, "name": "test1" }]', { status: 404 }],
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
	fetch.mockResponseOnce('{ "id": 1, "name": "test1" }');
	
	const result = await api.getDatabaseList();
	
	expect(Array.isArray(result)).toBeTruthy();
	expect(result.length).toBe(0);
	
	expect(api.hasErrors()).toBeTruthy();
});

test("getDatabaseList() will use a JSONValidator to validate the returned JSON", async () => {
	
	const api = new APIAccessor("/");
	fetch.mockResponseOnce('[{ "notValidProp": "test1" }]');
	
	const result = await api.getDatabaseList();
	
	expect(Array.isArray(result)).toBeTruthy();
	expect(result.length).toBe(0);
	expect(api.hasErrors()).toBeTruthy();
});





test("getDatabaseByID() will return the database object, from the right URL", async () => {
	
	const api = new APIAccessor(base_url);
	const id = 1;
	fetch.mockResponseOnce('{ "id": 1, "name": "test1", "schemas": [] }');
	
	const result = await api.getDatabaseByID(id);
	
	expect(fetch).toHaveBeenCalledWith(base_url + "/databases/" + id, {});
	expect(Array.isArray(result)).toBeFalsy();
	expect(result.name).toBe("test1");
});

test("getDatabaseByID() will return an empty object if there were errors, and raise them", async () => {
	
	const api = new APIAccessor(base_url);
	fetch.mockResponses(
		['{ "id": 1, "name": "test1", "schemas": [] }', { status: 404 }],
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
	fetch.mockResponseOnce('[{ "id": 1, "name": "test1", "schemas": [] }]');
	
	const result = await api.getDatabaseByID(0);
	
	expect(Object.keys(result).length).toBe(0);
	expect(api.hasErrors()).toBeTruthy();
});

test("getDatabaseByID() will use a JSONValidator to validate the returned JSON", async () => {
	
	const api = new APIAccessor("/");
	fetch.mockResponseOnce('{ "notValidProp": "test1" }');
	
	const result = await api.getDatabaseByID(0);
	
	expect(Object.keys(result).length).toBe(0);
	expect(api.hasErrors()).toBeTruthy();
});



test("updateDatabaseName() will return the new DB object, after having sent the correct data to the correct path", async () => {
	
	const api = new APIAccessor(base_url);
	const newName = "testChange";
	const dbID = 1
	
	const resultValue = "test";
	fetch.mockResponseOnce(`{ "id": 1, "name": "${resultValue}", "schemas": [] }`);
	
	const result = await api.updateDatabaseName(dbID, newName);
	
	expect(result.name).toBe(resultValue);
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
	fetch.mockResponseOnce('{ "id": 1, "name": "test", "schemas": [] }');
	
	const result = await api.updateDatabaseName(0, true);
	
	expect(Object.keys(result).length).toBe(0);
	expect(api.hasErrors()).toBeTruthy();
});

test("updateDatabaseName() will return an empty object, and raise an error, if the result JSON was an array", async () => {
	
	const api = new APIAccessor(base_url);
	fetch.mockResponseOnce('[{ "id": 1, "name": "test", "schemas": [] }]');
	
	const result = await api.updateDatabaseName(0, "test");
	
	expect(Object.keys(result).length).toBe(0);
	expect(api.hasErrors()).toBeTruthy();
});

test("updateDatabaseName() will return an empty object, and raise errors, if there were any", async () => {
	
	const api = new APIAccessor(base_url);
	fetch.mockResponses(
		['{ "id": 1, "name": "test", "schemas": [] }', { status: 404 }],
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

test("updateDatabaseName() will use a JSONValidator to validate the returned JSON", async () => {
	
	const api = new APIAccessor("/");
	fetch.mockResponseOnce('{ "notValidProp": "test1" }');
	
	const result = await api.updateDatabaseName(0, "test");
	
	expect(Object.keys(result).length).toBe(0);
	expect(api.hasErrors()).toBeTruthy();
});



test("deleteDatabase() will return true if the database was successfully deleted", async () => {
	
	const api = new APIAccessor(base_url);
	fetch.mockResponseOnce('', { status: 200 });
	
	expect(await api.deleteDatabase(0)).toBeTruthy();
});

test("deleteDatabase() will return false, and raise an error, if there was an error", async () => {
	
	const api = new APIAccessor(base_url);
	fetch.mockResponseOnce('', { status: 404 });
	
	expect(await api.deleteDatabase(0)).toBeFalsy();
	expect(api.hasErrors()).toBeTruthy();
});

test("deleteDatabase() will call the API with the correct path", async () => {
	
	const api = new APIAccessor(base_url);
	const id = 1;
	
	fetch.mockResponseOnce('', { status: 200 });
	
	api.deleteDatabase(id);
	
	expect(fetch).toHaveBeenCalledWith(`${base_url}/databases/${id}`, {
		method: "DELETE"
	});
});