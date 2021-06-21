import APIAccessor from './APIAccessor';
import TestingSubclass from './TestingSubclass';
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();
beforeEach(() => {
	fetchMock.resetMocks();
});

const mockErrorCallback = jest.fn();

const createDatabaseJSON = `{ "name": "test1", "schemas": [] }`;
const base_url = "/testAPI";
const entityRouteName = "testEntity";
const testNewDesc = "testing_description";


test("hasErrors() will return true if there were errors", async () => {
	
	const api = new TestingSubclass("/", mockErrorCallback);
	
	await api.addTestError("test");
	
	expect(api.hasErrors()).toBeTruthy();	
});

test("hasErrors() will return false if there were no errors", async () => {
	
	const api = new APIAccessor("/", mockErrorCallback);
	expect(api.hasErrors()).toBeFalsy();
});

test("getNextError() will return the correct error", () => {
	
	const api = new TestingSubclass("/", mockErrorCallback);
	
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
	
	//Make sure the errors were dequeued
	expect(api.hasErrors()).toBeFalsy();
});



test("getDatabaseList() will call the error callback, and throw an exception, if there's an error", async () => {
	
	const api = new APIAccessor("/", mockErrorCallback);
	fetch.mockResponses(
		['[{ "id": 1, "name": "test1" }]', { status: 404 }],
		['not valid JSON', { status: 200 }]
	);
	
	await expect(async () => await api.getDatabaseList()).rejects.toThrow(); //bad status
	await expect(async () => await api.getDatabaseList()).rejects.toThrow(); // bad json
	
	expect(api.hasErrors()).toBeTruthy();
	
	//Did we raise both?
	api.getNextError();
	expect(api.hasErrors()).toBeTruthy();
	
	expect(mockErrorCallback).toHaveBeenCalledTimes(2);
});

test("getDatabaseList() will throw and raise an error, if the JSON was not an array", async () => {
	
	const api = new APIAccessor("/", mockErrorCallback);
	fetch.mockResponseOnce('{ "id": 1, "name": "test1" }');
	
	await expect(async () => await api.getDatabaseList()).rejects.toThrow();
	
	expect(api.hasErrors()).toBeTruthy();
	
	expect(mockErrorCallback).toHaveBeenCalled();
});

test("getDatabaseList() will not throw or call the error callback if there's no error", async () => {
	
	const api = new APIAccessor("/", mockErrorCallback);
	fetch.mockResponseOnce('[{ "id": 1, "name": "test1" }]');
	
	await api.getDatabaseList();
	
	expect(mockErrorCallback).not.toHaveBeenCalled();
});



test("getDatabaseByID() will call the error callback, and throw an exception, if there's an error", async () => {
	
	const api = new APIAccessor(base_url, mockErrorCallback);
	fetch.mockResponses(
		['{ "id": 1, "name": "test1", "schemas": [] }', { status: 404 }],
		['not valid JSON'] 
	);
	
	await expect(async () => await api.getDatabaseByID(0)).rejects.toThrow(); //bad status
	await expect(async () => await api.getDatabaseByID(0)).rejects.toThrow(); //bad json
	
	expect(api.hasErrors()).toBeTruthy();
	
	//Did we raise both?
	api.getNextError();
	expect(api.hasErrors()).toBeTruthy();
	
	expect(mockErrorCallback).toHaveBeenCalledTimes(2);
});

test("getDatabaseByID() will throw and raise an error if the returned JSON was an array", async () => {
	
	const api = new APIAccessor(base_url, mockErrorCallback);
	fetch.mockResponseOnce('[{ "id": 1, "name": "test1", "schemas": [] }]');
	
	await expect(async () => await api.getDatabaseByID(0)).rejects.toThrow();
	
	expect(api.hasErrors()).toBeTruthy();
	
	expect(mockErrorCallback).toHaveBeenCalled();
});



test("getDatabaseByID() will not throw or call the error callback if there's no error", async () => {
	
	const api = new APIAccessor("/", mockErrorCallback);
	fetch.mockResponseOnce('{ "id": 1, "name": "test1", "schemas": [] }');
	
	await api.getDatabaseByID(1);
	
	expect(mockErrorCallback).not.toHaveBeenCalled();
});



