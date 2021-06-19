import APIAccessor from './APIAccessor';
import TestingSubclass from './TestingSubclass';
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();
beforeEach(() => {
	fetchMock.resetMocks();
});

const mockErrorCallback = jest.fn();

const createDatabaseJSON = `{ "name": "test1", "schemas": [] }`;


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



test("getDatabaseList() will call the error callback if there's an error", async () => {
	
	const api = new TestingSubclass("/", mockErrorCallback);
	api.addTestError("test error");
	
	await api.getDatabaseList();
	
	expect(mockErrorCallback).toHaveBeenCalled();
});

test("getDatabaseList() will not call the error callback if there's no error", async () => {
	
	const api = new APIAccessor("/", mockErrorCallback);
	fetch.mockResponseOnce('[{ "id": 1, "name": "test1" }]');
	
	await api.getDatabaseList();
	
	expect(mockErrorCallback).not.toHaveBeenCalled();
});



test("getDatabaseByID() will call the error callback if there's an error", async () => {
	
	const api = new TestingSubclass("/", mockErrorCallback);
	api.addTestError("test error");
	
	await api.getDatabaseByID(1);
	
	expect(mockErrorCallback).toHaveBeenCalled();
});

test("getDatabaseByID() will not call the error callback if there's no error", async () => {
	
	const api = new APIAccessor("/", mockErrorCallback);
	fetch.mockResponseOnce('{ "id": 1, "name": "test1", "schemas": [] }');
	
	await api.getDatabaseByID(1);
	
	expect(mockErrorCallback).not.toHaveBeenCalled();
});



test("createDatabase() will call the error callback if there's an error", async () => {
	
	const api = new TestingSubclass("/", mockErrorCallback);
	api.addTestError("test error");
	
	await api.createDatabase(createDatabaseJSON);
	
	expect(mockErrorCallback).toHaveBeenCalled();
});

test("createDatabase() will not call the error callback if there's no error", async () => {
	
	const api = new APIAccessor("/", mockErrorCallback);
	fetch.mockResponseOnce('{ "id": 1, "name": "test1", "schemas": [] }');
	
	await api.createDatabase(createDatabaseJSON);
	
	expect(mockErrorCallback).not.toHaveBeenCalled();
});



test("updateDatabaseName() will call the error callback if there's an error", async () => {
	
	const api = new TestingSubclass("/", mockErrorCallback);
	api.addTestError("test error");
	
	await api.updateDatabaseName(1, "test2");
	
	expect(mockErrorCallback).toHaveBeenCalled();
});

test("updateDatabaseName() will not call the error callback if there's no error", async () => {
	
	const api = new APIAccessor("/", mockErrorCallback);
	fetch.mockResponseOnce('{ "id": 1, "name": "test1", "schemas": [] }');
	
	await api.updateDatabaseName(1, "test2");
	
	expect(mockErrorCallback).not.toHaveBeenCalled();
});



test("deleteDatabase() will call the error callback if there's an error", async () => {
	
	const api = new TestingSubclass("/", mockErrorCallback);
	api.addTestError("test error");
	
	await api.deleteDatabase(1);
	
	expect(mockErrorCallback).toHaveBeenCalled();
});

test("deleteDatabase() will not call the error callback if there's no error", async () => {
	
	const api = new APIAccessor("/", mockErrorCallback);
	fetch.mockResponseOnce('', {status: 200});
	
	await api.deleteDatabase(1);
	
	expect(mockErrorCallback).not.toHaveBeenCalled();
});



test("updateEntityDescription() will call the error callback if there's an error", async () => {
	
	const api = new TestingSubclass("/", mockErrorCallback);
	api.addTestError("test error");
	
	await api.updateEntityDescription("route", 1, "newDesc");
	
	expect(mockErrorCallback).toHaveBeenCalled();
});

test("updateEntityDescription() will not call the error callback if there's no error", async () => {
	
	const api = new APIAccessor("/", mockErrorCallback);
	fetch.mockResponseOnce('{ "id": 1, "description": "desc" }');
	
	await api.updateEntityDescription("route", 1, "newDesc");
	
	expect(mockErrorCallback).not.toHaveBeenCalled();
});