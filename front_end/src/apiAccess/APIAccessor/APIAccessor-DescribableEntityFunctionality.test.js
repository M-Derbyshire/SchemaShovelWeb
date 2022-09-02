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
	expect(fetch).toHaveBeenCalledWith(`${base_url}/${entityRouteName}/update_description/${dbID}`, expect.objectContaining({
		method: "PATCH",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: `{"description":"${testNewDesc}"}`
	}));
});