test("createDatabase() will throw/raise errors, if there were any", async () => {
	
	const api = new APIAccessor(base_url, mockErrorCallback);
	fetch.mockResponses(
		['{ "id": 1, "name": "test", "schemas": [] }', { status: 404 }],
		['not valid JSON'] 
	);
	
	const newDB = `{ "name": "${name}", "schemas": [] }`;
	await expect(async () => await api.createDatabase(newDB)).rejects.toThrow(); //bad status
	await expect(async () => await api.createDatabase(newDB)).rejects.toThrow(); //invalid JSON
	
	expect(api.hasErrors()).toBeTruthy();
	//Did we raise both?
	api.getNextError();
	api.getNextError();
	expect(api.hasErrors()).toBeFalsy();
	
	expect(mockErrorCallback).toHaveBeenCalled();
});

test("createDatabase() will throw/raise an error, if the passed in JSON was invalid", async () => {
	
	const api = new APIAccessor(base_url, mockErrorCallback);
	fetch.mockResponseOnce(`{ "id": 1, "name": "test", "schemas": [] }`); //correct, so won't cause an error
	
	const newDB = `{ "name": "badTest" }`; //No schemas array
	await expect(async () => await api.createDatabase(newDB)).rejects.toThrow();
	
	expect(api.hasErrors()).toBeTruthy();
	expect(mockErrorCallback).toHaveBeenCalled();
});

test("createDatabase() will throw/raise an error if the result JSON was an array", async () => {
	
	const api = new APIAccessor(base_url, mockErrorCallback);
	fetch.mockResponseOnce('[{ "id": 1, "name": "test", "schemas": [] }]');
	
	const newDB = `{ "name": "${name}", "schemas": [] }`;
	await expect(async () => await api.createDatabase(newDB)).rejects.toThrow();
	
	expect(api.hasErrors()).toBeTruthy();
	expect(mockErrorCallback).toHaveBeenCalled();
});

test("createDatabase() will not throw or call the error callback if there's no error", async () => {
	
	const api = new APIAccessor("/", mockErrorCallback);
	fetch.mockResponseOnce('{ "id": 1, "name": "test1", "schemas": [] }');
	
	await api.createDatabase(createDatabaseJSON);
	
	expect(mockErrorCallback).not.toHaveBeenCalled();
});



test("updateDatabaseName() will throw/raise errors, if there were any", async () => {
	
	const api = new APIAccessor(base_url, mockErrorCallback);
	fetch.mockResponses(
		['{ "id": 1, "name": "test", "schemas": [] }', { status: 404 }],
		['not valid JSON'] 
	);
	
	await expect(async () => await api.updateDatabaseName(0, "test")).rejects.toThrow(); //bad status
	await expect(async () => await api.updateDatabaseName(0, "test")).rejects.toThrow(); //bad json
	
	expect(api.hasErrors()).toBeTruthy();
	
	//Did we raise both?
	api.getNextError();
	expect(api.hasErrors()).toBeTruthy();
	
	expect(mockErrorCallback).toHaveBeenCalled();
});

test("updateDatabaseName() will throw/raise an error, if the result JSON was an array", async () => {
	
	const api = new APIAccessor(base_url, mockErrorCallback);
	fetch.mockResponseOnce('[{ "id": 1, "name": "test", "schemas": [] }]');
	
	await expect(async () => await api.updateDatabaseName(0, "test")).rejects.toThrow();
	
	expect(api.hasErrors()).toBeTruthy();
	expect(mockErrorCallback).toHaveBeenCalled();
});

test("updateDatabaseName() will not throw or call the error callback if there's no error", async () => {
	
	const api = new APIAccessor("/", mockErrorCallback);
	fetch.mockResponseOnce('{ "id": 1, "name": "test1", "schemas": [] }');
	
	await api.updateDatabaseName(1, "test2");
	
	expect(mockErrorCallback).not.toHaveBeenCalled();
});

