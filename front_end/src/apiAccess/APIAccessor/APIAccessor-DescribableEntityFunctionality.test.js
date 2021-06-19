import APIAccessor from './APIAccessor';
import fetchMock from "jest-fetch-mock";

const base_url = "/testAPI";
const entityRouteName = "testEntity";
const testNewDesc = "testing_description";

fetchMock.enableMocks();
beforeEach(() => {
	fetchMock.resetMocks();
});

const mockErrorCallback = ()=>{};

test("updateEntityDescription() will return the new object, after having sent the correct data to the correct path", async () => {
	
	const api = new APIAccessor(base_url, mockErrorCallback);
	const dbID = 1;
	fetch.mockResponseOnce(`{ "id": 1, "description": "${testNewDesc}" }`);
	
	const result = await api.updateEntityDescription(entityRouteName, 1, testNewDesc);
	
	expect(result.description).toBe(testNewDesc);
	expect(fetch).toHaveBeenCalledWith(`${base_url}/${entityRouteName}/${dbID}`, {
		method: "PATCH",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: `{"description":"${testNewDesc}"}`
	});
});

test("updateEntityDescription() will return an empty object, and raise an error, if the given description was not a string", async () => {
	
	const api = new APIAccessor(base_url, mockErrorCallback);
	fetch.mockResponseOnce(`{ "id": 1, "description": "${testNewDesc}" }`);
	
	const result = await api.updateEntityDescription(entityRouteName, 1, true);
	
	expect(Object.keys(result).length).toBe(0);
	expect(api.hasErrors()).toBeTruthy();
});

test("updateEntityDescription() will return an empty object, and raise an error, if the given entityRouteName was not a string", async () => {
	
	const api = new APIAccessor(base_url, mockErrorCallback);
	fetch.mockResponseOnce(`{ "id": 1, "description": "${testNewDesc}" }`);
	
	const result = await api.updateEntityDescription(true, 1, testNewDesc);
	
	expect(Object.keys(result).length).toBe(0);
	expect(api.hasErrors()).toBeTruthy();
});

test("updateEntityDescription() will return an empty object, and raise an error, if the result JSON was an array", async () => {
	
	const api = new APIAccessor(base_url, mockErrorCallback);
	fetch.mockResponseOnce('[{ "id": 1, "description": "test" }]');
	
	const result = await api.updateEntityDescription(entityRouteName, 1, testNewDesc);
	
	expect(Object.keys(result).length).toBe(0);
	expect(api.hasErrors()).toBeTruthy();
});

test("updateEntityDescription() will return an empty object, and raise errors, if there were any", async () => {
	
	const api = new APIAccessor(base_url, mockErrorCallback);
	fetch.mockResponses(
		['{ "id": 1, "description": "test" }', { status: 404 }],
		['not valid JSON'] 
	);
	
	const badStatusResult = await api.updateEntityDescription(entityRouteName, 1, testNewDesc);
	const badJSONResult = await api.updateEntityDescription(entityRouteName, 1, testNewDesc);
	
	expect(Object.keys(badStatusResult).length).toBe(0);
	expect(Object.keys(badJSONResult).length).toBe(0);
	
	expect(api.hasErrors()).toBeTruthy();
	
	//Did we raise both?
	api.getNextError();
	expect(api.hasErrors()).toBeTruthy();
});

test("updateEntityDescription() will use a JSONValidator to validate the returned JSON", async () => {
	
	const api = new APIAccessor("/", mockErrorCallback);
	fetch.mockResponseOnce('{ "notValidProp": "test1" }');
	
	const result = await api.updateEntityDescription(entityRouteName, 1, testNewDesc);
	
	expect(Object.keys(result).length).toBe(0);
	expect(api.hasErrors()).toBeTruthy();
});