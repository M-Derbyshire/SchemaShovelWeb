export default class MockAPIAccessor
{
	//Takes an array of data, that should returned from the API access methods
	//These array items should returned one by one with each method call.
	constructor(mockDataArray)
	{
		this._mockData = mockDataArray;
		this._errors = [];
	}
	
	addMockError(errorText)
	{
		this._errors.push(errorText);
	}
	
	hasErrors()
	{
		return (this._errors.length > 0);
	}
	
	getNextError()
	{
		return this._errors.shift();
	}
	
	
	
	_getNextMockData()
	{
		if(this._mockData.length > 0)
		{
			return this._mockData.shift();
		}
		else
		{
			return "No more mock data has been provided.";
		}
	}
	
	async getDatabaseList()
	{
		return this._getNextMockData();
	}
	
	async getDatabaseByID(id)
	{
		return this._getNextMockData();
	}
	
	async createDatabase(newDB)
	{
		return this._getNextMockData();
	}
	
	async updateDatabaseName(id, newName)
	{
		return this._getNextMockData();
	}
	
	async deleteDatabase(id)
	{
		return this._getNextMockData();
	}
	
	
	
	async updateEntityDescription(entityRouteName, id, newDescription)
	{
		return this._getNextMockData();
	}
}