test("updateDatabaseName() will throw/raise an error, if the given name was not a string", async () => {
	
	const api = new APIAccessor(base_url, mockErrorCallback);
	fetch.mockResponseOnce('{ "id": 1, "name": "test", "schemas": [] }');
	
	await expect(async () => await api.updateDatabaseName(0, true)).rejects.toThrow();
	
	expect(api.hasErrors()).toBeTruthy();
	expect(mockErrorCallback).toHaveBeenCalled();
});



test("deleteDatabase() will call the error callback, and throw an exception, if there's an error", async () => {
	
	const api = new TestingSubclass("/", mockErrorCallback);
	api.addTestError("test error");
	
	await expect(async () => await api.deleteDatabase(1)).rejects.toThrow();
	expect(mockErrorCallback).toHaveBeenCalled();
});

test("deleteDatabase() will throw/raise an error, if there was an error", async () => {
	
	const api = new APIAccessor(base_url, mockErrorCallback);
	fetch.mockResponseOnce('', { status: 404 });
	
	await expect(async () => await api.deleteDatabase(0)).rejects.toThrow();
	expect(api.hasErrors()).toBeTruthy();
	
	expect(mockErrorCallback).toHaveBeenCalled();
});

test("deleteDatabase() will not throw or call the error callback if there's no error", async () => {
	
	const api = new APIAccessor("/", mockErrorCallback);
	fetch.mockResponseOnce('', {status: 200});
	
	await api.deleteDatabase(1);
	
	expect(mockErrorCallback).not.toHaveBeenCalled();
});



test("updateEntityDescription() will throw/raise errors, if there were any", async () => {
	
	const api = new APIAccessor(base_url, mockErrorCallback);
	fetch.mockResponses(
		['{ "id": 1, "description": "test" }', { status: 404 }],
		['not valid JSON'] 
	);
	
	await expect(async () => await api.updateEntityDescription(entityRouteName, 1, testNewDesc)).rejects.toThrow(); //bad status
	await expect(async () => await api.updateEntityDescription(entityRouteName, 1, testNewDesc)).rejects.toThrow(); //bad json
	
	expect(api.hasErrors()).toBeTruthy();
	
	//Did we raise both?
	api.getNextError();
	expect(api.hasErrors()).toBeTruthy();
	
	expect(mockErrorCallback).toHaveBeenCalled();
});

test("updateEntityDescription() will throw/raise an error, if the given description was not a string", async () => {
	
	const api = new APIAccessor(base_url, mockErrorCallback);
	fetch.mockResponseOnce(`{ "id": 1, "description": "${testNewDesc}" }`);
	
	await expect(async () => await api.updateEntityDescription(entityRouteName, 1, true)).rejects.toThrow();
	
	expect(api.hasErrors()).toBeTruthy();
	
	expect(mockErrorCallback).toHaveBeenCalled();
});

test("updateEntityDescription() will throw/raise an error, if the given entityRouteName was not a string", async () => {
	
	const api = new APIAccessor(base_url, mockErrorCallback);
	fetch.mockResponseOnce(`{ "id": 1, "description": "${testNewDesc}" }`);
	
	await expect(async () => await api.updateEntityDescription(true, 1, testNewDesc)).rejects.toThrow();
	
	expect(api.hasErrors()).toBeTruthy();
	expect(mockErrorCallback).toHaveBeenCalled();
});

test("updateEntityDescription() will throw/raise an error, if the result JSON was an array", async () => {
	
	const api = new APIAccessor(base_url, mockErrorCallback);
	fetch.mockResponseOnce('[{ "id": 1, "description": "test" }]');
	
	await expect(async () => await api.updateEntityDescription(entityRouteName, 1, testNewDesc)).rejects.toThrow();
	
	expect(api.hasErrors()).toBeTruthy();
	expect(mockErrorCallback).toHaveBeenCalled();
});

test("updateEntityDescription() will not throw or call the error callback if there's no error", async () => {
	
	const api = new APIAccessor("/", mockErrorCallback);
	fetch.mockResponseOnce('{ "id": 1, "description": "desc" }');
	
	await api.updateEntityDescription("route", 1, "newDesc");
	
	expect(mockErrorCallback).not.toHaveBeenCalled();
});