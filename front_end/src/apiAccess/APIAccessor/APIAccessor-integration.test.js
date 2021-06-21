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


test("getDatabaseList() will use a JSONValidator to validate the returned JSON", async () => {
	
	const api = new APIAccessor("/", mockErrorCallback);
	fetch.mockResponseOnce('[{ "notValidProp": "test1" }]');
	
	await expect(async () => await api.getDatabaseList()).rejects.toThrow();
});

test("getDatabaseByID() will use a JSONValidator to validate the returned JSON", async () => {
	
	const api = new APIAccessor("/", mockErrorCallback);
	fetch.mockResponseOnce('{ "notValidProp": "test1" }');
	
	await expect(async () => await api.getDatabaseByID(0)).rejects.toThrow();
});

test("createDatabase() will use a JSONValidator to validate the returned JSON", async () => {
	
	const api = new APIAccessor("/", mockErrorCallback);
	fetch.mockResponseOnce('{ "notValidProp": "test1" }');
	
	const newDB = `{ "name": "${name}", "schemas": [] }`;
	await expect(async () => await api.createDatabase(newDB)).rejects.toThrow();
	
	expect(api.hasErrors()).toBeTruthy();
});

test("updateDatabaseName() will use a JSONValidator to validate the returned JSON", async () => {
	
	const api = new APIAccessor("/", mockErrorCallback);
	fetch.mockResponseOnce('{ "notValidProp": "test1" }');
	
	await expect(async () => await api.updateDatabaseName(0, "test")).rejects.toThrow();
	
	expect(api.hasErrors()).toBeTruthy();
});

test("updateEntityDescription() will use a JSONValidator to validate the returned JSON", async () => {
	
	const api = new APIAccessor("/", mockErrorCallback);
	fetch.mockResponseOnce('{ "notValidProp": "test1" }');
	
	await expect(async () => await api.updateEntityDescription(entityRouteName, 1, testNewDesc)).rejects.toThrow();
	
	expect(api.hasErrors()).toBeTruthy();
	expect(mockErrorCallback).toHaveBeenCalled();
});