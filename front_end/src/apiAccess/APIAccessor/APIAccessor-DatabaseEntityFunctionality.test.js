import APIAccessor from './APIAccessor';
import fetchMock from "jest-fetch-mock";

const base_url = "/testAPI";

fetchMock.enableMocks();
beforeEach(() => {
	fetchMock.resetMocks();
});

const mockErrorCallback = ()=>{};

test("getDatabaseList() will access the database list from the correct URL, and return it", async () => {
	
	const api = new APIAccessor(base_url, mockErrorCallback);
	fetch.mockResponseOnce('[{ "id": 1, "name": "test1" }]');
	
	const result = await api.getDatabaseList();
	
	expect(fetch).toHaveBeenCalledWith(base_url + "/databases/", {});
	
	expect(result[0].id).toBe(1);
	expect(result[0].name).toBe("test1");
});



test("getDatabaseByID() will return the database object, from the right URL", async () => {
	
	const api = new APIAccessor(base_url, mockErrorCallback);
	const id = 1;
	fetch.mockResponseOnce('{ "id": 1, "name": "test1", "schemas": [] }');
	
	const result = await api.getDatabaseByID(id);
	
	expect(fetch).toHaveBeenCalledWith(base_url + "/databases/" + id, {});
	expect(Array.isArray(result)).toBeFalsy();
	expect(result.name).toBe("test1");
});





test("createDatabase() will return a new DB object, after having sent the correct data to the correct path", async () => {
	
	const api = new APIAccessor(base_url, mockErrorCallback);
	const name = "test1";
	
	fetch.mockResponseOnce(`{ "id": 1, "name": "${name}", "schemas": [] }`);
	
	const newDB = `{ "name": "${name}", "schemas": [] }`;
	const result = await api.createDatabase(newDB);
	
	expect(result.name).toBe(name);
	expect(fetch).toHaveBeenCalledWith(base_url + "/databases/", {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: newDB
	});
});






test("updateDatabaseName() will return the new DB object, after having sent the correct data to the correct path", async () => {
	
	const api = new APIAccessor(base_url, mockErrorCallback);
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



test("deleteDatabase() will return true if the database was successfully deleted", async () => {
	
	const api = new APIAccessor(base_url, mockErrorCallback);
	fetch.mockResponseOnce('', { status: 200 });
	
	expect(await api.deleteDatabase(0)).toBeTruthy();
});

test("deleteDatabase() will call the API with the correct path", async () => {
	
	const api = new APIAccessor(base_url, mockErrorCallback);
	const id = 1;
	
	fetch.mockResponseOnce('', { status: 200 });
	
	api.deleteDatabase(id);
	
	expect(fetch).toHaveBeenCalledWith(`${base_url}/databases/${id}`, {
		method: "DELETE"
	});
});